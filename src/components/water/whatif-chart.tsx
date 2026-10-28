// Small single-year chart: lake level Oct 1 → Sep 30, actual vs what-if.
// Port of the dashboard's drawWhatIfChart, as declarative React SVG.
// Pure (no hooks) — renders on the server and in client components alike.

import type { ReactElement } from "react";

export interface WhatIfChartProps {
  year: number;
  startFt: number;
  actualEndFt: number;
  whatIfEndFt: number;
}

const W = 360;
const H = 150;
const ML = 46;
const MR = 32;
const MT = 16;
const MB = 26;

export function WhatIfChart({ year, startFt, actualEndFt, whatIfEndFt }: WhatIfChartProps): ReactElement {
  const lo = Math.min(startFt, actualEndFt, whatIfEndFt) - 0.5;
  const hi = Math.max(startFt, actualEndFt, whatIfEndFt) + 0.5;
  const x = (t: number) => ML + t * (W - ML - MR);
  const y = (h: number) => MT + ((hi - h) / (hi - lo)) * (H - MT - MB);
  // Rising what-if gets the accent; falling gets muted.
  const color = whatIfEndFt >= actualEndFt ? "var(--chart-whatif)" : "var(--chart-bau)";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Lake level ${year}: actual vs what-if`}
      className="h-auto w-full"
    >
      {[0, 1, 2].map((i) => {
        const hv = lo + ((hi - lo) * i) / 2;
        return (
          <g key={i}>
            <line x1={ML} y1={y(hv)} x2={W - MR} y2={y(hv)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={ML - 6} y={y(hv) + 3} textAnchor="end" fontSize={10} fill="var(--chart-text)">
              {hv.toFixed(1)} ft
            </text>
          </g>
        );
      })}
      <text x={x(0)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
        Oct 1 {year}
      </text>
      <text x={x(1)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
        Sep 30 {year + 1}
      </text>
      <line x1={x(0)} y1={y(startFt)} x2={x(1)} y2={y(actualEndFt)} stroke="var(--chart-obs)" strokeWidth={2} />
      <line x1={x(0)} y1={y(startFt)} x2={x(1)} y2={y(whatIfEndFt)} stroke={color} strokeWidth={2.5} />
      <circle cx={x(1)} cy={y(whatIfEndFt)} r={3} fill={color} />
      <text x={W - MR} y={MT + 2} textAnchor="end" fontSize={10} fill="var(--chart-obs)">
        — actual
      </text>
      <text x={W - MR} y={MT + 14} textAnchor="end" fontSize={10} fill={color}>
        — what-if
      </text>
    </svg>
  );
}
