// Diversion controls: one slider per diversion (0–200% of its average
// annual take), a readout of the current take and its % of baseline, the
// total, and a reset-to-baseline button. Lowering a slider frees water for
// the lake — the sliders are the single source of truth for the what-if.

import { fmtMaf } from "@/lib/water";
import Link from "next/link";
import type { DiversionSource } from "@/lib/water";

interface DiversionControlsProps {
  diversions: DiversionSource[];
  /** Current take per diversion (acre-ft) = avg_af × slider fraction. */
  valuesAcft: Record<string, number>;
  /** Baseline take per diversion (acre-ft) = avg_af (the slider's 100%). */
  baselineAcft: Record<string, number>;
  onSlider: (key: string, valueAcft: number) => void;
  onReset: () => void;
}

export function DiversionControls({
  diversions,
  valuesAcft,
  baselineAcft,
  onSlider,
  onReset,
}: DiversionControlsProps) {
  const total = diversions.reduce((t, d) => t + (valuesAcft[d.key] || 0), 0);
  const baselineTotal = diversions.reduce((t, d) => t + (baselineAcft[d.key] || 0), 0);
  return (
    <div className="space-y-3">
      {diversions.map((d) => {
        const v = valuesAcft[d.key] || 0;
        const b = baselineAcft[d.key] || 0;
        const pct = b > 0 ? Math.round((v / b) * 100) : 0;
        return (
          <div key={d.key} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3">
            <label htmlFor={`div-${d.key}`} className="text-sm">
              {d.href ? (
                <Link href={d.href} className="text-accent hover:underline" title={`About ${d.name}`}>
                  {d.short ?? d.name}
                </Link>
              ) : (
                d.short ?? d.name
              )}
            </label>
            <input
              id={`div-${d.key}`}
              type="range"
              min={0}
              max={200}
              step="any"
              value={pct}
              onChange={(e) => onSlider(d.key, (parseFloat(e.target.value) / 100) * b)}
              className="w-full accent-accent"
            />
            <span className="w-36 text-right font-mono text-sm tabular-nums">
              {fmtMaf(v)} MAF
              <span className="text-muted"> · {pct}%</span>
            </span>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-sm text-muted">
          Total diverted <span className="font-mono text-fg">{fmtMaf(total)} MAF</span>
          {baselineTotal > 0 ? ` vs ${fmtMaf(baselineTotal)} MAF baseline` : ""}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-line bg-card px-3 py-1 text-sm hover:border-accent"
        >
          Reset to baseline
        </button>
      </div>
    </div>
  );
}
