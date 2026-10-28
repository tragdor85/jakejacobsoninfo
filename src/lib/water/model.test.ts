import { describe, expect, it } from "vitest";
import { WaterModel, DEFAULT_E_FT_YR, resolveE, eForYear } from "./model";
import { ElevAreaCurve } from "./elev-area";
import elevAreaData from "../../data/water/gsl/elev_area.json";
import calibrationData from "../../data/water/gsl/calibration.json";
import type { CalibrationData, ElevAreaPoint } from "./types";

// Port of utahwater/dashboard/scripts/test_model.js, run against the
// committed GSL data snapshots.

const curve = new ElevAreaCurve(elevAreaData as ElevAreaPoint[]);
const model = new WaterModel(curve.area);
const calib = calibrationData as CalibrationData;
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const allFinite = (arr: number[]) => arr.every((v) => typeof v === "number" && isFinite(v));

describe("WaterModel (GSL)", () => {
  it("e=2, I=0: drops ~2 ft/yr every year (evaporation is a constant depth)", () => {
    const h0 = 4200;
    const r = model.project(h0, [], 5, { e: 2 });
    const drops = r.levels.map((h) => h0 - h);
    expect(drops.every((d, i) => near(d, 2 * (i + 1), 1e-6))).toBe(true);
  });

  it("same inflow: high/wide lake rises less than low/narrow (area nonlinearity)", () => {
    const I = 2.5e6;
    const rHigh = model.project(4211, [I], 1, { e: 0 });
    const rLow = model.project(4185, [I], 1, { e: 0 });
    const dhHigh = rHigh.levels[0] - 4211;
    const dhLow = rLow.levels[0] - 4185;
    expect(dhHigh).toBeLessThan(dhLow);
    expect(dhHigh).toBeGreaterThan(0.5);
    expect(dhHigh).toBeLessThan(2.5);
    expect(dhLow).toBeGreaterThan(3);
    expect(dhLow).toBeLessThan(15);
  });

  it("produces well-formed output arrays (length, finiteness, area/evap consistency)", () => {
    const h0 = 4195;
    const inflows = [1.2e6, 2.0e6, 0.8e6, 1.6e6, 1.0e6];
    const r = model.project(h0, inflows, 5, { e: 2 });
    expect(r.levels.length).toBe(5);
    expect(r.areas.length).toBe(5);
    expect(r.evap.length).toBe(5);
    expect(allFinite(r.levels)).toBe(true);
    expect(allFinite(r.areas)).toBe(true);
    expect(allFinite(r.evap)).toBe(true);
    for (let i = 0; i < 5; i++) {
      expect(r.areas[i]).toBeCloseTo(curve.area(r.levels[i]), 6);
    }
    expect(r.evap.every((v) => v > 0)).toBe(true);
    expect(near(r.evap[0], 2 * (curve.area(h0) + r.areas[0]) / 2, 1e-6)).toBe(true);
    expect(r.e).toBe(2);
  });

  it("no e and no fallback: uses the default 2 ft/yr", () => {
    const r = model.project(4200, [], 1);
    expect(r.e).toBe(DEFAULT_E_FT_YR);
  });

  it("nYears defaults to inflows.length; short inflows array pads with 0", () => {
    const r = model.project(4200, [1.0e6, 1.0e6]);
    expect(r.levels.length).toBe(2);
    const r2 = model.project(4200, [1.0e6], 3, { e: 2 });
    expect(near(r2.levels[2] - r2.levels[1], -2, 1e-6)).toBe(true);
  });

  it("78-yr run stays finite and within the clamped curve range", () => {
    const r = model.project(4200, new Array(78).fill(1.5e6), 78, { e: 2 });
    expect(allFinite(r.levels)).toBe(true);
    expect(r.levels.every((h) => h >= 4180 - 1e-6 && h <= 4215 + 1e-6)).toBe(true);
  });

  it("per-year e array: drops 1, 2, then rises 0.5 ft (negative entries allowed)", () => {
    const h0 = 4200;
    const r = model.project(h0, [], 3, { e: [1, 2, -0.5] });
    expect(near(r.levels[0], h0 - 1, 1e-6)).toBe(true);
    expect(near(r.levels[1], h0 - 3, 1e-6)).toBe(true);
    expect(near(r.levels[2], h0 - 2.5, 1e-6)).toBe(true);
    expect(Array.isArray(r.e)).toBe(true);
    expect((r.e as number[]).length).toBe(3);
    expect(near(r.evap[0], 1 * (curve.area(h0) + r.areas[0]) / 2, 1e-6)).toBe(true);
    expect(r.evap[2]).toBeLessThan(0);
  });

  it("null entry in the e array falls back to the array mean", () => {
    const r = model.project(4200, [], 3, { e: [2, null, 4] });
    expect(near(r.levels[1] - r.levels[0], -3, 1e-6)).toBe(true);
    expect(near(r.levels[2] - r.levels[1], -4, 1e-6)).toBe(true);
  });

  it("opts.years + ePerYear: per-year e looked up from calibration; uncalibrated years use the fallback", () => {
    const byYear = new Map(calib.e_per_year.map((p) => [p.year, p.e]));
    const years = [1986, 1987, 2050]; // 2050 has no calibrated value
    const r = model.project(4200, [], 3, {
      years,
      ePerYear: calib.e_per_year,
      eFallback: calib.e_ft_per_yr,
    });
    expect(Array.isArray(r.e)).toBe(true);
    const eArr = r.e as number[];
    expect(near(eArr[0], byYear.get(1986)!, 1e-9)).toBe(true);
    expect(near(eArr[1], byYear.get(1987)!, 1e-9)).toBe(true);
    expect(near(eArr[2], calib.e_ft_per_yr, 1e-9)).toBe(true);
  });

  it("outflow hook: pure outflow (I=0, e=0) lowers the level by exactly O/A_avg", () => {
    const rNo = model.project(4200, [0], 1, { e: 0 });
    const rOut = model.project(4200, [0], 1, { e: 0, outflow: () => 1.0e6 });
    // With no inflow and no evaporation, the only term is the outflow:
    // Δh = −O / A_avg, where A_avg is the average of start and end areas.
    expect(rNo.levels[0]).toBeCloseTo(4200, 9);
    const aAvg = (curve.area(4200) + rOut.areas[0]) / 2;
    expect(rOut.levels[0] - 4200).toBeCloseTo(-1.0e6 / aAvg, 6);
    expect(rOut.levels[0]).toBeLessThan(4200);
  });

  it("outflow hook: with inflow, the outflow run ends below the no-outflow run", () => {
    const I = 1.5e6;
    const rNo = model.project(4200, [I, I], 2, { e: 2 });
    const rOut = model.project(4200, [I, I], 2, { e: 2, outflow: () => 1.0e6 });
    expect(rOut.levels[0]).toBeLessThan(rNo.levels[0]);
    expect(rOut.levels[1]).toBeLessThan(rNo.levels[1]);
  });

  it("resolveE: rejects non-numeric, non-null array entries", () => {
    expect(() => resolveE({ e: [1, "x" as unknown as null] })).toThrow();
  });

  it("eForYear: scalar passes through; missing array entry uses the mean", () => {
    expect(eForYear(1.5, 0)).toBe(1.5);
    expect(eForYear([2, null, 4], 1)).toBe(3);
    expect(eForYear([null, null], 0)).toBe(DEFAULT_E_FT_YR);
  });
});
