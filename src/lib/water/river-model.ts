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

export class RiverModel {
  constructor(private readonly config: RiverDiversionConfig) {}

  /** Total average diversion (acre-ft/yr) across all diversions. */
  get totalAvgDiversion(): number {
    return this.config.diversions.reduce((s, d) => s + d.avg_af, 0);
  }

  /**
   * Flow reaching the lake (acre-ft) for a given inflow and adjustments.
   *
   * @param row the measured inflow for the water year (total + split)
   * @param inflowMults per-inflow-component multiplier (1 = unchanged)
   * @param diversionMults per-diversion multiplier (1 = unchanged)
   * @param extraDiversion an additional diversion (e.g. a proposed project), acre-ft
   */
  flowToLake(
    row: RiverInflowRow,
    inflowMults: Record<string, number>,
    diversionMults: Record<string, number>,
    extraDiversion = 0,
  ): number {
    const effInflow =
      (row.mainstem ?? 0) * (inflowMults["mainstem"] ?? 1) +
      (row.tributaries ?? 0) * (inflowMults["tributaries"] ?? 1);
    const dryScale = Math.min(1, (effInflow * this.config.dry_take_cap) / this.totalAvgDiversion);
    const diverted =
      this.config.diversions.reduce(
        (s, d) => s + d.avg_af * (diversionMults[d.key] ?? 1) * dryScale,
        0,
      ) + extraDiversion * dryScale;
    const residual = effInflow * this.config.residual_frac;
    return Math.max(0, effInflow - diverted - residual);
  }
}
