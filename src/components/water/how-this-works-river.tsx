// "How this works" + "Data sources" for a river (conduit) dashboard.
//
// Every number is derived from the river's committed data files (inflows,
// diversions) or its RiverConfig — nothing is invented. The prose mirrors the
// model in src/lib/water/river-model.ts and the source notes in the data files.

import type { RiverConfig } from "@/lib/water";
import { fmtMaf } from "@/lib/water";
import Link from "next/link";
import { Section } from "./how-this-works";

/** Build a USGS monitoring-location URL from a site string such as "USGS 10126000". */
function usgsSiteUrl(site: string | undefined): string | null {
  if (!site) return null;
  const m = site.match(/\b(\d{8})\b/);
  return m ? `https://waterdata.usgs.gov/monitoring-location/${m[1]}` : null;
}

/**
 * "How the model works" (the flow balance) + "Limitations" (what the model
 * does not do) + "Where the data comes from". All figures are computed from
 * the river's data so the prose can never drift from the dashboard.
 */
export function HowThisWorksRiver({ river }: { river: RiverConfig }) {
  const div = river.data.diversions;
  const totalDiv = div.diversions.reduce((s, d) => s + d.avg_af, 0);
  const complete = river.data.inflows.filter((r) => r.complete);
  const meanInflow = complete.length
    ? complete.reduce((s, r) => s + (r.total ?? 0), 0) / complete.length
    : 0;

  return (
    <>
      <Section kicker="How this works" title="How the model works">
        <p>
          The {river.name} is a <strong className="font-medium text-fg">river</strong>, not a lake: it carries
          water from its headwaters to the Great Salt Lake. The model is a flow balance for each water year (Oct 1
          – Sep 30): <span className="font-mono text-fg">flow to lake = inflow − diversions − residual</span>.
        </p>
        <p>
          <em>Inflow</em> is the measured total at {river.source.label} ({river.source.note}), split into main
          stem and tributaries — the sliders on the left. <em>Diversions</em> are the human-controlled takes in
          the Box Elder Valley (about {fmtMaf(totalDiv)} MAF/yr at full build) — the sliders on the right.{" "}
          <em>Residual</em> is a calibrated fraction of inflow covering river evaporation, seepage, storage
          change, and the gap between the last gauge and the lake (there is no gauge at the mouth).
        </p>
        <p>
          Because diversions are governed by water-right priority, not a fixed share of flow, the take scales
          with available flow up to {Math.round(div.dry_take_cap * 100)}% of inflow. In a wet year the river
          carries plenty of water, so the fixed diversions take a small fraction and most of the flow reaches the
          lake. In a dry year the same diversions take a much larger fraction — up to that cap — so far less
          reaches the lake. The &ldquo;Where the water goes&rdquo; breakdown in the what-if card shows exactly
          where each year&rsquo;s inflow ends up.
        </p>
      </Section>

      <Section kicker="Limitations" title="Limitations">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-fg">The selected year is labeled.</strong> The default is the
            last complete water year. The in-progress year is available in the year picker but flagged as partial
            — its low total reflects only the months recorded so far, not a full year.
          </li>
          <li>
            <strong className="font-medium text-fg">No gauge at the mouth.</strong> The flow to the lake is a
            computed residual (inflow minus diversions minus residual losses), not a direct measurement.
          </li>
          <li>
            <strong className="font-medium text-fg">Diversion volumes are estimates.</strong> The precise
            year-by-year diversions live in the Utah DWR diversion database, a JavaScript app the pipeline cannot
            read. The figures here are grounded in the measured flow loss from Corinne to the below-O-Line gauge
            and published basin totals, but they are not the official record.
          </li>
          <li>
            <strong className="font-medium text-fg">The Corinne gauge is pre-diversion.</strong> It reads the
            river before the Box Elder Valley takes, so the inflow is the water available to divert, not what
            reaches the lake.
          </li>
          <li>
            <strong className="font-medium text-fg">Tributaries are a fixed split.</strong> The main-stem /
            tributary split is a documented proportion of the Corinne total, not independently gauged (the
            tributary gauges have no continuous record).
          </li>
        </ul>
      </Section>

      <Section kicker="Data sources" title="Where the data comes from">
        <p>
          Every figure on this page traces back to a public source. The measured inflow comes from the USGS Water
          Data OGC API (long-term mean {fmtMaf(meanInflow)} MAF/yr); the diversion volumes are documented estimates.
        </p>
        <ul className="space-y-2">
          <li>
            <strong className="font-medium text-fg">Inflow:</strong> {river.source.label} — {river.source.note}
            {usgsSiteUrl(river.source.note) ? (
              <>
                {" "}
                <a
                  href={usgsSiteUrl(river.source.note)!}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  USGS page
                </a>
              </>
            ) : null}
          </li>
          {div.diversions.map((d) => (
            <li key={d.key}>
              <strong className="font-medium text-fg">
                {d.href ? (
                  <Link href={d.href} className="text-accent hover:underline">
                    {d.name}
                  </Link>
                ) : (
                  d.name
                )}
                :
              </strong>{" "}
              {d.source}
            </li>
          ))}
          {div.scenarios["brd"] ? (
            <li>
              <strong className="font-medium text-fg">{div.scenarios["brd"].name}:</strong> {div.scenarios["brd"].source}
            </li>
          ) : null}
        </ul>
      </Section>
    </>
  );
}
