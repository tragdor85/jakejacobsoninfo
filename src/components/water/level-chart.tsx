// Main water-level chart: the full observed record with the 1-year what-if,
// the projected trajectory, and the BAU baseline overlaid; the "magic level"
// (historic average) and a record-low marker.
//
// Port of the dashboard's drawMainChart, as declarative React SVG. Pure (no
// hooks) — renders on the server and in client components alike. Geometry
// (viewBox, margins, tick steps, legend widths) matches the dashboard.

import type { ReactElement } from "react";
import type { ChartMarker } from "@/lib/water/types";

export interface LevelChartProps {
  /** [year, ft] pairs — the observed record (water-year boundary points). */
  observed: [number, number][];
  /** [start year, h0], [end year, end] — the selected year's what-if. */
  whatIf?: [number, number][];
  /** [start year, h0] + one point per projected year. */
  projected?: [number, number][];
  /** [start year, h0] + one point per BAU year. */
  bau?: [number, number][];
  /** Historic average level (ft), drawn as a dashed hairline. */
  magicLevel?: number;
  /** Label for the magic level line (e.g. "4,200 ft — historic average"). */
  magicLabel?: string;
  /** Record-low marker (vertical guide + dot + label). */
  lowMarker?: ChartMarker;
  ariaLabel: string;
}

const W = 840;
const H = 300;
const ML = 50;
const MR = 16;
const MT = 30;
const MB = 28;

// "Nice" y-gridline steps (ft), chosen so the chart shows 4–9 lines.
const NICE_STEPS = [0.5, 1, 2, 5, 10, 20];

// Legend item text widths (px), matching the dashboard.
const LEGEND_WIDTHS = [62, 48, 62, 112];

function pointsAttr(points: [number, number][], x: (t: number) => number, y: (h: number) => number): string {
  return points.map(([t, h]) => `${x(t).toFixed(1)},${y(h).toFixed(1)}`).join(" ");
}

export function LevelChart(props: LevelChartProps): ReactElement {
  const { observed, whatIf, projected, bau, magicLevel, magicLabel, lowMarker, ariaLabel } = props;

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  const seriesList: [number, number][][] = [observed];
  if (projected) seriesList.push(projected);
  if (bau) seriesList.push(bau);
  if (whatIf) seriesList.push(whatIf);
  for (const series of seriesList) {
    for (const [t, h] of series) {
      xMin = Math.min(xMin, t);
      xMax = Math.max(xMax, t);
      yMin = Math.min(yMin, h);
      yMax = Math.max(yMax, h);
    }
  }
  if (lowMarker) {
    xMin = Math.min(xMin, lowMarker.year);
    xMax = Math.max(xMax, lowMarker.year);
    yMin = Math.min(yMin, lowMarker.ft);
    yMax = Math.max(yMax, lowMarker.ft);
  }
  if (magicLevel != null) {
    yMin = Math.min(yMin, magicLevel);
    yMax = Math.max(yMax, magicLevel);
  }
  if (!isFinite(yMin) || !isFinite(yMax)) {
    return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full" />;
  }
  yMin -= 0.5;
  yMax += 0.5;

  const x = (t: number) => ML + ((t - xMin) / (xMax - xMin)) * (W - ML - MR);
  const y = (h: number) => MT + ((yMax - h) / (yMax - yMin)) * (H - MT - MB);

  // y gridlines at a nice step.
  let step = (yMax - yMin) / 8;
  for (const n of NICE_STEPS) {
    if (n >= step) {
      step = n;
      break;
    }
  }
  const yTicks: number[] = [];
  for (let g = Math.ceil(yMin / step) * step; g <= yMax; g += step) yTicks.push(g);

  // x ticks every 10 years.
  const xTicks: number[] = [];
  for (let t = Math.ceil(xMin / 10) * 10; t <= xMax; t += 10) xTicks.push(t);

  // Legend: one item per series actually drawn.
  const items: { label: string; color: string; w: number; dash: string | null }[] = [
    { label: "Observed", color: "var(--chart-obs)", w: 2.5, dash: null },
  ];
  if (whatIf) items.push({ label: "What-if", color: "var(--chart-whatif)", w: 2.5, dash: null });
  if (projected) items.push({ label: "Projected", color: "var(--chart-proj)", w: 2.5, dash: null });
  if (bau) items.push({ label: "BAU (mean inflow)", color: "var(--chart-bau)", w: 2, dash: "6 4" });
  let totalW = 0;
  for (let i = 0; i < items.length; i++) totalW += 22 + LEGEND_WIDTHS[i] + (i < items.length - 1 ? 14 : 0);
  let lx = W - MR - totalW;
  const ly = MT - 18;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full">
      {yTicks.map((g) => (
        <g key={`y${g}`}>
          <line x1={ML} y1={y(g)} x2={W - MR} y2={y(g)} stroke="var(--chart-grid)" strokeWidth={1} />
          <text x={ML - 6} y={y(g) + 3} textAnchor="end" fontSize={10} fill="var(--chart-text)">
            {g.toFixed(0)} ft
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={x(t)} y1={H - MB} x2={x(t)} y2={H - MB + 4} stroke="var(--chart-text)" strokeWidth={1} />
          <text x={x(t)} y={H - MB + 15} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
            {t}
          </text>
        </g>
      ))}
      {magicLevel != null && (
        <g>
          <line
            x1={ML}
            y1={y(magicLevel)}
            x2={W - MR}
            y2={y(magicLevel)}
            stroke="var(--chart-magic)"
            strokeWidth={1.5}
            strokeDasharray="2 4"
          />
          {magicLabel && (
            <text x={ML + 6} y={y(magicLevel) - 5} fontSize={10} fill="var(--chart-magic)">
              {magicLabel}
            </text>
          )}
        </g>
      )}
      {lowMarker && (
        <g>
          <line
            x1={x(lowMarker.year)}
            y1={MT}
            x2={x(lowMarker.year)}
            y2={H - MB}
            stroke="var(--chart-magic)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <circle cx={x(lowMarker.year)} cy={y(lowMarker.ft)} r={3.5} fill="var(--chart-magic)" />
          <text x={x(lowMarker.year)} y={y(lowMarker.ft) - 8} textAnchor="middle" fontSize={10} fill="var(--chart-magic)">
            {lowMarker.label}
          </text>
        </g>
      )}
      <polyline points={pointsAttr(observed, x, y)} fill="none" stroke="var(--chart-obs)" strokeWidth={1.5} />
      {bau && (
        <polyline
          points={pointsAttr(bau, x, y)}
          fill="none"
          stroke="var(--chart-bau)"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      )}
      {projected && <polyline points={pointsAttr(projected, x, y)} fill="none" stroke="var(--chart-proj)" strokeWidth={2.5} />}
      {whatIf && (
        <g>
          <polyline points={pointsAttr(whatIf, x, y)} fill="none" stroke="var(--chart-whatif)" strokeWidth={2.5} />
          <circle cx={x(whatIf[1][0])} cy={y(whatIf[1][1])} r={3.5} fill="var(--chart-whatif)" />
        </g>
      )}
      {items.map((it, i) => {
        const el = (
          <g key={it.label}>
            <line
              x1={lx}
              y1={ly}
              x2={lx + 18}
              y2={ly}
              stroke={it.color}
              strokeWidth={it.w}
              strokeDasharray={it.dash ?? undefined}
            />
            <text x={lx + 22} y={ly + 3} fontSize={10} fill="var(--chart-text)">
              {it.label}
            </text>
          </g>
        );
        lx += 22 + LEGEND_WIDTHS[i] + (i < items.length - 1 ? 14 : 0);
        return el;
      })}
    </svg>
  );
}
