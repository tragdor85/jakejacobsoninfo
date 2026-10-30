// What-if compute for a river (conduit) water body. Pure functions over the
// committed data + RiverModel, so every number on the river dashboard flows
// through these tested functions (mirrors the lake's compute.ts).

import { RiverModel } from "./river-model";
import type { InflowPoint, RiverConfig, RiverInflowRow } from "./types";

/** All water years in the river's inflow data, sorted ascending. */
export function riverYears(river: RiverConfig): number[] {
  return river.data.inflows.map((r) => r.year).sort((a, b) => a - b);
}

/** The latest complete water year (the default selection). */
export function riverDefaultYear(river: RiverConfig): number {
  const complete = river.data.inflows.filter((r) => r.complete && r.total != null);
  const pool = complete.length ? complete : river.data.inflows;
  return pool.reduce((m, r) => Math.max(m, r.year), -Infinity);
}

/** The inflow row for a water year, or null. */
export function riverInflowRow(river: RiverConfig, year: number): RiverInflowRow | null {
  return river.data.inflows.find((r) => r.year === year) ?? null;
}

/** Read one inflow component's value (acre-ft) from a row, 0 if missing. */
function inflowComponentValue(row: RiverInflowRow | null, key: string): number {
  if (!row) return 0;
  const v = row[key as keyof RiverInflowRow];
  return typeof v === "number" ? v : 0;
}

/** The selected year's actual inflow-component values (acre-ft) — the sliders' 100%. */
export function initialInflowValues(river: RiverConfig, year: number): Record<string, number> {
  const row = riverInflowRow(river, year);
  const out: Record<string, number> = {};
  for (const c of river.inflowComponents) out[c.key] = inflowComponentValue(row, c.key);
  return out;
}

/** The wettest-year inflow-component values (acre-ft) — the sliders' max. */
export function maxInflowValues(river: RiverConfig): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of river.inflowComponents) {
    out[c.key] = river.data.inflows.reduce((m, r) => Math.max(m, inflowComponentValue(r, c.key)), 0);
  }
  return out;
}

/** The baseline diversion values (acre-ft) = each diversion's average take. */
export function initialDiversionValues(river: RiverConfig): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of river.data.diversions.diversions) out[d.key] = d.avg_af;
  return out;
}

/** All inflow-component multipliers at 1 (100%). */
export function initialInflowMults(river: RiverConfig): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of river.inflowComponents) out[c.key] = 1;
  return out;
}

/** All diversion multipliers at 1 (100%). */
export function initialDiversionMults(river: RiverConfig): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of river.data.diversions.diversions) out[d.key] = 1;
  return out;
}

/** All multipliers at 1 (100%) — inflow components + diversions, together. */
export function baselineMults(river: RiverConfig): Record<string, number> {
  return { ...initialInflowMults(river), ...initialDiversionMults(river) };
}

export interface RiverWhatIfResult {
  year: number;
  /** Flow to the lake with all multipliers at 100% (the baseline balance). */
  baseline: number;
  /** Flow to the lake with the current slider values. */
  whatIf: number;
  /** whatIf − baseline (acre-ft). Positive = more water reaches the lake. */
  delta: number;
}

/** Compute the flow-to-lake what-if for a year. */
export function computeRiverWhatIf(
  river: RiverConfig,
  model: RiverModel,
  year: number,
  inflowMults: Record<string, number>,
  diversionMults: Record<string, number>,
  extraDiversion = 0,
): RiverWhatIfResult | null {
  const row = riverInflowRow(river, year);
  if (!row) return null;
  const base = baselineMults(river);
  const baseline = model.flowToLake(row, base, base, 0);
  const whatIf = model.flowToLake(row, inflowMults, diversionMults, extraDiversion);
  return { year, baseline, whatIf, delta: whatIf - baseline };
}

/** The annual flow-to-lake series (baseline) for the main chart, in MAF. */
export function flowToLakeSeries(river: RiverConfig, model: RiverModel): InflowPoint[] {
  const base = baselineMults(river);
  return river.data.inflows
    .map((row) => ({
      year: row.year,
      maf: model.flowToLake(row, base, base, 0) / 1e6,
      estimated: !row.complete,
    }))
    .sort((a, b) => a.year - b.year);
}

/** The annual measured inflow series for the chart's right axis, in MAF. */
export function riverInflowSeries(river: RiverConfig): InflowPoint[] {
  return river.data.inflows
    .map((row) => ({
      year: row.year,
      maf: (row.total ?? 0) / 1e6,
      estimated: !row.complete,
    }))
    .sort((a, b) => a.year - b.year);
}

/** The long-term mean flow to the lake (MAF) over the complete years. */
export function meanFlowToLake(river: RiverConfig, model: RiverModel): number {
  const base = baselineMults(river);
  const complete = river.data.inflows.filter((r) => r.complete);
  const pool = complete.length ? complete : river.data.inflows;
  const sum = pool.reduce((s, r) => s + model.flowToLake(r, base, base, 0), 0);
  return pool.length ? sum / pool.length / 1e6 : 0;
}
