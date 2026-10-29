// Water dashboard platform: shared model, curve, and formatting.
//
// Adding a lake = four JSON data files under src/data/water/<slug>/ plus a
// LakeConfig entry in src/lib/water/registry.ts (see registry.ts).
// Adding a river = two JSON data files (inflows, diversions) plus a
// RiverConfig entry in the registry.

export * from "./types";
export * from "./model";
export * from "./river-model";
export * from "./elev-area";
export * from "./format";
export * from "./compute";
export * from "./river-compute";
export * from "./registry";
