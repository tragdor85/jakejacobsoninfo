// Annual water-balance model for terminal lakes.
//
// Level change = inflow − evaporation. Worked in elevation (ft) so only the
// elevation→area curve is needed (no volume curve):
//
//   For each water year (Oct 1 – Sep 30):
//       A    = surface area (acres)
//       Δh   = (I − O) / A_avg − e     (I, O in acre-ft; 1 acre-ft over 1 acre = 1 ft)
//       h'   = h + Δh
//
//   A_avg is the average of the start-of-year and end-of-year areas, so a big
//   inflow is spread over the lake's *average* surface. Because A(h) grows
//   steeply with elevation, the same inflow raises a low/narrow lake much
//   more than a high/wide one — the nonlinearity that makes the model
//   realistic. The end area depends on Δh, so Δh is solved by a few
//   fixed-point iterations (the map is strongly contractive over a lake's
//   area range; converges to <1e-9 ft in well under 10 iterations).
//
//   e is evaporation as a depth (ft/yr): evaporation *volume* scales with
//   area, which cancels in level terms (E/A = e). e may be a single constant
//   (ft/yr) or a per-year array (one entry per projected year). Calibrated
//   per-year values are mass-balance residuals that absorb that year's
//   evaporation plus groundwater, diversions, and unmeasured direct streams.
//
//   O is an optional outflow (acre-ft/yr) as a function of surface area,
//   water year, and year index — for lakes that lose water to the sea or
//   through a spillway. Terminal lakes omit it (O = 0).
//
// Port of utahwater/dashboard/model.js — the math is unchanged; the
// Node-specific file loading is removed (the area curve and calibration
// are passed explicitly) and an outflow hook is added.

import type { CalibrationYear } from "./types";

/** Fallback evaporation depth (ft/yr) when no calibration is available. */
export const DEFAULT_E_FT_YR = 2;

/** Surface area (acres) at a given elevation (ft). */
export type AreaFn = (elev: number) => number;

export interface WaterModelOptions {
  /** Evaporation depth (ft/yr): a scalar, or a per-year array (null = missing). */
  e?: number | (number | null)[];
  /**
   * Water-year numbers (e.g. [2026, 2027, …]) — used to look up per-year
   * calibrated e from `ePerYear` when `e` is omitted.
   */
  years?: number[];
  /** Per-year calibrated evaporation depths (from the lake's calibration data). */
  ePerYear?: CalibrationYear[];
  /** Scalar fallback when a year has no calibrated value (default DEFAULT_E_FT_YR). */
  eFallback?: number;
  /** Optional water loss (acre-ft/yr) from surface area, water year, and index. */
  outflow?: (areaAcres: number, year: number, index: number) => number;
}

export interface ProjectionResult {
  /** Level (ft) at the END of each projected water year. */
  levels: number[];
  /** Surface area (acres) at each end-of-year level. */
  areas: number[];
  /** Evaporation volume for each year (acre-ft) = e_i × A_avg that year. */
  evap: number[];
  /** Evaporation depth actually used (scalar, or the per-year array). */
  e: number | (number | null)[];
}

/**
 * Evaporation depth (ft/yr): explicit opts.e (number or per-year array)
 * beats the fallback scalar beats the default. Per-year arrays may contain
 * negative values (wet years where the residual is dominated by unmeasured
 * inflow); null/undefined entries are treated as missing (eForYear falls
 * back to the array mean).
 */
export function resolveE(opts: WaterModelOptions): number | (number | null)[] {
  if (typeof opts.e === "number" && isFinite(opts.e)) return opts.e;
  if (Array.isArray(opts.e) && opts.e.length > 0) {
    for (const v of opts.e) {
      if (v != null && (typeof v !== "number" || !isFinite(v))) {
        throw new Error("project: opts.e array entries must be numbers (or null)");
      }
    }
    return opts.e;
  }
  if (opts.eFallback != null && isFinite(opts.eFallback) && opts.eFallback > 0) {
    return opts.eFallback;
  }
  return DEFAULT_E_FT_YR;
}

/**
 * Evaporation depth to apply in year i (0-based): per-year array entry if
 * given, else the scalar. Missing array entries fall back to the array mean.
 */
export function eForYear(e: number | (number | null)[], i: number): number {
  if (!Array.isArray(e)) return e;
  if (typeof e[i] === "number" && isFinite(e[i])) return e[i];
  let sum = 0;
  let n = 0;
  for (const v of e) {
    if (typeof v === "number" && isFinite(v)) {
      sum += v;
      n++;
    }
  }
  return n > 0 ? sum / n : DEFAULT_E_FT_YR;
}

/**
 * If `years` and `ePerYear` are given and `e` was not, build a per-year e
 * array from the calibrated values, falling back to the scalar for years
 * without a calibrated value.
 */
function perYearEFromCalibration(
  years: number[] | undefined,
  fallback: number,
  ePerYear?: CalibrationYear[],
): (number | null)[] | null {
  if (!Array.isArray(years) || !ePerYear) return null;
  const byYear = new Map<number, number>();
  for (const p of ePerYear) byYear.set(p.year, p.e);
  return years.map((y) => (byYear.has(y) ? byYear.get(y)! : fallback));
}

/** Solve Δh = (I − O) / mean(A(h), A(h+Δh)) − e by fixed-point iteration. */
function levelStep(h: number, I: number, e: number, O: number, area: AreaFn): number {
  const aStart = area(h);
  let dh = (I - O) / aStart - e;
  for (let k = 0; k < 10; k++) {
    const aEnd = area(h + dh);
    const dhNew = (I - O) / ((aStart + aEnd) / 2) - e;
    if (Math.abs(dhNew - dh) < 1e-9) {
      dh = dhNew;
      break;
    }
    dh = dhNew;
  }
  return dh;
}

export class WaterModel {
  constructor(private readonly area: AreaFn) {}

  /**
   * Project the lake level forward.
   *
   * @param h0 start-of-first-year level (ft)
   * @param inflows annual total inflow per water year (acre-ft); length ≥ nYears,
   *   missing entries count as 0
   * @param nYears number of water years to project (default: inflows.length)
   * @param opts see WaterModelOptions
   * @returns {levels, areas, evap, e} — see ProjectionResult
   */
  project(
    h0: number,
    inflows: number[],
    nYears?: number,
    opts: WaterModelOptions = {},
  ): ProjectionResult {
    if (!isFinite(h0)) throw new Error("project: h0 must be a number (ft)");
    const flow = inflows ?? [];
    const years = nYears ?? flow.length;
    let e = resolveE(opts);
    if (!opts.e && Array.isArray(opts.years)) {
      const perYear = perYearEFromCalibration(
        opts.years,
        typeof e === "number" ? e : DEFAULT_E_FT_YR,
        opts.ePerYear,
      );
      if (perYear) e = perYear;
    }

    const levels: number[] = [];
    const areas: number[] = [];
    const evap: number[] = [];
    let h = h0;
    for (let i = 0; i < years; i++) {
      const I = flow[i] || 0;
      const ei = eForYear(e, i);
      const aStart = this.area(h);
      const O = opts.outflow ? opts.outflow(aStart, opts.years?.[i] ?? 0, i) : 0;
      const dh = levelStep(h, I, ei, O, this.area);
      h += dh;
      const aEnd = this.area(h);
      levels.push(h);
      areas.push(aEnd);
      evap.push(ei * (aStart + aEnd) / 2); // acre-ft evaporated this year
    }
    return { levels, areas, evap, e };
  }
}
