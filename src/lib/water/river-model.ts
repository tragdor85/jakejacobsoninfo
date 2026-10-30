// Annual flow-balance model for a river (conduit) that flows into a lake.
//
// Unlike a terminal lake (whose response is a level), a river's response is
// the flow that reaches the receiving lake:
//
//   flow_to_lake = inflow − diversions − residual
//
//   inflow       the measured source-gauge total (acre-ft), split into
//                mainstem + tributaries. The what-if inflow sliders scale
//                these two components.
//   diversions   the human-controlled takes (canals, districts). Each is
//                scaled by a what-if multiplier AND by a dry-year cap that
//                reflects water-right priority: a dry year can't sustain the
//                full entitlement, so take scales with available flow up to
//                `dry_take_cap` of inflow.
//   residual     a calibrated fraction of inflow covering river ET, seepage,
//                storage change, and the gauge→mouth gap (no mouth gauge).
//
// This is the browser port of utahwater/bearriver/scripts/budget.py — the same
// math, so the what-if baseline matches the committed balance exactly.

import type { RiverDiversionConfig, RiverInflowRow } from "./types";

/** The annual flow balance, decomposed so the dashboard can show where the water goes. */
export interface RiverBreakdown {
  /** Effective inflow after the inflow sliders (acre-ft). */
  inflow: number;
  /** Total diverted by all diversions plus any extra (acre-ft). */
  diversions: number;
  /** Residual loss — river ET, seepage, storage change, gauge→mouth gap (acre-ft). */
  residual: number;
  /** What reaches the lake (acre-ft). */
  flowToLake: number;
}

export class RiverModel {
  constructor(private readonly config: RiverDiversionConfig) {}

  /** Total average diversion (acre-ft/yr) across all diversions. */
  get totalAvgDiversion(): number {
    return this.config.diversions.reduce((s, d) => s + d.avg_af, 0);
  }

  /**
   * Decompose the annual flow balance for a given total inflow (acre-ft).
   * Shared core of breakdown() and flowToLakeForInflow().
   *
   * @param inflow effective inflow at the source gauge (acre-ft)
   * @param diversionMults per-diversion multiplier (1 = unchanged)
   * @param extraDiversion an additional diversion (e.g. a proposed project), acre-ft
   */
  balanceForInflow(
    inflow: number,
    diversionMults: Record<string, number>,
    extraDiversion = 0,
  ): RiverBreakdown {
    const dryScale = Math.min(1, (inflow * this.config.dry_take_cap) / this.totalAvgDiversion);
    const diversions =
      this.config.diversions.reduce(
        (s, d) => s + d.avg_af * (diversionMults[d.key] ?? 1) * dryScale,
        0,
      ) + extraDiversion * dryScale;
    const residual = inflow * this.config.residual_frac;
    const flowToLake = Math.max(0, inflow - diversions - residual);
    return { inflow, diversions, residual, flowToLake };
  }

  /**
   * Flow reaching the lake (acre-ft) for a given total inflow at the source gauge.
   * Same budget as breakdown(), but from a raw inflow instead of a data row —
   * used by the GSL dashboard, whose inflows.json is already the gauge total.
   */
  flowToLakeForInflow(
    inflowAcft: number,
    diversionMults: Record<string, number> = {},
    extraDiversion = 0,
  ): number {
    return this.balanceForInflow(inflowAcft, diversionMults, extraDiversion).flowToLake;
  }

  /**
   * Decompose a year's recorded flow into the budget the lake model is calibrated on.
   *
   * @param row the measured inflow for the water year (total + split)
   * @param inflowMults per-inflow-component multiplier (1 = unchanged)
   * @param diversionMults per-diversion multiplier (1 = unchanged)
   * @param extraDiversion an additional diversion (e.g. a proposed project), acre-ft
   */
  breakdown(
    row: RiverInflowRow,
    inflowMults: Record<string, number>,
    diversionMults: Record<string, number>,
    extraDiversion = 0,
  ): RiverBreakdown {
    const inflow =
      (row.mainstem ?? 0) * (inflowMults["mainstem"] ?? 1) +
      (row.tributaries ?? 0) * (inflowMults["tributaries"] ?? 1);
    return this.balanceForInflow(inflow, diversionMults, extraDiversion);
  }

  /** Flow reaching the lake (acre-ft) for a given inflow and adjustments. */
  flowToLake(
    row: RiverInflowRow,
    inflowMults: Record<string, number>,
    diversionMults: Record<string, number>,
    extraDiversion = 0,
  ): number {
    return this.breakdown(row, inflowMults, diversionMults, extraDiversion).flowToLake;
  }
}
