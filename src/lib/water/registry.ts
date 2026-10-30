// The water dashboard registry: one entry per lake and one per river.
//
// Adding a lake = four JSON data files under src/data/water/<slug>/
// (levels, inflows, elev_area, calibration — see the GSL set for the
// schemas) plus a LakeConfig entry here.
//
// Adding a river = two JSON data files under src/data/water/<slug>/
// (inflows, diversions — see the bear-river set for the schemas) plus a
// RiverConfig entry here.
//
// The /water index and the /water/[slug] routes are generated from the
// combined `water` table (lakes + rivers), dispatched on `kind`.

import type { LakeConfig, RiverConfig, WaterConfig } from "./types";
import { dateToYear } from "./format";
import calibration from "@/data/water/gsl/calibration.json";
import elevArea from "@/data/water/gsl/elev_area.json";
import inflows from "@/data/water/gsl/inflows.json";
import levels from "@/data/water/gsl/levels.json";
import bearInflows from "@/data/water/bear-river/inflows.json";
import bearDiversions from "@/data/water/bear-river/diversions.json";
import sevierInflows from "@/data/water/sevier-river/inflows.json";
import sevierDiversions from "@/data/water/sevier-river/diversions.json";

const gsl: LakeConfig = {
  kind: "lake",
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

const bearRiver: RiverConfig = {
  kind: "river",
  slug: "bear-river",
  name: "Bear River",
  shortName: "Bear",
  location: "Utah, USA",
  description:
    "The largest tributary of the Great Salt Lake. Its flow is diverted in the Box Elder Valley before reaching the lake — drag the diversions to see what actually arrives.",
  source: { key: "corinne", label: "Bear River at Corinne", note: "USGS 10126000" },
  inflowComponents: [
    { key: "mainstem", label: "Main stem", note: "the river's own flow" },
    { key: "tributaries", label: "Tributaries", note: "Malad, Little Bear, …" },
  ],
  yearRange: [1949, 2026],
  data: { inflows: bearInflows, diversions: bearDiversions },
};

const sevierRiver: RiverConfig = {
  kind: "river",
  slug: "sevier-river",
  name: "Sevier River",
  shortName: "Sevier",
  location: "Utah, USA",
  description:
    "Flows into Sevier Lake, a terminal lake that mostly evaporates; only in wet years does it overflow to the Great Salt Lake. Drag the Sevier Valley diversions to see what reaches the lake.",
  source: { key: "juab", label: "Sevier River near Juab", note: "USGS 10219000" },
  inflowComponents: [
    { key: "mainstem", label: "Main stem", note: "the river's own flow" },
    { key: "tributaries", label: "Tributaries", note: "creeks joining below Juab" },
  ],
  yearRange: [1949, 2026],
  data: { inflows: sevierInflows, diversions: sevierDiversions },
};

/** All registered lakes, keyed by slug. */
export const lakes: Record<string, LakeConfig> = { gsl };

/** All registered rivers, keyed by slug. */
export const rivers: Record<string, RiverConfig> = {
  [bearRiver.slug]: bearRiver,
  [sevierRiver.slug]: sevierRiver,
};

/** All registered water bodies (lakes + rivers), keyed by slug. */
export const water: Record<string, WaterConfig> = { ...lakes, ...rivers };

/** Slugs of all registered lakes, in display order. */
export function lakeSlugs(): string[] {
  return Object.keys(lakes);
}

/** Slugs of all registered rivers, in display order. */
export function riverSlugs(): string[] {
  return Object.keys(rivers);
}

/** Slugs of all registered water bodies (lakes + rivers), in display order. */
export function waterSlugs(): string[] {
  return Object.keys(water);
}

/** A lake by slug, or null. */
export function getLake(slug: string): LakeConfig | null {
  return lakes[slug] ?? null;
}

/** A river by slug, or null. */
export function getRiver(slug: string): RiverConfig | null {
  return rivers[slug] ?? null;
}

/** Any water body (lake or river) by slug, or null. */
export function getWater(slug: string): WaterConfig | null {
  return water[slug] ?? null;
}
