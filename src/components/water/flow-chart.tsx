// Main flow chart for a river (conduit): the annual flow that reaches the
// receiving lake (baseline balance) with the annual inflow on a right axis,
// a long-term-mean hairline, and the selected year's what-if + BRD-scenario
// markers.
//
// Declarative React SVG, pure (no hooks) — renders on the server and in
// client components alike. Mirrors level-chart.tsx, with the y-axis in
// million acre-ft (MAF) of flow instead of feet of level.

import type { ReactElement } from "react";
import type { InflowPoint } from "@/lib/water/types";

export interface FlowChartProps {
  /** [year, maf] pairs — the annual flow to the lake (baseline). */
  observed: [number, number][];
  /** Per-year total inflow (MAF) for the right axis; dotted where estimated. */
  inflow?: InflowPoint[];
  /** Long-term mean flow to the lake (MAF), drawn as a dashed hairline. */
  meanFlow?: number;
  /** Label for the mean-flow line. */
  meanLabel?: string;
  /** The selected year's what-if flow (a dot). */
  whatIf?: [number, number] | null;
  /** The selected year's BRD-scenario flow (a dot). */
  brd?: [number, number] | null;
  ariaLabel: string;
}

const W = 840;
const H = 300;
const ML = 50;
const MR = 44;
const MT = 30;
const MB = 28;

// "Nice" y-gridline steps (MAF), chosen so the chart shows 4–9 lines.
const NICE_STEPS = [0.1, 0.25, 0.5, 1, 2, 5];

function pointsAttr(points: [number, number][], x: (t: number) => number, y: (v: number) => number): string {
  return points.map(([t, v]) => `${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
}

function fmtMaf(v: number): string {
  return v >= 1 ? v.toFixed(1) : v.toFixed(2);
}

export function FlowChart(props: FlowChartProps): ReactElement {
  const { observed, inflow, meanFlow, meanLabel, whatIf, brd, ariaLabel } = props;

  let xMin = Infinity;
  let xMax = -Infinity;
  const yMin = 0; // flow is non-negative; pin the axis to 0 so magnitude reads
  let yMax = -Infinity;
  for (const [t, v] of observed) {
    xMin = Math.min(xMin, t);
    xMax = Math.max(xMax, t);
    yMax = Math.max(yMax, v);
  }
  if (whatIf) {
    xMin = Math.min(xMin, whatIf[0]);
    xMax = Math.max(xMax, whatIf[0]);
    yMax = Math.max(yMax, whatIf[1]);
  }
  if (brd) {
    xMin = Math.min(xMin, brd[0]);
    xMax = Math.max(xMax, brd[0]);
    yMax = Math.max(yMax, brd[1]);
  }
  if (meanFlow != null) yMax = Math.max(yMax, meanFlow);
  if (inflow) {
    for (const p of inflow) {
      xMin = Math.min(xMin, p.year);
      xMax = Math.max(xMax, p.year);
    }
  }
  if (!isFinite(xMin) || !isFinite(xMax) || !isFinite(yMax)) {
    return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full" />;
  }
  if (yMax <= 0) yMax = 1;

  const x = (t: number) => ML + ((t - xMin) / (xMax - xMin)) * (W - ML - MR);
  const y = (v: number) => MT + ((yMax - v) / (yMax - yMin)) * (H - MT - MB);

  // Inflow: a second, independent right axis (MAF), 0-based.
  const inflowVals = inflow ? inflow.map((p) => p.maf) : [];
  const hasInflow = inflowVals.length > 0;
  const inflowMaxRaw = hasInflow ? Math.max(...inflowVals) : 0;
  let inflowStep = 0.5;
  for (const n of NICE_STEPS) {
    if (n >= inflowMaxRaw / 6) {
      inflowStep = n;
      break;
    }
  }
  const inflowMax = hasInflow ? Math.max(inflowStep, Math.ceil(inflowMaxRaw / inflowStep) * inflowStep) : 0;
  const yInflow = (v: number) => MT + ((inflowMax - v) / inflowMax) * (H - MT - MB);
  const inflowTicks: number[] = [];
  if (hasInflow) {
    for (let g = 0; g <= inflowMax + 1e-9; g += inflowStep) inflowTicks.push(g);
  }
  const hasEstimated = hasInflow && inflow!.some((p) => p.estimated);

  // Left-axis gridlines at a nice step.
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
    { label: "Flow to lake", color: "var(--chart-obs)", w: 2.5, dash: null },
  ];
  if (whatIf) items.push({ label: "What-if", color: "var(--chart-whatif)", w: 2.5, dash: null });
  if (brd) items.push({ label: "BRD", color: "var(--chart-magic)", w: 2.5, dash: null });
  if (meanFlow != null) items.push({ label: "Mean", color: "var(--chart-bau)", w: 2, dash: "6 4" });
  if (hasInflow) items.push({ label: "Inflow", color: "var(--chart-inflow)", w: 1.5, dash: null });
  if (hasEstimated) items.push({ label: "Inflow, est.", color: "var(--chart-inflow)", w: 1.5, dash: "4 3" });
  const widths = items.map((it) => it.label.length * 6 + 22);
  let totalW = 0;
  for (let i = 0; i < items.length; i++) totalW += widths[i] + (i < items.length - 1 ? 14 : 0);
  let lx = W - MR - totalW;
  const ly = MT - 18;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full">
      {yTicks.map((g) => (
        <g key={`y${g}`}>
          <line x1={ML} y1={y(g)} x2={W - MR} y2={y(g)} stroke="var(--chart-grid)" strokeWidth={1} />
          <text x={ML - 6} y={y(g) + 3} textAnchor="end" fontSize={10} fill="var(--chart-text)">
            {fmtMaf(g)}
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
      {hasInflow &&
        inflow!.map((p, i) => {
          if (i === 0) return null;
          const prev = inflow![i - 1];
          const dashed = p.estimated || prev.estimated;
          return (
            <line
              key={`inflow-${p.year}`}
              x1={x(prev.year)}
              y1={yInflow(prev.maf)}
              x2={x(p.year)}
              y2={yInflow(p.maf)}
              stroke="var(--chart-inflow)"
              strokeWidth={1.5}
              strokeDasharray={dashed ? "4 3" : undefined}
            />
          );
        })}
      {hasInflow &&
        inflowTicks.map((g) => (
          <text
            key={`inflowy${g}`}
            x={W - MR + 6}
            y={yInflow(g) + 3}
            textAnchor="start"
            fontSize={10}
            fill="var(--chart-inflow)"
          >
            {fmtMaf(g)}
          </text>
        ))}
      {hasInflow && (
        <text x={W - MR + 6} y={MT - 8} textAnchor="start" fontSize={10} fill="var(--chart-inflow)">
          MAF
        </text>
      )}
      {meanFlow != null && (
        <g>
          <line
            x1={ML}
            y1={y(meanFlow)}
            x2={W - MR}
            y2={y(meanFlow)}
            stroke="var(--chart-bau)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          {meanLabel && (
            <text x={ML + 6} y={y(meanFlow) - 5} fontSize={10} fill="var(--chart-bau)">
              {meanLabel}
            </text>
          )}
        </g>
      )}
      <polyline points={pointsAttr(observed, x, y)} fill="none" stroke="var(--chart-obs)" strokeWidth={1.5} />
      {whatIf && <circle cx={x(whatIf[0])} cy={y(whatIf[1])} r={3.5} fill="var(--chart-whatif)" />}
      {brd && <circle cx={x(brd[0])} cy={y(brd[1])} r={3.5} fill="var(--chart-magic)" />}
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
        lx += widths[i] + (i < items.length - 1 ? 14 : 0);
        return el;
      })}
    </svg>
  );
}
