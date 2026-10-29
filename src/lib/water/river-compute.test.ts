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
