// The water dashboard registry: one entry per lake.
//
// Adding a lake = four JSON data files under src/data/water/<slug>/
// (levels, inflows, elev_area, calibration — see the GSL set for the
// schemas) plus a LakeConfig entry here. The /water index and the
// /water/[slug] routes are generated from this table.

import type { LakeConfig } from "./types";
import { dateToYear } from "./format";
import calibration from "@/data/water/gsl/calibration.json";
import elevArea from "@/data/water/gsl/elev_area.json";
import inflows from "@/data/water/gsl/inflows.json";
import levels from "@/data/water/gsl/levels.json";

const gsl: LakeConfig = {
  slug: "gsl",
  name: "Great Salt Lake",
  shortName: "GSL",
  location: "Utah, USA",
  description: "The largest salt lake in North America, and the last stop on the Colorado River's journey west.",
  rivers: [
    { key: "bear", label: "Bear River", note: "USGS 10126000" },
    { key: "sevier", label: "Sevier River", note: "USGS 10219000" },
    { key: "jordan", label: "Jordan River", note: "USGS 10171000" },
    { key: "weber", label: "Weber River", note: "USGS 10141000" },
  ],
  yearRange: [1949, 2026],
  // The "magic number": historic average lake level.
  magicLevel: 4200,
  // Record low from the calibration validation (daily record, 2022-11-07).
  lowMarker: {
    year: dateToYear("2022-11-07"),
    ft: 4188.5,
    label: "record low 4188.5 ft",
  },
  data: { levels, inflows, elevArea, calibration },
};

/** All registered lakes, keyed by slug. */
export const lakes: Record<string, LakeConfig> = { gsl };

/** Slugs of all registered lakes, in display order. */
export function lakeSlugs(): string[] {
  return Object.keys(lakes);
}

/** A lake by slug, or null. */
export function getLake(slug: string): LakeConfig | null {
  return lakes[slug] ?? null;
}
