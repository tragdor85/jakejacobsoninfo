// The per-river page body: title header + the interactive dashboard.
// Kept as a synchronous component so it renders in both the static export
// and jsdom tests (Next 16 passes `params` as a Promise, which the client
// renderer cannot await in tests — the page file is the async wrapper).

import { RiverDashboard } from "./river-dashboard";
import type { RiverConfig } from "@/lib/water";

export function WaterRiverView({ river }: { river: RiverConfig }) {
  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        water / {river.slug}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{river.name}</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {river.description} Pick a water year, drag the diversions, and watch the flow that reaches the lake
        respond — the model runs entirely in your browser.
      </p>
      <div className="mt-8">
        <RiverDashboard river={river} />
      </div>
    </div>
  );
}
