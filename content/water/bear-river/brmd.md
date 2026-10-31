# Bear River Water Conservancy District (BRWCD)

← [Bear River dashboard](/water/bear-river) · [Canals](/water/bear-river/diversions/canals) · **BRWCD** · [Box Elder Irrigation](/water/bear-river/diversions/brid) · [Brigham City Irrigation](/water/bear-river/diversions/bcid)

The dashboard labels this diversion **"Bear River Municipal District (BRMD)."** That name does not correspond to a verified, real entity. No "Bear River Municipal District" appears in the state's water records. The municipal water provider for the Box Elder Valley is in fact the **Bear River Water Conservancy District (BRWCD)**, and the dashboard's "BRMD" is almost certainly a placeholder or a mislabel for it. This page documents the real entity.

## What the name should be

- **Real entity:** **Bear River Water Conservancy District (BRWCD)**
- **Created:** September 8, 1988, by court decree under the **Utah Water Conservancy Act**
- **Purpose:** to acquire, develop, and deliver water for **municipal, industrial, and some agricultural** uses across Box Elder County
- **Office:** 102 West Forest Street, Brigham City, Utah · contact via the [BRWCD website](https://www.brwcdutah.gov)
- **Website:** [brwcdutah.gov](https://www.brwcdutah.gov)

A **water conservancy district** is a special-purpose district (like a water district) that holds water rights, builds and operates supply infrastructure, and sells water to its customers. BRWCD is the principal municipal water authority for the valley.

## Where the water goes

BRWCD serves **Box Elder County**, with its retail and wholesale customers concentrated around **Brigham City** and the surrounding communities of **Beaver Dam, Bothwell, Collinston, Harper Ward, and South Willard**. It functions both as a **wholesale** supplier (delivering water to cities and communities that then retail it to households) and as a **retail** supplier to some residential and agricultural customers directly.

The City of Brigham City also runs its own **Water Division**, which provides culinary (drinking) service to roughly **20,000 residents** and maintains local lines, connections, wells, and springs. So municipal water in the valley is a two-tier system: BRWCD at the district/wholesale level, and the individual cities at the retail level.

## What it is used for

**Municipal and industrial (C&I) supply** — drinking water for the valley's cities and communities, plus industrial and commercial use. This is the non-farm half of the valley's water demand.

> **A note on the dashboard number.** The dashboard assigns **120,000 acre-feet/year** to "BRMD," but the DWR's water-use accounting models the **Brigham City sub-area's** municipal & industrial diversion at only about **10,000–13,000 acre-feet/year** (1989–2024 mean). Pure drinking-water use for a ~120,000-person county is on the order of 10,000 acre-feet/year, not 120,000. The dashboard's 120,000 figure therefore most likely represents **BRWCD's total water allocation — including the agricultural water it supplies to its farm customers — or is simply a rough placeholder.** It should not be read as 120,000 acre-feet of city tap water.

## Who holds the rights and operates it

**BRWCD holds the water rights and operates the system.** As a conservancy district created by court decree, it owns the diversion infrastructure and the associated rights, and it is governed by a board representing its district. It is also a significant **water-rights holder of record** in the canal registry (listed under Brigham City).

BRWCD is a forward-looking supplier: it is **one of the four districts designated to receive water from the proposed Bear River Development** (60,000 acre-feet/year of the project's full 220,000), which is why it has been planning and acquiring pipeline corridor through the valley.

## How it is monitored and regulated

- **Utah DWR** regulates the district's diversions and administers its water rights.
- **Secondary metering** — the state has been installing "secondary meters" that measure what a user actually *depletes* (consumes) rather than what they *divert*, so that efficiency savings are not silently re-allocated. BRWCD's supply is subject to this accounting.
- The **DWR's water-use accounting** models the district's sub-area (Brigham City) municipal & industrial diversions.
- **USGS gauges** (Corinne, below-O-Line) capture the river-level effect of all valley takes, municipal and agricultural together.
- As a conservancy district, BRWCD is also subject to the **Utah Water Conservancy Act** and reports to the state.

## Is any of it wasted?

Municipal use is the **least "wasteful"** of the valley's diversions in absolute efficiency terms — indoor use is tightly metered and relatively efficient. But two things qualify that:

- **Outdoor and lawn irrigation** is a large share of urban water use in Utah's climate, and it is the part most subject to "waste" (evaporation, over-watering). BRWCD has run **drought-response pricing** (which expired June 2022) and promotes **WaterWise** conservation programs to curb this.
- **The bigger question is allocation, not efficiency.** Critics argue that as municipal demand grows, the district's expanding footprint — and its role as a BRD recipient — pulls water out of the river that would otherwise reach the lake or recharge the valley. From the lake's perspective, every acre-foot of new municipal supply is a depletion, even if each household uses it "efficiently."

## The dashboard number

The dashboard assigns **120,000 acre-feet/year** to "BRMD." As noted above, this is **far higher than the official municipal figure** for the sub-area (~10,000–13,000 acre-feet/year) and most likely reflects BRWCD's total allocation (including agricultural supply) or is a placeholder. Treat it as a **low-confidence model value**, not a measured municipal take.

## Sources

| Claim | Source | Confidence |
|---|---|---|
| BRWCD created 1988 by court decree; serves Box Elder; contact | [BRWCD](https://www.brwcdutah.gov) | High — operator's own site |
| BRWCD retail service areas (Beaver Dam, Bothwell, etc.) | [BRWCD residential water page](https://www.brwcdutah.gov/residential-water) | High — operator's own site |
| No "Bear River Municipal District" exists | [Utah DWR canal registry](https://www.waterrights.utah.gov/canalinfo/canal_owners.asp?ColSort=County) + search | High — absence confirmed |
| BRWCD = one of four BRD recipients (60,000 AF) | [Utah DWR Bear River Development page](https://water.utah.gov/bear-river-dev/) | High — state source |
| Drought-response pricing expired 6/1/2022 | [BRWCD drought response plan](https://www.brwcdutah.gov/drought-response-plan) | High — operator's own site |
| DWR water-use accounting, M&I for Brigham City sub-area (~10–13k AF) | [Utah DWR](https://water.utah.gov/) | Medium — sub-area aggregate |
| 120,000 acre-feet/year for "BRMD" | This dashboard's `diversions.json` | **Low — modeled estimate, name unverified** |

## Data gaps

- **The dashboard label "BRMD" is unverified.** Every check points to BRWCD, but the dashboard data file does not say so explicitly, so this mapping is a well-supported inference, not a documented fact.
- **BRWCD's total allocation vs. its municipal-only take** are not cleanly separated in public sources. The 120,000 figure cannot be reconciled to the official municipal number.
- **Wholesale vs. retail split** (how much BRWCD sells to cities vs. delivers itself) is not published as a single figure.
