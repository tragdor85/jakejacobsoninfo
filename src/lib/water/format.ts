// Display formatting for the water dashboards. Values are US customary
// units (ft, acres, acre-ft); MAF = million acre-ft.

export const MAF = 1e6;

/** Million acre-ft, 2 decimals (1 when ≥ 10). */
export function fmtMaf(acft: number): string {
  const v = acft / MAF;
  return v.toFixed(v >= 10 ? 1 : 2);
}

/** Feet, 1 decimal. */
export function fmtFt(v: number): string {
  return v.toFixed(1);
}

/**
 * Signed flow delta in MAF, 2 decimals. Avoids a negative sign on values
 * that round to zero (−0.00 MAF reads as a loss).
 */
export function fmtDeltaMaf(acft: number): string {
  const v = acft / MAF;
  const sign = v < 0 && Math.abs(v) >= 0.005 ? "−" : "+";
  return sign + Math.abs(v).toFixed(2) + " MAF";
}

/**
 * Signed level delta, 2 decimals. Avoids a negative sign on values that
 * round to zero (−0.00 ft reads as a drop).
 */
export function fmtDeltaFt(d: number): string {
  const sign = d < 0 && Math.abs(d) >= 0.005 ? "−" : "+";
  return sign + Math.abs(d).toFixed(2) + " ft";
}

/** Square miles from acres, whole numbers with grouping (1 sq mi = 640 acres). */
export function fmtAreaSqMi(acres: number): string {
  return Math.round(acres / 640).toLocaleString("en-US") + " sq mi";
}

/** Fractional year for chart placement: "2022-11-07" → 2022.85… */
export function dateToYear(dateStr: string): number {
  const p = dateStr.split("-");
  const y = parseInt(p[0], 10);
  const d = new Date(y, parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  return y + (d.getTime() - new Date(y, 0, 1).getTime()) / (365 * 86400000);
}
