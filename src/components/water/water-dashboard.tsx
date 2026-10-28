// The interactive what-if dashboard for one lake. Pure composition of the
// shared water components (charts, controls) over the pure compute layer,
// so every number on the page flows through the tested functions in
// src/lib/water/compute.ts.
//
// State: the selected water year, the per-river inflow sliders (the single
// scenario source of truth), the projection start year, and the horizon.
// Selecting a year loads that year's actuals into the sliders; the
// projection start year follows the main year unless it is a partial year.

"use client";

import { useMemo, useState } from "react";
import {
  ElevAreaCurve,
  WaterModel,
  actualAcftFor,
  allYears,
  computeLongTermMeans,
  computeProjection,
  computeWhatIf,
  defaultYear,
  findInflowRow,
  findLevelRow,
  fmtAreaSqMi,
  fmtDeltaFt,
  fmtFt,
  initialValues,
  inflowSeries,
  lowMarker,
  observedSeries,
  projectionYears,
  sliderMaxAcft,
  yearNote,
} from "@/lib/water";
import type { LakeConfig } from "@/lib/water";
import { HowThisWorks } from "./how-this-works";
import { DataSources } from "./data-sources";
import { LevelChart } from "./level-chart";
import { WhatIfChart } from "./whatif-chart";
import { YearPicker } from "./year-picker";
import { HorizonSelect } from "./horizon-select";
import { InflowControls } from "./inflow-controls";

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
      {fmtDeltaFt(value)}
    </span>
  );
}

export function WaterDashboard({ lake }: { lake: LakeConfig }) {
  const curve = useMemo(() => new ElevAreaCurve(lake.data.elevArea), [lake]);
  const model = useMemo(() => new WaterModel(curve.area), [curve]);
  const means = useMemo(() => computeLongTermMeans(lake), [lake]);
  const maxes = useMemo(
    () => Object.fromEntries(lake.rivers.map((s) => [s.key, sliderMaxAcft(lake, s.key)])),
    [lake],
  );
  const years = useMemo(() => allYears(lake), [lake]);
  const projYears = useMemo(() => projectionYears(lake), [lake]);
  const observed = useMemo(() => observedSeries(lake), [lake]);
  const inflow = useMemo(() => inflowSeries(lake), [lake]);
  const low = useMemo(() => lowMarker(lake), [lake]);

  const [year, setYear] = useState(() => defaultYear(lake));
  const [valuesAcft, setValuesAcft] = useState(() => initialValues(lake, defaultYear(lake)));
  const [projYear, setProjYear] = useState<number | null>(() => defaultYear(lake));
  const [horizon, setHorizon] = useState(lake.horizonOptions?.[0] ?? 5);
  const horizons = lake.horizonOptions ?? [5, 10, 15, 20];

  const levelRow = findLevelRow(lake, year);
  const actuals = useMemo(() => actualAcftFor(lake, year), [lake, year]);
  const whatIf = useMemo(() => computeWhatIf(lake, model, year, valuesAcft), [lake, model, year, valuesAcft]);
  const projection = useMemo(
    () => computeProjection(lake, model, projYear, horizon, valuesAcft),
    [lake, model, projYear, horizon, valuesAcft],
  );

  function handleYear(y: number) {
    setYear(y);
    setValuesAcft(initialValues(lake, y));
    const row = findInflowRow(lake, y);
    if (row && !row.partial) setProjYear(y);
    else setProjYear(null);
  }

  function handleSlider(key: string, valueAcft: number) {
    setValuesAcft((prev) => ({ ...prev, [key]: valueAcft }));
  }

  function handlePct(key: string, pct: number) {
    setValuesAcft((prev) => ({ ...prev, [key]: (pct / 100) * (means[key] || 0) }));
  }

  function handleBau() {
    setValuesAcft({ ...means });
  }

  const note = yearNote(lake, year);
  const projNote =
    projYear == null
      ? `${year} is a partial year — pick a complete start year to project`
      : "BAU baseline = long-term mean inflow";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <YearPicker years={years} value={year} note={note || undefined} onChange={handleYear} />
        <span className="font-mono text-sm text-muted">
          {levelRow?.start_ft != null ? (
            <>
              Oct 1: {fmtFt(levelRow.start_ft)} ft · {fmtAreaSqMi(curve.area(levelRow.start_ft))}
            </>
          ) : (
            "no observed level"
          )}
        </span>
      </div>

      <Card kicker="Inflows" title="Scenario inflows">
        <InflowControls
          rivers={lake.rivers}
          valuesAcft={valuesAcft}
          actualAcft={actuals}
          maxAcft={maxes}
          onSlider={handleSlider}
          onReset={() => setValuesAcft(initialValues(lake, year))}
        />
      </Card>

      <Card kicker="What-if" title={`What if ${year} ran on these inflows?`}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Model end</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {whatIf ? `${fmtFt(whatIf.end)} ft` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Actual</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {whatIf ? `${fmtFt(whatIf.actual)} ft` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Δ vs actual</p>
            <Delta value={whatIf ? whatIf.delta : null} />
          </div>
        </div>
        {whatIf ? (
          <div className="mt-4">
            <WhatIfChart
              year={whatIf.year}
              startFt={whatIf.h0}
              actualEndFt={whatIf.actual}
              whatIfEndFt={whatIf.end}
            />
          </div>
        ) : null}
      </Card>

      <Card kicker="Projection" title={`${horizon}-year projection`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <label htmlFor="water-proj-year" className="font-mono text-xs uppercase tracking-widest text-muted">
              Start year
            </label>
            <select
              id="water-proj-year"
              value={projYear ?? ""}
              onChange={(e) => setProjYear(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="rounded-md border border-line bg-card px-2 py-1 font-mono text-sm"
            >
              {projYear == null && <option value="" disabled>—</option>}
              {projYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <HorizonSelect options={horizons} value={horizon} onChange={setHorizon} />
          <button
            type="button"
            onClick={handleBau}
            className="rounded-md border border-line bg-card px-3 py-1 text-sm hover:border-accent"
          >
            Use BAU inflows
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {lake.rivers.map((s) => {
            const pct = means[s.key] > 0 ? Math.round(((valuesAcft[s.key] || 0) / means[s.key]) * 100) : 0;
            return (
              <label key={s.key} className="flex flex-col gap-1 text-sm">
                <span className="text-muted">
                  {s.label} <span className="font-mono text-xs">×{pct}%</span>
                </span>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={pct}
                  onChange={(e) => handlePct(s.key, parseInt(e.target.value || "0", 10))}
                  className="rounded-md border border-line bg-card px-2 py-1 font-mono text-sm"
                  aria-label={`${s.label} as a percentage of the long-term mean`}
                />
              </label>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Projected end{projection ? ` (Sep 30 ${projection.endYear})` : ""}
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {projection ? `${fmtFt(projection.end)} ft` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">BAU end</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {projection ? `${fmtFt(projection.bauEnd)} ft` : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Δ vs BAU</p>
            <Delta value={projection ? projection.delta : null} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{projNote}</p>
      </Card>

      <Card kicker="Chart" title={`${lake.name} water level`}>
        <LevelChart
          observed={observed}
          whatIf={
            whatIf ? [
              [whatIf.year, whatIf.h0],
              [whatIf.year + 1, whatIf.end],
            ] : []
          }
          projected={
            projection
              ? projection.levels.map((ft, i) => [projection.startYear + i + 1, ft])
              : []
          }
          bau={
            projection
              ? projection.bauLevels.map((ft, i) => [projection.startYear + i + 1, ft])
              : []
          }
          magicLevel={lake.magicLevel}
          magicLabel={lake.magicLevel != null ? `${lake.magicLevel.toLocaleString()} ft — historic average` : undefined}
          lowMarker={low ?? undefined}
          inflow={inflow}
          ariaLabel={`${lake.name} water level chart`}
        />
        <p className="mt-2 text-xs text-muted">
          Inflow (right axis, M acre-ft) is the annual sum of the four river gauges. Dotted where the
          total is an estimate — a source gauge is missing for that year, or the water year is partial.
        </p>
      </Card>

      <HowThisWorks lake={lake} />

      <Provenance lake={lake} />

      <DataSources lake={lake} />
    </div>
  );
}

function Provenance({ lake }: { lake: LakeConfig }) {
  const cal = lake.data.calibration;
  const levelsMeta = lake.data.levels.meta;
  const inflowMeta = lake.data.inflows.meta;

  // Levels: the actual source site from the data file's meta block.
  const levelsSource = levelsMeta.site ?? "see source files";

  // Inflows: the per-river gauges from the registry (station IDs are the source of truth).
  const inflowSources = lake.rivers.map((r) => `${r.label} (${r.note})`).join(", ");

  // Data as of: the most recent per-river date in the inflow meta block.
  const asOf =
    typeof inflowMeta.data_as_of === "object" && inflowMeta.data_as_of !== null
      ? Object.values(inflowMeta.data_as_of as Record<string, string>)
      : typeof inflowMeta.data_as_of === "string"
        ? [inflowMeta.data_as_of]
        : [];
  // ISO dates sort lexicographically, so a string max gives the most recent.
  const dataAsOf = asOf.length ? asOf.reduce((a, b) => (a > b ? a : b)) : "see source files";

  return (
    <section className="rounded-lg border border-line bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">About the data</p>
      <dl className="mt-4 space-y-2 text-sm text-muted">
        <div>
          <dt className="inline font-medium text-fg">Levels: </dt>
          <dd className="inline">{levelsSource}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-fg">Inflows: </dt>
          <dd className="inline">{inflowSources}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-fg">Model:</dt>{" "}
          <dd className="inline">
            one water year per step, Δh = inflow ÷ mean surface area − evaporation depth (calibrated
            {isFinite(cal.e_ft_per_yr) ? ` at ${cal.e_ft_per_yr.toFixed(2)} ft/yr` : ""}
            {cal.validation?.rmse_ft != null ? `, RMSE ${cal.validation.rmse_ft.toFixed(2)} ft` : ""} over the
            record)
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-fg">Data as of:</dt>{" "}
          <dd className="inline">
            {dataAsOf} · generated {inflowMeta.generated_utc?.slice(0, 10)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
