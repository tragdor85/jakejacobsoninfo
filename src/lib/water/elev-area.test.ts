import { describe, expect, it } from "vitest";
import { ElevAreaCurve } from "./elev-area";
import elevAreaData from "../../data/water/gsl/elev_area.json";
import type { ElevAreaPoint } from "./types";

// Port of utahwater/dashboard/scripts/test_elev_area.js, run against the
// committed GSL data snapshot.

const pts = elevAreaData as ElevAreaPoint[];
const curve = new ElevAreaCurve(pts);
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

describe("ElevAreaCurve (GSL)", () => {
  const elevs = pts.map((p) => p.elev_ft);
  const areas = pts.map((p) => p.area_acres);

  it("table covers 4180–4215 ft", () => {
    expect(elevs[0]).toBeLessThanOrEqual(4180.01);
    expect(elevs[elevs.length - 1]).toBeGreaterThanOrEqual(4214.99);
  });

  it("table area is monotonic non-decreasing", () => {
    for (let i = 1; i < areas.length; i++) {
      expect(areas[i]).toBeGreaterThanOrEqual(areas[i - 1] - 1e-9);
    }
  });

  it("reproduces the published anchor: 4200 ft ≈ 1.09 M acres", () => {
    expect(near(curve.area(4200) / 1e6, 1.09, 0.02)).toBe(true);
  });

  it("reproduces the published anchor: 4211.65 ft ≈ 2.11 M acres", () => {
    expect(near(curve.area(4211.65) / 1e6, 2.11, 0.02)).toBe(true);
  });

  it("reproduces the published anchor: 4191.35 ft ≈ 950 sq mi", () => {
    expect(near(curve.areaSqMi(4191.35), 950, 19)).toBe(true);
  });

  it("interpolant is monotonic non-decreasing over 4180–4215 @ 0.1 ft", () => {
    let prev = -Infinity;
    for (let e = 4180; e <= 4215.0001; e += 0.1) {
      const a = curve.area(e);
      expect(a).toBeGreaterThanOrEqual(prev - 1e-6);
      prev = Math.max(prev, a);
    }
  });

  it("area changes smoothly (max 0.5-ft step < 120k acres)", () => {
    let maxJump = 0;
    for (let e = 4180; e < 4215; e += 0.5) {
      maxJump = Math.max(maxJump, Math.abs(curve.area(e + 0.5) - curve.area(e)));
    }
    expect(maxJump).toBeLessThan(120000);
  });

  it("clamps below the table range", () => {
    expect(curve.area(4170)).toBe(curve.area(4180));
  });

  it("clamps above the table range", () => {
    expect(curve.area(4220)).toBe(curve.area(4215));
  });
});
