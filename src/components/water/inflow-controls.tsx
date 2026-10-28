// Inflow controls: one slider per source river (0 to 2× the wettest year),
// a readout of the current value and its % of the selected year's actual,
// the total, and a reset-to-actuals button. The sliders are the single
// source of truth for the what-if and projection scenarios.

import { MAF, fmtMaf } from "@/lib/water";
import type { RiverSource } from "@/lib/water";

interface InflowControlsProps {
  rivers: RiverSource[];
  valuesAcft: Record<string, number>;
  actualAcft: Record<string, number>;
  maxAcft: Record<string, number>;
  onSlider: (key: string, valueAcft: number) => void;
  onReset: () => void;
}

export function InflowControls({ rivers, valuesAcft, actualAcft, maxAcft, onSlider, onReset }: InflowControlsProps) {
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
              {s.label}
            </label>
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
            <span className="w-36 text-right font-mono text-sm tabular-nums">
              {fmtMaf(v)} MAF
              <span className="text-muted"> · {pct === null ? "no gauge" : `${pct}%`}</span>
            </span>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-sm text-muted">
          Total <span className="font-mono text-fg">{fmtMaf(total)} MAF</span>
          {actualTotal > 0 ? ` vs ${fmtMaf(actualTotal)} MAF actual` : ""}
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
