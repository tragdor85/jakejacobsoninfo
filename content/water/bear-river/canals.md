# The Box Elder Valley Canals

← [Bear River dashboard](/water/bear-river) · **Canals** · [BRWCD](/water/bear-river/diversions/brmd) · [Box Elder Irrigation](/water/bear-river/diversions/brid) · [Brigham City Irrigation](/water/bear-river/diversions/bcid)

The dashboard's **"Bear River Dam canals"** slider stands for the irrigation canal and ditch system of the Box Elder Valley — the network of canals, laterals, and ditches that carry Bear River water across the valley's fields. It is not a single project. It is the accumulated result of a century and a half of farmers digging channels and staking water claims, and the 280,000 acre-feet the dashboard assigns to "canals" really represents the valley's canal irrigation as a whole, not one named district.

This is the largest of the four diversions and the reason the Bear River visibly thins as it crosses Box Elder County.

## Where the water goes

The canals take water from the Bear River in the Box Elder Valley and distribute it across the valley floor and the foothills east of the river — the farmland around **Brigham City, Corinne, Tremonton, and the surrounding communities** of northwestern Utah.

The physical anchor is the **Bear River Canal Company**, a mutual canal company founded in **1890**. It operates five named canals — **Hammond East, Hammond West, East, Central, and West** — and describes its water as originating from **Cutler Dam** on the Bear River, carrying it as far south as Forest Street in Brigham City. But the canal company is only the largest single operator. The Utah Division of Water Resources' canal registry lists **dozens of separate canal, ditch, and irrigation companies** in Box Elder County (Bothwell Highline, Central, Cold Springs, Blue Creek/Howell–Blue Creek, Provo Point, and many more), and together they form the "canals" this slider represents.

## What it is used for

**Irrigation of crops and forage.** The Box Elder Valley is one of Utah's most productive agricultural areas. The dominant uses are:

- **Alfalfa and hay** — the valley's signature forage, cut multiple times a season
- **Pasture and rangeland** — supporting the region's cattle and dairy operations
- **Row crops and vegetables** — a smaller share, but present

The canals do not supply cities. Municipal and industrial water is a separate diversion on the dashboard (see [BRWCD](/water/bear-river/diversions/brmd)).

## Who holds the rights and operates it

There is **no single "canal district."** The system is a patchwork of independent **mutual canal and ditch companies**, each owned by the landowners and farmers whose fields it serves. Water is held by **individual stockholders** — each share of canal stock carries a defined right to a quantity of water, with a **priority date** that determines who is served first in a shortage. Many of these priority dates predate 1910, when Utah's water law was consolidated.

The **Bear River Canal Company** is the largest and oldest of these operators. It maintains the shareholder database, collects maintenance assessments from stockholders, and is governed by a board elected from its geographic districts (east, west, and central). The other Box Elder canal and ditch companies operate the same way at smaller scale.

## How it is monitored and regulated

- **Self-reporting.** Canal companies report their diversions to the state; individual stockholders are metered or estimated by their companies.
- **Utah Division of Water Resources (DWR)** is the regulator. It administers water rights, oversees the canal companies, and publishes the **water-use accounting**, which models sub-area diversions (the Box Elder area appears as the Brigham City and Corinne sub-areas).
- **USGS stream gauges** measure the river itself. The **Corinne gauge (USGS 10126000)** reads the river before the valley's takes; the **below-O-Line gauge (USGS 10126050)** reads it lower in the valley. The difference between the two — the flow the river loses crossing the valley — is the closest independent check on how much the canals actually take.
- Because the Bear River is an **interstate stream** (it flows through Idaho and Wyoming), its allocation is also shaped by interstate compact and settlement agreements, not just Utah law.

## Is any of it wasted?

This is the most contested question in the whole Bear River story, and the honest answer is **it depends on what you count as "waste."**

- **Flood and furrow irrigation is inefficient.** A large share of the water applied to a field is lost to evaporation, seepage into the ground, and runoff down the field rather than being taken up by the crop. By the engineering definition, that is "waste" — water diverted but not consumed by the plant.
- **But some of that "loss" is beneficial.** Seepage recharges the valley's shallow groundwater (which nearby farms and wells then pump), and some return flow reaches the river again. Utah has spent decades pushing **efficiency improvements** — drip irrigation, center pivots, and "secondary metering" that charges farmers for what they actually deplete rather than what they divert — precisely to convert "diverted but wasted" water into "diverted and used."
- **At the basin scale, agriculture is the dominant use.** A 2016 white paper by Utah State University and the state estimated agriculture accounts for **roughly 63% of Bear River basin water use** — which is why efficiency in this canal system is the single biggest lever for the river and the lake.

The tension: every acre-foot a farmer stops wasting is water that either stays in the valley (recharging groundwater) or is captured for a new use. Environmental groups argue the "savings" are routinely re-allocated to cities rather than returned to the river, so the lake sees little benefit.

## The dashboard number

The dashboard assigns **280,000 acre-feet/year** to "canals." This is a **modeled estimate, not a measured per-diversion figure.** For context:

- The **DWR's water-use accounting** puts the **Brigham City sub-area** at about **147,600 acre-feet/year** of surface agricultural diversion (1989–2024 mean) — one sub-area, not the whole valley.
- The **USGS gauges** show the river losing on the order of **240,000–300,000 acre-feet/year** between Corinne and the below-O-Line gauge.
- The Bear River's **mean inflow at Corinne is about 1.13 million acre-feet/year**, so the dashboard's full set of four diversions (≈580,000 acre-feet/year) represents roughly half the river's flow.

These are different scales (one sub-area, one river reach, the whole valley) and **should not be read as three versions of the same number.** The dashboard's per-diversion split is a reasonable-order-of-magnitude model for the what-if sliders, but the precise, year-by-year diversion by individual canal company lives in the DWR diversion database, which is a JavaScript application the data pipeline cannot read directly.

## Sources

| Claim | Source | Confidence |
|---|---|---|
| Bear River Canal Company founded 1890; five canals; water from Cutler Dam | [Bear River Canal Company](https://brcanal.com/) | High — operator's own site |
| Dozens of separate Box Elder canal/ditch companies, no single district | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) | High — state registry |
| Corinne gauge 10126000; below-O-Line 10126050 | [USGS NWIS](https://waterdata.usgs.gov/) | High — federal gauge data |
| Agriculture ≈ 63% of basin use; diversions lowered the lake 11 ft | [Wurtsbaugh et al. 2016 white paper](https://digitalcommons.usu.edu/wats_facpub/875) | High — peer-reviewed |
| Interstate regulation of the Bear River | [Utah DWR Bear River page](https://water.utah.gov/interstate-streams/bear-river/) | High — state source |
| 280,000 acre-feet/year for "canals" | This dashboard's `diversions.json` | **Low — modeled estimate** |

## Data gaps

- **No public per-company diversion totals.** The DWR diversion database has the detail, but it is a JavaScript app; the pipeline reads only the USGS gauges. The 280,000 figure is therefore a model, not a record.
- **The "canals" bucket is a model construct.** It bundles many independent companies into one slider. The real system has no single operator whose take equals 280,000 acre-feet.
- **Efficiency is improving unevenly.** There is no single current figure for how much of the canal water is depleted vs. returned; it varies by company, crop, and year.
