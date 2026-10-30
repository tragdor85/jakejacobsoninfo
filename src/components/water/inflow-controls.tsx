// Inflow controls: one slider per source river (0 to 2× the wettest year),
// a readout of the current value and its % of the selected year's actual,
// the total, and a reset-to-actuals button. The sliders are the single
// source of truth for the what-if and projection scenarios.

import Link from "next/link";
import { MAF, fmtMaf } from "@/lib/water";
import type { RiverSource } from "@/lib/water";

interface InflowControlsProps {
  rivers: RiverSource[];
  valuesAcft: Record<string, number>;
  actualAcft: Record<string, number>;
  maxAcft: Record<string, number>;
  /** Average annual diversion per river (acre-ft) — shown under the slider. */
  diversionAcft?: Record<string, number>;
  /** Modeled total flow to the lake (acre-ft) — shown in the total row. */
  toLakeAcft?: number | null;
  onSlider: (key: string, valueAcft: number) => void;
  onReset: () => void;
}

export function InflowControls({
  rivers,
  valuesAcft,
  actualAcft,
  maxAcft,
  diversionAcft,
  toLakeAcft,
  onSlider,
  onReset,
}: InflowControlsProps) {
  const total = rivers.reduce((t, s) => t + (valuesAcft[s.key] || 0), 0);
  const actualTotal = rivers.reduce((t, s) => t + (actualAcft[s.key] || 0), 0);
  return (
    <div className="space-y-3">
      {rivers.map((s) => {
        const v = valuesAcft[s.key] || 0;
        const a = actualAcft[s.key] || 0;
        const pct = a > 0 ? Math.round((v / a) * 100) : null;
        return (
          <div key={s.key} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3">
            <label htmlFor={`inflow-${s.key}`} className="text-sm">
              {s.href ? (
                <Link href={s.href} prefetch={false} className="text-accent hover:underline">
                  {s.label}
                </Link>
              ) : (
                s.label
              )}
            </label>
            <div className="space-y-1">
              <input
                id={`inflow-${s.key}`}
                type="range"
                min={0}
                max={maxAcft[s.key] / MAF}
                step="any"
                value={v / MAF}
                onChange={(e) => onSlider(s.key, parseFloat(e.target.value) * MAF)}
                className="w-full accent-accent"
              />
              {s.note || diversionAcft?.[s.key] != null ? (
                <p className="text-xs text-muted">
                  {s.note}
                  {diversionAcft?.[s.key] != null
                    ? ` · avg ${fmtMaf(diversionAcft[s.key]!)} MAF/yr diverted`
                    : ""}
                </p>
              ) : null}
            </div>
            <span className="w-36 text-right font-mono text-sm tabular-nums">
              {fmtMaf(v)} MAF
              <span className="text-muted"> · {pct === null ? "no gauge" : `${pct}%`}</span>
            </span>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span
          className="text-sm text-muted"
          title="To-lake total: each river's inflow minus diversions (dry-year capped) minus natural losses"
        >
          Total <span className="font-mono text-fg">{fmtMaf(total)} MAF</span>
          {actualTotal > 0 ? ` vs ${fmtMaf(actualTotal)} MAF actual` : ""}
          {toLakeAcft != null ? ` · ≈ ${fmtMaf(toLakeAcft)} MAF to lake` : ""}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-line bg-card px-3 py-1 text-sm hover:border-accent"
        >
          Reset to actuals
        </button>
      </div>
    </div>
  );
}
