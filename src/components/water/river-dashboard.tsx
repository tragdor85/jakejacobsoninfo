// The interactive what-if dashboard for one river (conduit). Pure composition
// of the shared water components (charts, controls) over the pure compute layer,
// so every number on the page flows through the tested functions in
// src/lib/water/river-compute.ts.
//
// State: the selected water year, the per-component inflow sliders, the per-
// diversion sliders, and the BRD scenario toggle. Selecting a year loads that
// year's actuals into the inflow sliders. The response variable is the flow
// that reaches the receiving lake (MAF/yr); lowering a diversion raises it.

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  RiverModel,
  riverYears,
  baselineMults,
  riverDefaultYear,
  riverInflowRow,
  flowToLakeSeries,
  fmtDeltaMaf,
  fmtMaf,
  initialDiversionValues,
  initialInflowValues,
  riverInflowSeries,
  maxInflowValues,
  meanFlowToLake,
} from "@/lib/water";
import type { RiverConfig } from "@/lib/water";
import { HowThisWorksRiver } from "./how-this-works-river";
import { FlowChart } from "./flow-chart";
import { DiversionControls } from "./diversion-controls";
import { InflowControls } from "./inflow-controls";
import { YearPicker } from "./year-picker";

function Card({ kicker, title, children }: { kicker: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{kicker}</p>
      {title ? <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Delta({ value }: { value: number | null }) {
  if (value == null) return <span className="text-2xl font-semibold text-muted">—</span>;
  return (
    <span className={`text-2xl font-semibold tabular-nums ${value >= 0 ? "text-accent" : "text-muted"}`}>
      {fmtDeltaMaf(value)}
    </span>
  );
}

export function RiverDashboard({ river }: { river: RiverConfig }) {
  const model = useMemo(() => new RiverModel(river.data.diversions), [river]);
  const years = useMemo(() => riverYears(river), [river]);
  const observed = useMemo(() => flowToLakeSeries(river, model), [river, model]);
  const inflow = useMemo(() => riverInflowSeries(river), [river]);
  const mean = useMemo(() => meanFlowToLake(river, model), [river, model]);
  const maxes = useMemo(() => maxInflowValues(river), [river]);
  const diversions = river.data.diversions.diversions;
  const brd = river.data.diversions.scenarios["brd"];

  const [year, setYear] = useState(() => riverDefaultYear(river));
  const [inflowAcft, setInflowAcft] = useState(() => initialInflowValues(river, riverDefaultYear(river)));
  const [diversionAcft, setDiversionAcft] = useState(() => initialDiversionValues(river));
  const [brdOn, setBrdOn] = useState(false);

  const row = useMemo(() => riverInflowRow(river, year), [river, year]);
  const actualInflow = useMemo(() => initialInflowValues(river, year), [river, year]);

  const whatIf = useMemo(() => {
    if (!row) return null;
    const inflowMults: Record<string, number> = {};
    for (const c of river.inflowComponents) {
      const a = actualInflow[c.key] || 0;
      inflowMults[c.key] = a > 0 ? (inflowAcft[c.key] || 0) / a : 0;
    }
    const diversionMults: Record<string, number> = {};
    for (const d of diversions) diversionMults[d.key] = d.avg_af > 0 ? (diversionAcft[d.key] || 0) / d.avg_af : 0;
    const base = baselineMults(river);
    const baseline = model.flowToLake(row, base, base, 0);
    const extra = brdOn && brd ? brd.new_diversion_af : 0;
    const what = model.flowToLake(row, inflowMults, diversionMults, extra);
    const breakdown = model.breakdown(row, inflowMults, diversionMults, extra);
    return { year, baseline, whatIf: what, delta: what - baseline, breakdown };
  }, [row, river, year, actualInflow, inflowAcft, diversionAcft, brdOn, brd, model, diversions]);

  // Long-term mean inflow over complete years, used to flag a dry year.
  const meanInflowAcft = useMemo(() => {
    const rows = river.data.inflows.filter((r) => r.complete);
    if (!rows.length) return 0;
    return rows.reduce((s, r) => s + (r.total ?? 0), 0) / rows.length;
  }, [river]);
  const inflowTotal = row?.total ?? 0;
  const isDry = inflowTotal > 0 && inflowTotal < meanInflowAcft * 0.8;
  // The default year is the last COMPLETE water year. A partial (in-progress)
  // year is labeled so its low total is not mistaken for a full-year value.
  const yearNote = !row?.complete
    ? `${year} is in progress — a partial year, not a full total.`
    : `${year} is the last complete year.` +
      (isDry
        ? ` It was dry (${fmtMaf(inflowTotal)} MAF vs ${fmtMaf(meanInflowAcft)} MAF mean), so the diversions took most of the flow.`
        : "");

  function handleYear(y: number) {
    setYear(y);
    setInflowAcft(initialInflowValues(river, y));
    setBrdOn(false);
  }

  function handleInflowSlider(key: string, valueAcft: number) {
    setInflowAcft((prev) => ({ ...prev, [key]: valueAcft }));
  }

  function handleDiversionSlider(key: string, valueAcft: number) {
    setDiversionAcft((prev) => ({ ...prev, [key]: valueAcft }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <YearPicker years={years} value={year} onChange={handleYear} />
        <span className="font-mono text-sm text-muted">
          {row?.total != null ? (
            <>
              Inflow (Corinne): {fmtMaf(row.total)} MAF
              {row.complete ? "" : " · in progress"}
            </>
          ) : (
            "no inflow gauge data"
          )}
        </span>
      </div>

      <Card kicker="Inflows" title="Scenario inflows">
        <InflowControls
          rivers={river.inflowComponents}
          valuesAcft={inflowAcft}
          actualAcft={actualInflow}
          maxAcft={maxes}
          onSlider={handleInflowSlider}
          onReset={() => setInflowAcft(initialInflowValues(river, year))}
        />
        <p className="mt-3 text-xs text-muted">
          The Corinne gauge reads the river&rsquo;s total flow, split here into main stem and tributaries.
          Lowering an inflow component reduces what the river delivers.
        </p>
      </Card>

      <Card kicker="Diversions" title="Box Elder Valley diversions">
        <DiversionControls
          diversions={diversions}
          valuesAcft={diversionAcft}
          baselineAcft={initialDiversionValues(river)}
          onSlider={handleDiversionSlider}
          onReset={() => setDiversionAcft(initialDiversionValues(river))}
        />
        <p className="mt-3 text-xs text-muted">
          These are the human-controlled takes between Corinne and the lake. Lowering a diversion frees
          water for the lake. In dry years the take is capped by available flow (water-right priority).
        </p>
      </Card>

      <Card kicker="What-if" title={`What reaches the lake in ${year}?`}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Baseline</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {whatIf ? `${fmtMaf(whatIf.baseline)} MAF` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              What-if{brdOn ? " + BRD" : ""}
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {whatIf ? `${fmtMaf(whatIf.whatIf)} MAF` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Δ vs baseline</p>
            <Delta value={whatIf ? whatIf.delta : null} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{yearNote}</p>
        {whatIf?.breakdown ? (
          <div className="mt-3 rounded-md border border-line p-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Where the water goes</p>
            <dl className="mt-2 space-y-1 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-muted">Inflow (Corinne)</dt>
                <dd className="font-mono">{fmtMaf(whatIf.breakdown.inflow)} MAF</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">− Diversions</dt>
                <dd className="font-mono">{fmtMaf(whatIf.breakdown.diversions)} MAF</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">− Residual</dt>
                <dd className="font-mono">{fmtMaf(whatIf.breakdown.residual)} MAF</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-1">
                <dt className="font-medium text-fg">= To the lake</dt>
                <dd className="font-mono font-semibold">{fmtMaf(whatIf.breakdown.flowToLake)} MAF</dd>
              </div>
            </dl>
          </div>
        ) : null}
        {brd ? (
          <label className="mt-4 flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={brdOn}
              onChange={(e) => setBrdOn(e.target.checked)}
              className="accent-accent"
            />
            Add the proposed <span className="text-fg">{brd.name}</span> (
            {fmtMaf(brd.new_diversion_af)} MAF/yr)
            {brd.lake_level_drop_inch != null && (
              <span className="text-xs">
                — fully depleted, a ~{brd.lake_level_drop_inch}&Prime; lake-level drop
              </span>
            )}
          </label>
        ) : null}
      </Card>

      <Card kicker="Chart" title={`Flow to the ${river.name === "Bear River" ? "Great Salt Lake" : "lake"}`}>
        <FlowChart
          observed={observed.map((p) => [p.year, p.maf] as [number, number])}
          inflow={inflow}
          meanFlow={mean}
          meanLabel={`${mean.toFixed(2)} MAF — long-term mean`}
          whatIf={whatIf ? [whatIf.year, whatIf.whatIf / 1e6] : null}
          brd={
            whatIf && brdOn && brd
              ? [whatIf.year, model.flowToLake(row!, { ...baselineMults(river) }, { ...baselineMults(river) }, brd.new_diversion_af) / 1e6]
              : null
          }
          ariaLabel={`${river.name} flow to the lake chart`}
        />
        <p className="mt-2 text-xs text-muted">
          Flow to the lake (left axis, MAF) is the annual balance: inflow minus diversions minus residual.
          Inflow (right axis) is the measured Corinne total, dotted where the year is incomplete.
        </p>
      </Card>

      <HowThisWorksRiver river={river} />

      <RiverProvenance river={river} />

      <Card kicker="Related" title="See also">
        <p className="text-sm text-muted">
          The <Link href="/water/gsl" className="text-accent hover:underline">
            Great Salt Lake
          </Link>{" "}
          dashboard models the lake this river feeds. Its &ldquo;Bear River&rdquo; inflow slider uses the
          pre-diversion Corinne gauge — this page shows what actually survives the diversions to reach the
          lake.
        </p>
      </Card>
    </div>
  );
}

function RiverProvenance({ river }: { river: RiverConfig }) {
  const div = river.data.diversions;
  const sources = [
    `${river.source.label} (${river.source.note}) — measured inflow`,
    ...div.diversions.map((d) => `${d.name} — ${d.kind}`),
  ];
  return (
    <section className="rounded-lg border border-line bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">About the data</p>
      <dl className="mt-4 space-y-2 text-sm text-muted">
        <div>
          <dt className="inline font-medium text-fg">Inflow: </dt>
          <dd className="inline">{river.source.label} ({river.source.note}), {river.yearRange[0]}–{river.yearRange[1]}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-fg">Diversions: </dt>
          <dd className="inline">{sources.slice(1).join(", ")}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-fg">Model: </dt>
          <dd className="inline">
            flow to lake = inflow − diversions − residual; diversions scale with available flow up to{" "}
            {Math.round(div.dry_take_cap * 100)}% of inflow, residual is {Math.round(div.residual_frac * 100)}% of
            inflow
          </dd>
        </div>
        {div.provenance?.length ? (
          <div>
            <dt className="inline font-medium text-fg">Caveats: </dt>
            <dd className="inline">diversion volumes are estimates (see the pipeline&rsquo;s research notes)</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
