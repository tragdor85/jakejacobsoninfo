# Brigham City Irrigation

← [Bear River dashboard](/water/bear-river) · [Canals](/water/bear-river/diversions/canals) · [BRWCD](/water/bear-river/diversions/brmd) · [Box Elder Irrigation](/water/bear-river/diversions/brid) · **Brigham City Irrigation**

The dashboard labels this diversion **"Brigham City Irrigation District (BCID)."** No single "Brigham City Irrigation District" exists. Irrigation around Brigham City is carried out by **local irrigation companies and water users associations**, not one district. The dashboard's "BCID" is a **generic label for irrigation in the Brigham City area** — and, like [BRID](/water/bear-river/diversions/brid), it overlaps with the [canals](/water/bear-river/diversions/canals) diversion, which is the same physical canal and ditch system.

## Where the water goes

The **Brigham City area** — the irrigated fields east of the Bear River around **Brigham City**, the largest city in the Box Elder Valley. The water is drawn from the Bear River and its storage and moved across the local fields by the region's canals and ditches.

Brigham City sits on the east side of the Bear River, and its farmland is served by the same valley canal network described on the [canals page](/water/bear-river/diversions/canals). The city's own **Water Division** handles municipal (drinking) water separately; "BCID" on the dashboard refers to the **farm** water, not the city tap.

## What it is used for

**Irrigation of crops and forage** — alfalfa, hay, pasture, and row crops in the Brigham City area, the same uses as the rest of the valley's irrigation.

> **Why this overlaps with "canals" and "BRID."** The dashboard splits the valley's irrigation into three sliders — **canals (280,000), BRID (110,000), and BCID (70,000)** — for 460,000 acre-feet/year in total. There is no three-way physical division of the valley's canals that matches these labels. The three sliders are **arbitrary buckets of one system**, created so the what-if dashboard can vary irrigation in parts. "BCID" is the smallest of the three and the most geographically specific, but it still does not map to a single named operator.

## Who holds the rights and operates it

There is **no single district.** The relevant real entities in the Brigham City area include:

- **Brigham City North Field Irrigation Company** — a mutual irrigation company serving the north fields
- **Box Elder Creek Water Users Association** — a water users association for the Box Elder Creek area
- The broader **Box Elder canal and ditch companies** (see the [canals page](/water/bear-river/diversions/canals))

Each is owned by the farmers and landowners it serves and holds water rights with priority dates. The **Bear River Canal Company** — the valley's largest and oldest canal operator — also serves Brigham City, drawing water from Cutler Dam.

## How it is monitored and regulated

- **Self-reporting** by the local irrigation companies and associations to the state.
- **Utah DWR** regulates the companies, administers the water rights, and publishes the **water-use accounting**. The Brigham City area is its own **water-use sub-area (01-01-07)**, which is the closest official aggregate for this diversion.
- **USGS gauges** (Corinne 10126000, below-O-Line 10126050) measure the river's overall loss across the valley.
- As an **interstate river**, the Bear River's allocation is also governed by compact and settlement agreements with Idaho and Wyoming.

## Is any of it wasted?

The same analysis as the [canals](/water/bear-river/diversions/canals) applies, because it is the same water and the same fields:

- **Flood and furrow irrigation loses a large share** of applied water to evaporation, seepage, and runoff rather than crop uptake — "waste" by the engineering definition.
- **Some of that loss is beneficial** (groundwater recharge, return flow), and Utah's push toward **efficiency and secondary metering** aims to convert "diverted but wasted" into "diverted and used."
- **At the basin scale, agriculture is the dominant use** (~63% of Bear River basin water per the 2016 USU white paper).

Because the Brigham City area is a **named water-use sub-area**, it is actually the one of the three irrigation buckets with the best official data behind it — which makes the dashboard's arbitrary 70,000 figure even more of a placeholder relative to the measured sub-area total.

## The dashboard number

The dashboard assigns **70,000 acre-feet/year** to "BCID." This is a **modeled estimate, not a measured figure for any real entity** — because no such district exists. It is the smallest of the three irrigation buckets.

For scale, the DWR's water-use accounting puts the **Brigham City sub-area (01-01-07)** at about **147,600 acre-feet/year** of surface agricultural diversion (1989–2024 mean) — more than double this "BCID" bucket. That gap is a clear sign the 70,000 figure is a modeling convenience, not a census of the Brigham City area's actual irrigation.

## Sources

| Claim | Source | Confidence |
|---|---|---|
| No single "Brigham City Irrigation District" exists | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) + search | High — absence confirmed |
| Brigham City North Field Irrigation Co; Box Elder Creek Water Users Assn | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) | High — state registry |
| Bear River Canal Company serves Brigham City (from Cutler Dam) | [Bear River Canal Company](https://brcanal.com/) | High — operator's own site |
| Brigham City water-use sub-area 01-01-07 (~147,600 AF ag, 1989–2024) | [Utah DWR](https://water.utah.gov/) | Medium — sub-area aggregate |
| Corinne / below-O-Line gauges | [USGS NWIS](https://waterdata.usgs.gov/) | High — federal gauge data |
| 70,000 acre-feet/year for "BCID" | This dashboard's `diversions.json` | **Low — modeled estimate, no real entity** |

## Data gaps

- **No real entity to document.** The honest finding is that "BCID" is a model label for the Brigham City area's irrigation. The underlying reality (the valley canal system) is documented on the [canals page](/water/bear-river/diversions/canals).
- **The Brigham City sub-area total (~147,600 AF) does not match the 70,000 "BCID" bucket** — the sub-area is larger, confirming the bucket is a placeholder.
- **Per-company diversion totals** are not publicly aggregated in a form the pipeline can read.
