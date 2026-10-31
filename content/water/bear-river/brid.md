# Box Elder Irrigation

← [Bear River dashboard](/water/bear-river) · [Canals](/water/bear-river/diversions/canals) · [BRWCD](/water/bear-river/diversions/brmd) · **Box Elder Irrigation** · [Brigham City Irrigation](/water/bear-river/diversions/bcid)

The dashboard labels this diversion **"Box Elder Irrigation District (BRID)."** No single "Box Elder Irrigation District" exists. Box Elder's irrigation is carried out by **many separate canal and ditch companies**, not one district. The dashboard's "BRID" is a **generic label for the Box Elder Valley's irrigation as a whole** — and it substantially overlaps with the [canals](/water/bear-river/diversions/canals) diversion, which describes the same physical system.

This page exists to be straight about that: of the four diversions on the dashboard, "BRID" is the one whose name is most clearly a model construct rather than a real entity.

## Where the water goes

Across the **Box Elder Valley** — the irrigated farmland on the valley floor and the foothills around **Brigham City, Corinne, Tremonton, and the surrounding communities** of northwestern Utah. The water comes from the Bear River and is moved across the fields by the region's canals, laterals, and ditches.

## What it is used for

**Irrigation of crops and forage** — the same uses as the canals: alfalfa and hay, pasture, and row crops. The Box Elder Valley is one of Utah's most productive agricultural regions, and its farm economy depends on this water.

> **Why this overlaps with "canals."** The dashboard splits the valley's irrigation into three sliders — **canals (280,000), BRID (110,000), and BCID (70,000)** — for 460,000 acre-feet/year of irrigation in total. But there is no three-way physical division of the valley's canals that matches these three labels. The three sliders are **arbitrary buckets of one system** (the Box Elder canal and ditch network), created so the what-if dashboard can let you drag irrigation up and down in parts. If you are trying to map a slider to a real, named operator, "BRID" is the one that will not map cleanly.

## Who holds the rights and operates it

Because there is no single district, there is **no single operator.** The water is held and operated by the **dozens of independent mutual canal and ditch companies** of Box Elder County (the same ones described on the [canals page](/water/bear-river/diversions/canals)). Each is owned by the farmers and landowners it serves, and each holds water rights with priority dates that determine who is served first in a shortage.

If a single "BRID" did exist, it would be a **water users association or irrigation district** — the kind of entity that consolidates many small ditch owners under one management. But the state's canal registry shows Box Elder as a patchwork of separate companies, so the dashboard's "district" is a fiction for modeling purposes.

## How it is monitored and regulated

- **Self-reporting** by the individual canal and ditch companies to the state.
- **Utah DWR** regulates the companies, administers the water rights, and publishes the **water-use accounting** (the Box Elder area appears as the Brigham City and Corinne sub-areas).
- **USGS gauges** (Corinne 10126000, below-O-Line 10126050) measure the river's overall loss across the valley — the closest independent check on total irrigation take.
- As an **interstate river**, the Bear River's allocation is also governed by compact and settlement agreements with Idaho and Wyoming.

## Is any of it wasted?

The same analysis as the [canals](/water/bear-river/diversions/canals) applies, because it is the same water and the same fields:

- **Flood and furrow irrigation loses a large share** of applied water to evaporation, seepage, and runoff rather than crop uptake — "waste" by the engineering definition.
- **Some of that loss is beneficial** (groundwater recharge, return flow), and Utah's push toward **efficiency and secondary metering** aims to convert "diverted but wasted" into "diverted and used."
- **At the basin scale, agriculture is the dominant use** (~63% of Bear River basin water per the 2016 USU white paper), so efficiency here is the biggest lever for the river and the lake.

The specific "waste" concern for a *district-level* label like BRID is that it **hides the variation**: some Box Elder operators have modernized to pivots and drip, while others still flood-irrigate. A single "BRID" number cannot show that spread.

## The dashboard number

The dashboard assigns **110,000 acre-feet/year** to "BRID." This is a **modeled estimate, not a measured figure for any real entity** — because no such entity exists. It is one of three arbitrary buckets the dashboard uses to represent the valley's ~460,000 acre-feet/year of irrigation. Do not read it as the take of a specific "Box Elder Irrigation District."

For scale: the DWR's water-use accounting puts the **Brigham City sub-area** at about **147,600 acre-feet/year** of surface agricultural diversion (1989–2024 mean) — one sub-area, already larger than this single "BRID" bucket, which is a sign the buckets are a modeling convenience rather than a census of real operators.

## Sources

| Claim | Source | Confidence |
|---|---|---|
| No single "Box Elder Irrigation District" exists | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) + search | High — absence confirmed |
| Box Elder irrigation = many separate canal/ditch companies | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) | High — state registry |
| Corinne / below-O-Line gauges | [USGS NWIS](https://waterdata.usgs.gov/) | High — federal gauge data |
| Agriculture ≈ 63% of basin use | [Wurtsbaugh et al. 2016 white paper](https://digitalcommons.usu.edu/wats_facpub/875) | High — peer-reviewed |
| 110,000 acre-feet/year for "BRID" | This dashboard's `diversions.json` | **Low — modeled estimate, no real entity** |

## Data gaps

- **No real entity to document.** The honest finding is that "BRID" is a model label. The underlying reality (the Box Elder canal system) is documented on the [canals page](/water/bear-river/diversions/canals).
- **The three-way irrigation split (canals / BRID / BCID) has no physical basis** in the sources found; it appears to be a dashboard modeling choice.
- **Per-company diversion totals** are not publicly aggregated in a form the pipeline can read.
