// Tests for the river (conduit) model + what-if compute. Verifies the flow
// budget against known values from the committed Bear River data and checks
// the what-if direction (lowering a diversion frees water for the lake).

import { describe, expect, it } from "vitest";
import { RiverModel } from "./river-model";
import {
  baselineMults,
  computeRiverWhatIf,
  flowToLakeSeries,
  initialDiversionValues,
  initialInflowValues,
  meanFlowToLake,
  riverDefaultYear,
  riverInflowRow,
  riverInflowSeries,
  riverYears,
} from "./river-compute";
import type { RiverConfig } from "./types";
import inflows from "@/data/water/bear-river/inflows.json";
import diversions from "@/data/water/bear-river/diversions.json";

const river: RiverConfig = {
  kind: "river",
  slug: "bear-river",
  name: "Bear River",
  shortName: "Bear",
  location: "Utah, USA",
  description: "test",
  source: { key: "corinne", label: "Bear River at Corinne", note: "USGS 10126000" },
  inflowComponents: [
    { key: "mainstem", label: "Main stem" },
    { key: "tributaries", label: "Tributaries" },
  ],
  yearRange: [1949, 2026],
  data: { inflows, diversions },
};

const model = new RiverModel(river.data.diversions);

describe("river: year helpers", () => {
  it("lists all water years in order", () => {
    const years = riverYears(river);
    expect(years[0]).toBe(1949);
    expect(years[years.length - 1]).toBe(2026);
    expect(years.length).toBe(72);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("defaults to the latest complete year", () => {
    // 2026 is partial (in progress), so the default is the latest complete year.
    expect(riverDefaultYear(river)).toBeLessThan(2026);
    expect(riverDefaultYear(river)).toBeGreaterThanOrEqual(2024);
  });

  it("finds the inflow row for a year", () => {
    const row = riverInflowRow(river, 1983);
    expect(row?.total).toBe(3666030);
    expect(riverInflowRow(river, 1900)).toBeNull();
  });
});

describe("river: flow budget (RiverModel)", () => {
  it("matches the committed budget for a wet year (1983)", () => {
    const row = riverInflowRow(river, 1983)!;
    const base = baselineMults(river);
    // Wet year: diversions take their full entitlement, residual is 5% of inflow.
    const flow = model.flowToLake(row, base, base, 0);
    expect(flow).toBeCloseTo(2902728, -1);
  });

  it("caps diversions in a dry year (1991)", () => {
    const row = riverInflowRow(river, 1991)!;
    const base = baselineMults(river);
    // Dry year: take scales with available flow, so far less reaches the lake.
    const flow = model.flowToLake(row, base, base, 0);
    expect(flow).toBeCloseTo(15786, -1);
    expect(flow).toBeLessThan(row.total!);
  });

  it("never returns negative flow", () => {
    const row = riverInflowRow(river, 1991)!;
    // Slash all diversions to 200% and all inflow to 0 — flow floors at 0.
    const zeroInflow = { mainstem: 0, tributaries: 0 };
    const doubleDiv = Object.fromEntries(river.data.diversions.diversions.map((d) => [d.key, 2]));
    expect(model.flowToLake(row, zeroInflow, doubleDiv, 0)).toBe(0);
  });
});

describe("river: average diversion + raw-inflow budget", () => {
  it("totalAvgDiversion sums all diversions' average takes", () => {
    // 280k + 120k + 110k + 70k AF = 580k AF = 0.58 MAF/yr.
    expect(model.totalAvgDiversion).toBeCloseTo(580_000, 0);
  });

  it("takes the full entitlement plus residual in a wet year", () => {
    // 1.8 MAF inflow: take = full 580k, residual = 5% = 90k → 1.13 MAF to the lake.
    expect(model.flowToLakeForInflow(1_800_000)).toBeCloseTo(1_130_000, 0);
  });

  it("applies the dry-year cap when inflow is about the size of the take", () => {
    // 580k inflow = the average take: take scales to 90% of inflow, residual 5% → 5% left.
    expect(model.flowToLakeForInflow(580_000)).toBeCloseTo(29_000, 0);
  });

  it("returns 0 for zero inflow", () => {
    expect(model.flowToLakeForInflow(0)).toBe(0);
  });

  it("matches the row-based breakdown at 100% multipliers", () => {
    const row = riverInflowRow(river, 2025)!;
    const base = baselineMults(river);
    // mainstem + tributaries rounds to the total within 1 AF.
    expect(model.flowToLakeForInflow(row.total!, base)).toBeCloseTo(
      model.flowToLake(row, base, base, 0),
      -1,
    );
  });
});

describe("river: breakdown (where the water goes)", () => {
  it("decomposes the balance so the parts sum to the inflow", () => {
    const row = riverInflowRow(river, 1983)!;
    const base = baselineMults(river);
    const b = model.breakdown(row, base, base, 0);
    // The balance closes: diversions + residual + flow-to-lake = inflow.
    expect(b.diversions + b.residual + b.flowToLake).toBeCloseTo(b.inflow, 3);
    expect(b.inflow).toBeGreaterThan(0);
    expect(b.diversions).toBeGreaterThan(0);
    expect(b.residual).toBeGreaterThan(0);
  });

  it("shows diversions dominating a dry year (2025)", () => {
    const row = riverInflowRow(river, 2025)!;
    const base = baselineMults(river);
    const b = model.breakdown(row, base, base, 0);
    // 2025 was dry: the diversions take most of the inflow, little reaches the lake.
    expect(b.diversions).toBeGreaterThan(b.inflow * 0.8);
    expect(b.flowToLake / 1e6).toBeCloseTo(0.03, 1);
  });

  it("shows most flow reaching the lake in a wet year (1983)", () => {
    const row = riverInflowRow(river, 1983)!;
    const base = baselineMults(river);
    const b = model.breakdown(row, base, base, 0);
    // Wet year: the fixed diversions take a small fraction, most reaches the lake.
    expect(b.flowToLake).toBeGreaterThan(b.diversions);
    expect(b.flowToLake / 1e6).toBeCloseTo(2.9, 1);
  });
});

describe("river: what-if", () => {
  it("lowering the largest diversion frees water for the lake", () => {
    const year = 1983;
    const base = baselineMults(river);
    const divs = { ...base, canals: 0 }; // stop the canals
    const result = computeRiverWhatIf(river, model, year, { mainstem: 1, tributaries: 1 }, divs);
    expect(result).not.toBeNull();
    // The canals take 280,000 AF in a wet year; stopping them adds that to the lake.
    expect(result!.delta).toBeCloseTo(280000, -1);
    expect(result!.whatIf).toBeGreaterThan(result!.baseline);
  });

  it("cutting an inflow component reduces flow to the lake", () => {
    const year = 1983;
    const base = baselineMults(river);
    const result = computeRiverWhatIf(river, model, year, { mainstem: 0.8, tributaries: 1 }, base);
    expect(result!.delta).toBeLessThan(0);
  });

  it("the BRD scenario reduces flow to the lake", () => {
    const year = 1983;
    const base = baselineMults(river);
    const withoutBrd = computeRiverWhatIf(river, model, year, base, base, 0)!;
    const withBrd = computeRiverWhatIf(river, model, year, base, base, 220000)!;
    expect(withBrd.whatIf).toBeLessThan(withoutBrd.whatIf);
    // In a wet year the BRD's full 220,000 AF is taken.
    expect(withoutBrd.whatIf - withBrd.whatIf).toBeCloseTo(220000, -1);
  });
});

describe("river: series", () => {
  it("computes a flow-to-lake series for every year", () => {
    const series = flowToLakeSeries(river, model);
    expect(series.length).toBe(72);
    for (const p of series) {
      expect(p.maf).toBeGreaterThanOrEqual(0);
      expect(p.maf).toBeLessThan(4); // MAF, well under the inflow
    }
  });

  it("computes an inflow series in MAF", () => {
    const series = riverInflowSeries(river);
    const wettest = series.reduce((a, b) => (a.maf > b.maf ? a : b));
    expect(wettest.maf).toBeCloseTo(3.666, -1);
  });

  it("computes a positive long-term mean flow", () => {
    expect(meanFlowToLake(river, model)).toBeGreaterThan(0);
    expect(meanFlowToLake(river, model)).toBeLessThan(1.5);
  });

  it("initial slider values match the selected year's actuals", () => {
    const year = 1983;
    const inflow = initialInflowValues(river, year);
    expect(inflow.mainstem).toBe(3299427); // 90% of 3,666,030
    expect(inflow.tributaries).toBe(366603); // 10% of 3,666,030
    const divs = initialDiversionValues(river);
    expect(divs.canals).toBe(280000);
    expect(divs.brmd).toBe(120000);
  });
});
