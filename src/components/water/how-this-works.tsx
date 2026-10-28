// "How this works" + "Limitations" for the water dashboard.
//
// Every number is derived from the lake's committed data files (levels,
// inflows, calibration) or its LakeConfig — nothing is invented. The prose
// mirrors the model in src/lib/water/model.ts and the source notes in the
// data files' meta blocks (USGS OGC API, the elevation–area curve, and the
// mass-balance calibration).

import type { ReactNode } from "react";

import type { LakeConfig } from "@/lib/water";
import { fmtFt } from "@/lib/water";

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{kicker}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/** A validation extreme (e.g. the 1986 high / 2022 low) from calibration.validation. */
interface Extreme {
  observed_ft: number;
  modeled_ft: number;
  err_ft: number;
}

/**
 * "How this works" (the model) + "Limitations" (what the model does not do).
 * All figures are computed from the lake's data so the prose can never drift
 * from what the dashboard actually shows.
 */
export function HowThisWorks({ lake }: { lake: LakeConfig }) {
  const cal = lake.data.calibration;
  const v = cal.validation;

  // --- Facts derived from the data files / config -------------------------
  const levels = lake.data.levels.data;
  const firstYear = levels[0]?.year;
  const lastYear = levels[levels.length - 1]?.year;
  const recordRange = firstYear != null && lastYear != null ? `${firstYear}–${lastYear}` : "the full";

  const magic = lake.magicLevel != null ? `${lake.magicLevel.toLocaleString()} ft` : "historic-average";
  const lowYear = lake.lowMarker ? Math.floor(lake.lowMarker.year) : null;

  // Most negative calibrated evaporation year (a very wet year).
  const negE = cal.e_per_year.filter((p) => p.e < 0);
  const mostNegE = negE.length ? negE.reduce((a, b) => (a.e < b.e ? a : b)) : null;

  // Data gaps, straight from the data files.
  const bearMissing = cal.e_per_year
    .filter((p) => p.bear_missing)
    .map((p) => p.year)
    .sort((a, b) => a - b);
  const bearRange =
    bearMissing.length > 1
      ? `${bearMissing[0]}–${bearMissing[bearMissing.length - 1]}`
      : bearMissing.length === 1
        ? `${bearMissing[0]}`
        : null;
  const partialYears = lake.data.inflows.data
    .filter((r) => r.partial)
    .map((r) => r.year)
    .sort((a, b) => a - b);

  // Fit quality, straight from the calibration validation block.
  const rmse = v?.rmse_ft != null ? v.rmse_ft.toFixed(2) : null;
  const high = v?.high_1986 as Partial<Extreme> | undefined;
  const low = v?.low_2022 as Partial<Extreme> | undefined;
  const highErr = high?.err_ft != null ? Math.abs(high.err_ft).toFixed(1) : null;
  const lowErr = low?.err_ft != null ? Math.abs(low.err_ft).toFixed(1) : null;

  return (
    <>
      <Section kicker="How this works" title="How the model works">
        <p>
          The Great Salt Lake is a <strong className="font-medium text-fg">terminal lake</strong>: it has no
          outflow, so its level rises with inflow and falls with evaporation. For each water year (Oct 1 – Sep 30)
          the model steps the level once: <span className="font-mono text-fg">Δh = I ÷ A − e</span>, where{" "}
          <em>I</em> is the total inflow set by the sliders (million acre-ft), <em>A</em> is the lake’s mean
          surface area at the current level from the published elevation–area curve (a bigger lake rises less from
          the same inflow), and <em>e</em> is the annual evaporation depth (ft/yr).
        </p>
        <p>
          The projection sustains the slider inflows for the chosen horizon (5/10/15/20 years) from a chosen start
          year and compares them against business-as-usual (long-term mean inflow). The main chart overlays both on
          the observed {recordRange} record, with the {magic} historic-average level and the {lowYear} record low
          marked.
        </p>
      </Section>

      <Section kicker="Limitations" title="Limitations">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-fg">Evaporation is a calibrated residual, not a measurement.</strong>{" "}
            e is fitted from the observed level change and the measured inflow, so it absorbs evaporation plus
            groundwater, diversions, and unmeasured streams — and can even go negative in very wet years
            {mostNegE ? ` (e.g. ${mostNegE.year}: ${fmtFt(mostNegE.e)} ft/yr)` : ""}.
          </li>
          <li>
            <strong className="font-medium text-fg">Gauges sit upstream of diversions.</strong> The river gauges
            (e.g. Corinne on the Bear) read flow before major diversions take water away, so measured inflow
            overstates what actually reaches the lake. The calibrated residual absorbs that offset for historical
            years, but what-if scenarios inherit the bias.
          </li>
          <li>
            <strong className="font-medium text-fg">Flat-lake approximation.</strong> Each annual step spreads the
            year’s inflow over the lake’s mean surface area; the area change within the year and the basin’s 3-D
            shape are ignored. Fine at annual resolution, but a coarse representation of the lake.
          </li>
          <li>
            <strong className="font-medium text-fg">Data gaps.</strong>
            {bearRange
              ? ` No Bear River gauge data ${bearRange} (its slider defaults to 0 and the residual absorbs the missing flow).`
              : ""}
            {partialYears.length ? ` ${partialYears.join(", ")} is a partial year.` : ""} The 1847–1948 level
            record is monthly.
          </li>
          <li>
            <strong className="font-medium text-fg">Fit quality.</strong> Run on actual inflows, the model
            reproduces the observed {v?.range ?? "1949–2025"} level within {rmse} ft RMSE
            {highErr ? `, with the 1986 high off by ${highErr} ft` : ""}
            {lowErr ? ` and the 2022 low off by ${lowErr} ft` : ""}.
          </li>
        </ul>
      </Section>
    </>
  );
}
