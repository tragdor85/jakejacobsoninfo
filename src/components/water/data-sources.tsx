// "Data sources" + "How the data is processed" for the water dashboard.
//
// The sources list links out to each authoritative page (the USGS gauge pages,
// the Utah DWR page, and the USGS OGC API). The processing notes describe
// exactly what the pipeline does to the raw data and why each step is
// acceptable. Nothing is invented: the source strings come from the data
// files' meta blocks and the lake registry, and the processing steps mirror
// the committed pipeline (fetch_usgs.py, calibrate.py, elev-area.ts).

import type { LakeConfig } from "@/lib/water";
import { Section } from "./how-this-works";

/**
 * Build a USGS monitoring-location URL from a site string such as
 * "USGS-10010000 (62614, ft)" or "USGS 10126000". Returns null when there is
 * no 8-digit site number to link on.
 */
function usgsSiteUrl(site: string | undefined): string | null {
  if (!site) return null;
  const m = site.match(/\b(\d{8})\b/);
  return m ? `https://waterdata.usgs.gov/monitoring-location/${m[1]}` : null;
}

interface SourceItem {
  name: string;
  detail: string;
  url?: string;
  linkLabel?: string;
}

interface StepItem {
  name: string;
  what: string;
  why: string;
}

/**
 * "Where the data comes from" (each source links to its authoritative page)
 * and "How the data is processed" (what the tooling does to the raw data, and
 * why each step is acceptable).
 */
export function DataSources({ lake }: { lake: LakeConfig }) {
  const levelsMeta = lake.data.levels.meta;
  const inflowMeta = lake.data.inflows.meta;
  const cal = lake.data.calibration;

  // --- Data sources --------------------------------------------------------
  const sources: SourceItem[] = [
    {
      name: "Lake level",
      detail: `Great Salt Lake surface elevation — ${levelsMeta.site ?? "USGS"}`,
      url: usgsSiteUrl(levelsMeta.site) ?? undefined,
      linkLabel: "USGS page",
    },
    ...lake.rivers.map((r) => {
      const desc = inflowMeta.sites?.[r.key] ?? r.note ?? "";
      return {
        name: r.label,
        detail: desc,
        url: usgsSiteUrl(desc || r.note) ?? undefined,
        linkLabel: "USGS page",
      };
    }),
    {
      name: "Elevation–area curve",
      detail: "published USGS hypsometric curve, calibrated to the Utah DWR anchor points",
      url: "https://water.utah.gov/great-salt-lake/",
      linkLabel: "Utah DWR",
    },
    {
      name: "Daily values",
      detail: "fetched from the USGS Water Data OGC API",
      url: inflowMeta.api ?? undefined,
      linkLabel: "API",
    },
  ];

  // --- Processing steps ----------------------------------------------------
  const rmse = cal.validation?.rmse_ft != null ? cal.validation.rmse_ft.toFixed(2) : null;
  const steps: StepItem[] = [
    {
      name: "Daily values → water years",
      what: "Daily observations are grouped into water years (Oct 1 – Sep 30); each year keeps its start and end level and its total inflow.",
      why: "The water year is the standard accounting period for this basin, and it is an aggregation of observed values — the underlying figures are USGS daily means, not estimates.",
    },
    {
      name: "Cubic feet per second → acre-feet",
      what: "Each river’s daily mean flow is converted to volume and summed over the year: daily CFS × 86,400 s ÷ 43,560 ft³/acre-ft.",
      why: "A pure unit conversion (flow rate → annual volume); no data is added or removed.",
    },
    {
      name: "Gap-filling",
      what: "Short gaps in a daily record are linearly interpolated between the surrounding observations — up to 31 days for the fast-varying rivers and up to 366 days for the slowly-varying lake level (which was recorded monthly early on). Longer gaps are left missing, and every filled day is counted per source.",
      why: "Linear interpolation across a short gap is a standard, conservative fix for brief missing data; the caps stop it from fabricating long stretches, and the filled-day counts are stored in the data file.",
    },
    {
      name: "Elevation → surface area",
      what: "The lake’s area at any level is read from the published elevation–area curve, interpolated with a smooth monotone (PCHIP) spline between the table’s 0.5-ft rows and clamped to the table’s range outside it.",
      why: "PCHIP is smooth and monotonicity-preserving, so area never decreases with elevation or overshoots between the published points; clamping avoids inventing area beyond the measured range. The curve is the published USGS/DWR relationship, not a fit.",
    },
    {
      name: "Calibrated residual evaporation",
      what: "Evaporation is not measured directly; it is the mass-balance residual e(y) = I(y) ÷ A_avg(y) − (h_end − h_start). The model uses the per-year residuals, and the single reported number is their mean.",
      why: `This is a derived parameter, not a change to the observed data — the observed levels and inflows are used as-is. The residual legitimately bundles evaporation with the unmeasured terms (groundwater, diversions, small streams)${
        rmse ? `, and it is validated against the full record (RMSE ${rmse} ft)` : "."
      }`,
    },
    {
      name: "Rounding",
      what: "Values are rounded for storage — inflow to whole acre-feet, level to 0.01 ft.",
      why: "The rounding is far below the model’s resolution (levels are read to about 0.1 ft on the charts), so it does not affect the results.",
    },
  ];

  return (
    <>
      <Section kicker="Data sources" title="Where the data comes from">
        <p>
          Every figure on this page traces back to a public source. The links go to the
          authoritative page for each gauge and curve; the raw daily values behind them come
          from the USGS Water Data OGC API.
        </p>
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.name}>
              <strong className="font-medium text-fg">{s.name}:</strong> {s.detail}
              {s.url ? (
                <>
                  {" "}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {s.linkLabel ?? "source"}
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="Processing" title="How the data is processed">
        <p>
          The tooling does not alter the observed values — it converts units, fills brief gaps,
          and derives the model’s evaporation term. Each step, and why it is acceptable:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {steps.map((s) => (
            <li key={s.name}>
              <strong className="font-medium text-fg">{s.name}.</strong> {s.what}{" "}
              <span className="text-fg">{s.why}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
