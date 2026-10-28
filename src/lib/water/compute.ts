// Pure derivation functions for the water dashboards: what-if counterfactual,
// multi-year projection, baselines, and chart series. No React, no DOM —
// everything the dashboard renders flows through here, which keeps the
// behavioral semantics unit-testable.
//
// Port of the app-level logic in utahwater/dashboard/app.js.

import { WaterModel, DEFAULT_E_FT_YR } from "./model";
import { MAF } from "./format";
import type { ChartMarker, InflowPoint, InflowRow, LakeConfig, LevelRow } from "./types";

export function findLevelRow(lake: LakeConfig, year: number): LevelRow | null {
  return lake.data.levels.data.find((r) => r.year === year) ?? null;
}

export function findInflowRow(lake: LakeConfig, year: number): InflowRow | null {
  return lake.data.inflows.data.find((r) => r.year === year) ?? null;
}

/**
 * Evaporation depth for a water year: the per-year calibrated residual if
 * present, else the mean (calibration), else the model default.
 */
export function evapForYear(lake: LakeConfig, year: number): number {
  const perYear = lake.data.calibration.e_per_year.find((p) => p.year === year);
  if (perYear && isFinite(perYear.e)) return perYear.e;
  if (isFinite(lake.data.calibration.e_ft_per_yr)) return lake.data.calibration.e_ft_per_yr;
  return DEFAULT_E_FT_YR;
}

/**
 * BAU baseline: long-term mean inflow per source (mean of the years with
 * data; years where a gauge is absent are naturally excluded).
 */
export function computeLongTermMeans(lake: LakeConfig): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of lake.rivers) {
    let sum = 0;
    let n = 0;
    for (const row of lake.data.inflows.data) {
      const v = row[s.key];
      if (typeof v === "number" && v != null) {
        sum += v;
        n++;
      }
    }
    out[s.key] = n > 0 ? sum / n : 0;
  }
  return out;
}

/** Slider range top: ~2× the wettest year for this source. */
export function sliderMaxAcft(lake: LakeConfig, riverKey: string): number {
  let max = 0;
  for (const row of lake.data.inflows.data) {
    const v = row[riverKey];
    if (typeof v === "number" && v != null && v > max) max = v;
  }
  return 2 * max;
}

/** All water years with inflow data, ascending. */
export function allYears(lake: LakeConfig): number[] {
  return lake.data.inflows.data.map((r) => r.year).sort((a, b) => a - b);
}

/** Water years eligible as a projection start (complete years only). */
export function projectionYears(lake: LakeConfig): number[] {
  return lake.data.inflows.data
    .filter((r) => !r.partial)
    .map((r) => r.year)
    .sort((a, b) => a - b);
}

/** Most recent complete water year — the default selection. */
export function defaultYear(lake: LakeConfig): number {
  let def = lake.yearRange[0];
  for (const r of lake.data.inflows.data) {
    if (!r.partial) def = r.year;
  }
  return def;
}

/** Per-river actual inflow (acre-ft) for a year; missing gauges read 0. */
export function actualAcftFor(lake: LakeConfig, year: number): Record<string, number> {
  const row = findInflowRow(lake, year);
  const out: Record<string, number> = {};
  for (const s of lake.rivers) {
    const a = row?.[s.key];
    out[s.key] = typeof a === "number" && a != null ? a : 0;
  }
  return out;
}

/** The slider values when a year is selected: that year's actuals. */
export function initialValues(lake: LakeConfig, year: number): Record<string, number> {
  return actualAcftFor(lake, year);
}

export interface WhatIf {
  year: number;
  /** Actual start-of-year level (ft). */
  h0: number;
  /** Model end-of-year level with the current inflows (ft). */
  end: number;
  /** Observed end-of-year level (ft). */
  actual: number;
  /** end − actual (ft). */
  delta: number;
}

/**
 * One-step counterfactual from the selected year's actual start level with
 * the current inflows, using that year's calibrated evaporation depth.
 * Null when the year has no usable observed level.
 */
export function computeWhatIf(
  lake: LakeConfig,
  model: WaterModel,
  year: number,
  valuesAcft: Record<string, number>,
): WhatIf | null {
  const levelRow = findLevelRow(lake, year);
  if (!levelRow || levelRow.start_ft == null || levelRow.end_ft == null) return null;
  const I = totalInflow(lake, valuesAcft);
  const res = model.project(levelRow.start_ft, [I], 1, { e: evapForYear(lake, year) });
  const end = res.levels[0];
  return { year, h0: levelRow.start_ft, end, actual: levelRow.end_ft, delta: end - levelRow.end_ft };
}

export interface Projection {
  startYear: number;
  /** Actual start-of-year level (ft). */
  h0: number;
  /** End-of-year levels (ft) with the current inflows, sustained. */
  levels: number[];
  /** End-of-year levels (ft) with the BAU long-term-mean inflows. */
  bauLevels: number[];
  /** Total annual inflow (acre-ft) of the current scenario. */
  I: number;
  /** Total annual BAU inflow (acre-ft). */
  bauI: number;
  /** Per-year calibrated evaporation depths used. */
  e: (number | null)[];
  horizon: number;
  endYear: number;
  /** levels[horizon-1] (ft). */
  end: number;
  /** bauLevels[horizon-1] (ft). */
  bauEnd: number;
  /** end − bauEnd (ft). */
  delta: number;
}

/**
 * Multi-year projection from the start year's actual Oct 1 level: once with
 * the current inflows (sustained each year) and once with the BAU
 * long-term-mean inflows. Both use the same per-year calibrated e (scalar
 * mean for years without a calibrated value, e.g. beyond the record).
 * Null when there is no start year.
 */
export function computeProjection(
  lake: LakeConfig,
  model: WaterModel,
  startYear: number | null,
  horizon: number,
  valuesAcft: Record<string, number>,
): Projection | null {
  if (startYear == null) return null;
  const levelRow = findLevelRow(lake, startYear);
  if (!levelRow || levelRow.start_ft == null) return null;
  const means = computeLongTermMeans(lake);
  const I = totalInflow(lake, valuesAcft);
  const bauI = totalInflow(lake, means);
  const e: (number | null)[] = [];
  for (let i = 0; i < horizon; i++) e.push(evapForYear(lake, startYear + i));
  const inflows = new Array<number>(horizon).fill(I);
  const bauInflows = new Array<number>(horizon).fill(bauI);
  const res = model.project(levelRow.start_ft, inflows, horizon, { e });
  const resBau = model.project(levelRow.start_ft, bauInflows, horizon, { e });
  return {
    startYear,
    h0: levelRow.start_ft,
    levels: res.levels,
    bauLevels: resBau.levels,
    I,
    bauI,
    e,
    horizon,
    endYear: startYear + horizon - 1,
    end: res.levels[horizon - 1],
    bauEnd: resBau.levels[horizon - 1],
    delta: res.levels[horizon - 1] - resBau.levels[horizon - 1],
  };
}

/** Sum of the per-river values (acre-ft). */
export function totalInflow(lake: LakeConfig, valuesAcft: Record<string, number>): number {
  return lake.rivers.reduce((t, s) => t + (valuesAcft[s.key] || 0), 0);
}

/** Observed record as [year, ft] water-year boundary points, ascending. */
export function observedSeries(lake: LakeConfig): [number, number][] {
  const pts: [number, number][] = [];
  for (const r of lake.data.levels.data) {
    if (r.start_ft != null) pts.push([r.year, r.start_ft]);
    if (r.end_ft != null) pts.push([r.year + 1, r.end_ft]);
  }
  return pts.sort((a, b) => a[0] - b[0]);
}

/**
 * Total source inflow per water year (MAF) for the main chart's right axis, with
 * a flag marking years whose total is not a full, complete measurement — a source
 * gauge is missing for the year, or the year is partial. Those years are drawn
 * dotted. Years with no total at all are omitted.
 */
export function inflowSeries(lake: LakeConfig): InflowPoint[] {
  return lake.data.inflows.data
    .filter((r) => r.total != null)
    .map((r) => ({
      year: r.year,
      maf: (r.total ?? 0) / MAF,
      estimated: !r.complete || r.partial,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Record-low marker for the chart: from the lake config if set, else the
 * lowest observed water-year boundary point.
 */
export function lowMarker(lake: LakeConfig): ChartMarker | null {
  if (lake.lowMarker) return lake.lowMarker;
  let best: { year: number; ft: number } | null = null;
  for (const r of lake.data.levels.data) {
    if (r.start_ft != null && (!best || r.start_ft < best.ft)) best = { year: r.year, ft: r.start_ft };
    if (r.end_ft != null && (!best || r.end_ft < best.ft)) best = { year: r.year + 1, ft: r.end_ft };
  }
  return best ? { year: best.year, ft: best.ft, label: `record low ${best.ft.toFixed(1)} ft` } : null;
}

/**
 * Note for the selected year: partial-year and missing-gauge warnings,
 * mirroring the dashboard's yearNote.
 */
export function yearNote(lake: LakeConfig, year: number): string {
  const row = findInflowRow(lake, year);
  const parts: string[] = [];
  if (row?.partial) parts.push("partial water year");
  for (const s of lake.rivers) {
    const v = row?.[s.key];
    if (typeof v !== "number" || v == null) parts.push(`${s.label} has no gauge data this year`);
  }
  return parts.join("; ");
}
