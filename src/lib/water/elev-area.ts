// Elevation → surface-area (hypsometric) curve with a smooth monotone
// interpolant. Port of utahwater/dashboard/elev_area.js — the PCHIP
// (Fritsch–Carlson) math is unchanged.
//
// PCHIP is C1-smooth and monotonicity-preserving: area never decreases
// with elevation and never overshoots between table points, which matters
// because the water-balance model divides by area.
//
// The curve is in feet and acres (US customary units); the water-balance
// math relies on 1 acre-ft over 1 acre = 1 ft of level change.

import type { ElevAreaPoint } from "./types";

/** Build a PCHIP interpolant from sorted (x, y) arrays. Returns f(x), clamped outside the range. */
function buildPchip(x: number[], y: number[]): (xx: number) => number {
  const n = x.length;
  if (n < 2) throw new Error("buildPchip needs at least 2 points");
  const h = new Array<number>(n - 1);
  const d = new Array<number>(n - 1);
  for (let i = 0; i < n - 1; i++) {
    h[i] = x[i + 1] - x[i];
    d[i] = (y[i + 1] - y[i]) / h[i];
  }
  const m = new Array<number>(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) {
      m[i] = 0;
    } else {
      m[i] = (h[i - 1] + h[i]) / (h[i - 1] / d[i - 1] + h[i] / d[i]);
    }
  }
  // Fritsch–Carlson monotonicity: keep each segment's endpoint slopes in range.
  for (let i = 0; i < n - 1; i++) {
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const phi = 3 / Math.sqrt(s);
      m[i] = phi * d[i];
      m[i + 1] = phi * d[i];
    }
  }
  return (xx: number): number => {
    if (xx <= x[0]) return y[0];
    if (xx >= x[n - 1]) return y[n - 1];
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (x[mid] <= xx) lo = mid;
      else hi = mid;
    }
    const t = (xx - x[lo]) / h[lo];
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return h00 * y[lo] + h10 * h[lo] * m[lo] + h01 * y[lo + 1] + h11 * h[lo] * m[lo + 1];
  };
}

export class ElevAreaCurve {
  private readonly f: (elev: number) => number;
  private readonly minElev: number;
  private readonly maxElev: number;

  /**
   * @param points array of {elev_ft, area_acres}; need not be pre-sorted.
   * @throws if fewer than 2 points, or the area is not monotonic
   *   non-decreasing in elevation after sorting (a broken curve would make
   *   the water-balance model's fixed-point iteration diverge).
   */
  constructor(points: ElevAreaPoint[]) {
    if (points.length < 2) throw new Error("ElevAreaCurve: need at least 2 points");
    const pts = points
      .slice()
      .sort((a, b) => a.elev_ft - b.elev_ft);
    const x = pts.map((p) => p.elev_ft);
    const y = pts.map((p) => p.area_acres);
    for (let i = 1; i < y.length; i++) {
      if (y[i] < y[i - 1] - 1e-9) {
        throw new Error(`ElevAreaCurve: area must be non-decreasing (violated at ${x[i]} ft)`);
      }
    }
    this.f = buildPchip(x, y);
    this.minElev = x[0];
    this.maxElev = x[x.length - 1];
  }

  // Arrow-function fields (not methods): safe to pass around as plain
  // function values — `this` stays bound to the curve instance.
  readonly area = (elev: number): number => this.f(elev);
  readonly areaSqMi = (elev: number): number => this.f(elev) / 640;

  get minElevFt(): number {
    return this.minElev;
  }

  get maxElevFt(): number {
    return this.maxElev;
  }
}
