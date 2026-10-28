import { describe, expect, it } from "vitest";
import {
  allYears,
  computeLongTermMeans,
  computeProjection,
  computeWhatIf,
  defaultYear,
  evapForYear,
  findInflowRow,
  initialValues,
  lowMarker,
  observedSeries,
  projectionYears,
  sliderMaxAcft,
  totalInflow,
  yearNote,
} from "./compute";
import { WaterModel } from "./model";
import { ElevAreaCurve } from "./elev-area";
import { MAF } from "./format";
import type { LakeConfig } from "./types";
import calibration from "@/data/water/gsl/calibration.json";
import elevArea from "@/data/water/gsl/elev_area.json";
import inflows from "@/data/water/gsl/inflows.json";
import levels from "@/data/water/gsl/levels.json";

const lake: LakeConfig = {
  slug: "gsl",
  name: "Great Salt Lake",
  shortName: "GSL",
  location: "Utah, USA",
  description: "Great Salt Lake",
  magicLevel: 4200,
  horizonOptions: [5, 10, 15, 20],
  yearRange: [1949, 2026],
  rivers: [
    { key: "bear", label: "Bear River" },
    { key: "sevier", label: "Sevier River" },
    { key: "jordan", label: "Jordan River" },
    { key: "weber", label: "Weber River" },
  ],
  data: { levels, inflows, elevArea, calibration },
};

const curve = new ElevAreaCurve(elevArea);
const model = new WaterModel(curve.area);

describe("compute: year helpers", () => {
  it("allYears covers the full record ascending", () => {
    const years = allYears(lake);
    expect(years[0]).toBe(1949);
    expect(years[years.length - 1]).toBe(2026);
    expect(years).toHaveLength(new Set(years).size);
  });

  it("defaultYear is the most recent complete water year", () => {
    expect(defaultYear(lake)).toBe(2025);
  });

  it("projectionYears excludes the partial year", () => {
    const years = projectionYears(lake);
    expect(years).toContain(2025);
    expect(years).not.toContain(2026);
    expect(years).toHaveLength(allYears(lake).length - 1);
  });

  it("initialValues are the year's actuals; missing gauges read 0", () => {
    const vals = initialValues(lake, 2025);
    const row = findInflowRow(lake, 2025)!;
    for (const s of lake.rivers) {
      const a = row[s.key];
      expect(vals[s.key]).toBe(typeof a === "number" && a != null ? a : 0);
    }
  });

  it("initialValues for a gauge-gap year (1958) zero the missing gauge", () => {
    const vals = initialValues(lake, 1958);
    expect(vals.bear).toBe(0); // Bear River gauge absent 1957–1962
    expect(vals.sevier).toBeGreaterThan(0);
  });

  it("yearNote flags partial years and missing gauges", () => {
    expect(yearNote(lake, 2026)).toContain("partial");
    expect(yearNote(lake, 1958)).toContain("Bear");
    expect(yearNote(lake, 2025)).toBe("");
  });
});

describe("compute: baselines", () => {
  it("long-term means are the mean of the years with data", () => {
    const means = computeLongTermMeans(lake);
    let sum = 0;
    let n = 0;
    for (const row of inflows.data) {
      if (typeof row.bear === "number") {
        sum += row.bear;
        n++;
      }
    }
    expect(means.bear).toBeCloseTo(sum / n, 6);
    expect(means.bear).toBeCloseTo(1112444, 0);
    expect(means.jordan).toBeCloseTo(98194, 0);
    for (const s of lake.rivers) expect(means[s.key]).toBeGreaterThan(0);
  });

  it("sliderMax is 2× the wettest year", () => {
    let max = 0;
    for (const row of inflows.data) {
      if (typeof row.bear === "number" && row.bear > max) max = row.bear;
    }
    expect(sliderMaxAcft(lake, "bear")).toBe(2 * max);
  });

  it("evapForYear uses the per-year calibrated value, falling back to the mean", () => {
    const perYear = calibration.e_per_year.find((p) => p.year === 2025)!;
    expect(evapForYear(lake, 2025)).toBe(perYear.e);
    // A year beyond the record falls back to the mean.
    expect(evapForYear(lake, 2040)).toBe(calibration.e_ft_per_yr);
  });
});

describe("compute: what-if", () => {
  it("returns null for a year without an observed level row", () => {
    expect(computeWhatIf(lake, model, 1800, {})).toBeNull();
  });

  it("computes for a partial year that has an observed level (2026)", () => {
    const vals = initialValues(lake, 2026);
    const wi = computeWhatIf(lake, model, 2026, vals);
    expect(wi).not.toBeNull();
    expect(wi!.h0).toBe(4189.7);
  });

  it("at actuals the delta is near zero (evap model vs observed)", () => {
    const vals = initialValues(lake, 2025);
    const wi = computeWhatIf(lake, model, 2025, vals)!;
    expect(wi.h0).toBe(4191.0);
    expect(wi.actual).toBe(4189.7);
    expect(Math.abs(wi.delta)).toBeLessThan(1);
  });

  it("doubling all inflows raises the end level", () => {
    const vals = initialValues(lake, 2025);
    const doubled: Record<string, number> = {};
    for (const s of lake.rivers) doubled[s.key] = vals[s.key] * 2;
    const wi = computeWhatIf(lake, model, 2025, doubled)!;
    expect(wi.delta).toBeGreaterThan(0);
    expect(wi.end).toBeGreaterThan(wi.actual);
  });

  it("zero inflow lowers the end level", () => {
    const zero = { bear: 0, sevier: 0, jordan: 0, weber: 0 };
    const wi = computeWhatIf(lake, model, 2025, zero)!;
    expect(wi.delta).toBeLessThan(0);
  });

  it("matches an independent single-step model run", () => {
    const vals = { bear: 1.2 * MAF, sevier: 0.5 * MAF, jordan: 0.8 * MAF, weber: 0.3 * MAF };
    const wi = computeWhatIf(lake, model, 2024, vals)!;
    const I = totalInflow(lake, vals);
    const res = model.project(4192.4, [I], 1, { e: evapForYear(lake, 2024) });
    expect(wi.end).toBe(res.levels[0]);
  });
});

describe("compute: projection", () => {
  it("returns null without a start year", () => {
    const vals = initialValues(lake, 2025);
    expect(computeProjection(lake, model, null, 5, vals)).toBeNull();
  });

  it("projects the full horizon with per-year e", () => {
    const vals = initialValues(lake, 2025);
    const p = computeProjection(lake, model, 2025, 10, vals)!;
    expect(p.levels).toHaveLength(10);
    expect(p.bauLevels).toHaveLength(10);
    expect(p.endYear).toBe(2034);
    expect(p.e).toHaveLength(10);
    // 2025 has a calibrated per-year e; 2034 does not, so it uses the mean.
    expect(p.e[0]).toBe(calibration.e_per_year.find((x) => x.year === 2025)!.e);
    expect(p.e[9]).toBe(calibration.e_ft_per_yr);
  });

  it("BAU equals the scenario when the sliders sit at the long-term means", () => {
    const means = computeLongTermMeans(lake);
    const p = computeProjection(lake, model, 2025, 5, means)!;
    expect(p.I).toBeCloseTo(p.bauI, 6);
    expect(p.delta).toBeCloseTo(0, 9);
    expect(p.levels).toEqual(p.bauLevels);
  });

  it("matches independent model runs for a 15-year horizon", () => {
    const vals = { bear: 0.8 * MAF, sevier: 0.4 * MAF, jordan: 1.0 * MAF, weber: 0.2 * MAF };
    const p = computeProjection(lake, model, 2025, 15, vals)!;
    const I = totalInflow(lake, vals);
    const means = computeLongTermMeans(lake);
    const bauI = totalInflow(lake, means);
    const e = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) =>
      evapForYear(lake, 2025 + i),
    );
    const res = model.project(4191.0, new Array(15).fill(I), 15, { e });
    const resBau = model.project(4191.0, new Array(15).fill(bauI), 15, { e });
    expect(p.levels).toEqual(res.levels);
    expect(p.bauLevels).toEqual(resBau.levels);
    expect(p.delta).toBe(res.levels[14] - resBau.levels[14]);
  });

  it("a wet scenario ends above BAU; a dry one ends below", () => {
    const means = computeLongTermMeans(lake);
    const wet: Record<string, number> = {};
    const dry: Record<string, number> = {};
    for (const s of lake.rivers) {
      wet[s.key] = means[s.key] * 2;
      dry[s.key] = means[s.key] * 0.3;
    }
    expect(computeProjection(lake, model, 2025, 10, wet)!.delta).toBeGreaterThan(0);
    expect(computeProjection(lake, model, 2025, 10, dry)!.delta).toBeLessThan(0);
  });
});

describe("compute: chart series", () => {
  it("observedSeries yields sorted boundary points for every complete year", () => {
    const pts = observedSeries(lake);
    for (let i = 1; i < pts.length; i++) expect(pts[i][0]).toBeGreaterThanOrEqual(pts[i - 1][0]);
    expect(pts[0][0]).toBe(1847);
    // 180 rows, no nulls → 360 boundary points.
    expect(pts.length).toBe(360);
  });

  it("lowMarker falls back to the lowest observed boundary point", () => {
    const m = lowMarker(lake)!;
    expect(m.year).toBe(2022);
    expect(m.ft).toBe(4189.0);
  });

  it("respects an explicit config lowMarker", () => {
    const l2 = { ...lake, lowMarker: { year: 1990, ft: 4190, label: "custom" } };
    expect(lowMarker(l2)!.label).toBe("custom");
  });
});
