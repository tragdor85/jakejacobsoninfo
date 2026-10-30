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
import jordanInflows from "@/data/water/jordan-river/inflows.json";
import jordanDiversions from "@/data/water/jordan-river/diversions.json";
import weberInflows from "@/data/water/weber-river/inflows.json";
import weberDiversions from "@/data/water/weber-river/diversions.json";

const gsl: LakeConfig = {
  kind: "lake",
  slug: "gsl",
  name: "Great Salt Lake",
  shortName: "GSL",
  location: "Utah, USA",
  description: "The largest salt lake in North America, and the last stop on the Colorado River's journey west.",
  rivers: [
    { key: "bear", label: "Bear River", note: "USGS 10126000", href: "/water/bear-river" },
    { key: "sevier", label: "Sevier River", note: "USGS 10219000", href: "/water/sevier-river" },
    { key: "jordan", label: "Jordan River", note: "USGS 10171000", href: "/water/jordan-river" },
    { key: "weber", label: "Weber River", note: "USGS 10141000", href: "/water/weber-river" },
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

const jordanRiver: RiverConfig = {
  kind: "river",
  slug: "jordan-river",
  name: "Jordan River",
  shortName: "Jordan",
  location: "Utah, USA",
  description:
    "A highly regulated river that flows from Utah Lake through the Salt Lake Valley and empties directly into the Great Salt Lake. Drag the SLC supply and lower-reach diversions to see what arrives at the lake.",
  source: { key: "s1700", label: "Jordan River at 1700 S, SLC", note: "USGS 10171000" },
  inflowComponents: [
    { key: "mainstem", label: "Main stem", note: "the river's own flow" },
    { key: "tributaries", label: "Tributaries", note: "creeks joining below 1700 S" },
  ],
  yearRange: [1949, 2026],
  data: { inflows: jordanInflows, diversions: jordanDiversions },
};

const weberRiver: RiverConfig = {
  kind: "river",
  slug: "weber-river",
  name: "Weber River",
  shortName: "Weber",
  location: "Utah, USA",
  description:
    "A Wasatch Range river that irrigates the Weber Valley and joins the Bear River near Brigham City — so its flow feeds the lake indirectly. Drag the lower-reach diversions to see what it delivers to the Bear River.",
  source: { key: "plain_city", label: "Weber River near Plain City", note: "USGS 10141000" },
  inflowComponents: [
    { key: "mainstem", label: "Main stem", note: "the river's own flow" },
    { key: "tributaries", label: "Tributaries", note: "Silver, Chalk, and other valley creeks" },
  ],
  yearRange: [1949, 2026],
  data: { inflows: weberInflows, diversions: weberDiversions },
};

/** All registered lakes, keyed by slug. */
export const lakes: Record<string, LakeConfig> = { gsl };

/** All registered rivers, keyed by slug. */
export const rivers: Record<string, RiverConfig> = {
  [bearRiver.slug]: bearRiver,
  [sevierRiver.slug]: sevierRiver,
  [jordanRiver.slug]: jordanRiver,
  [weberRiver.slug]: weberRiver,
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
