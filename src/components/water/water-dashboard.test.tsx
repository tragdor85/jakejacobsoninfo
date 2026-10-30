import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WaterDashboard } from "./water-dashboard";
import {
  WaterModel,
  ElevAreaCurve,
  MAF,
  computeLongTermMeans,
  computeWhatIf,
  computeProjection,
  initialValues,
  fmtFt,
  getLake,
} from "@/lib/water";

const lake = getLake("gsl")!;
const model = new WaterModel(new ElevAreaCurve(lake.data.elevArea).area);

describe("WaterDashboard", () => {
  it("renders the most recent complete year with its actuals on the sliders", () => {
    render(<WaterDashboard lake={lake} />);
    expect(screen.getByLabelText(/water year/i)).toHaveValue("2025");
    // Bear River actual for 2025: 580,494 acft → 0.58 MAF on the slider.
    const bear = screen.getByLabelText("Bear River") as HTMLInputElement;
    expect(parseFloat(String(bear.value))).toBeCloseTo(0.58, 2);
  });

  it("selecting a year loads that year's actuals and recomputes the what-if", () => {
    render(<WaterDashboard lake={lake} />);
    fireEvent.change(screen.getByLabelText(/water year/i), { target: { value: "2024" } });
    const bear = screen.getByLabelText("Bear River") as HTMLInputElement;
    // 2024 Bear actual: 659,829 acft.
    expect(parseFloat(String(bear.value))).toBeCloseTo(0.66, 2);
    // The what-if readout matches an independent compute run at actuals.
    const vals = initialValues(lake, 2024);
    const wi = computeWhatIf(lake, model, 2024, vals)!;
    expect(screen.getAllByText(`${fmtFt(wi.end)} ft`)).not.toHaveLength(0);
  });

  it("moving a slider updates the what-if delta", () => {
    render(<WaterDashboard lake={lake} />);
    const bear = screen.getByLabelText("Bear River") as HTMLInputElement;
    const before = screen.getByText(/Δ vs actual/i).closest("div")!.textContent ?? "";
    fireEvent.change(bear, { target: { value: String(2 * MAF / MAF) } }); // 2 MAF Bear
    const after = screen.getByText(/Δ vs actual/i).closest("div")!.textContent ?? "";
    expect(after).not.toBe(before);
  });

  it("changing the horizon re-runs the projection and updates the heading", () => {
    render(<WaterDashboard lake={lake} />);
    expect(screen.getByText("5-year projection")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/horizon/i), { target: { value: "10" } });
    expect(screen.getByText("10-year projection")).toBeTruthy();
    // 2025 + 10 − 1 = 2034.
    expect(screen.getByText(/Sep 30 2034/)).toBeTruthy();
  });

  it("the BAU button puts the scenario on the long-term means (Δ vs BAU = 0)", () => {
    render(<WaterDashboard lake={lake} />);
    const means = computeLongTermMeans(lake);
    const p = computeProjection(lake, model, 2025, 5, means)!;
    expect(p.delta).toBeCloseTo(0, 6);
    fireEvent.click(screen.getByRole("button", { name: /use bau inflows/i }));
    // After the click the scenario equals BAU, so the delta reads +0.00 ft.
    const delta = screen.getByText(/Δ vs BAU/i).closest("div")!.textContent ?? "";
    expect(delta).toContain("+0.00 ft");
  });

  it("a partial year clears the projection and shows a note", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    fireEvent.change(screen.getByLabelText(/water year/i), { target: { value: "2026" } });
    const projYear = screen.getByLabelText(/start year/i);
    expect(projYear).toHaveValue("");
    // The partial-year note (unique to the projection card) is shown.
    expect(container.textContent ?? "").toContain("pick a complete start year");
  });

  it("renders the main chart and the what-if chart", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const svgs = container.querySelectorAll("svg");
    // Main chart + what-if chart.
    expect(svgs.length).toBe(2);
    expect(container.querySelector("svg[role='img']")).toBeTruthy();
  });

  it("shows the magic level and record low on the main chart", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("4,200");
    expect(text).toContain("4188.5");
  });

  it("renders the annual inflow line on the main chart with a right axis", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const mainSvg = Array.from(container.querySelectorAll("svg")).find(
      (s) => s.getAttribute("aria-label") === "Great Salt Lake water level chart",
    )!;
    expect(mainSvg).not.toBeNull();
    // The inflow line (blue) is drawn on the right axis.
    const inflowLines = Array.from(mainSvg.querySelectorAll("line")).filter(
      (l) => l.getAttribute("stroke") === "var(--chart-inflow)",
    );
    expect(inflowLines.length).toBeGreaterThan(0);
    // The right axis is labeled in MAF, and the estimated variant is in the legend.
    expect(mainSvg.textContent).toContain("MAF");
    expect(mainSvg.textContent).toContain("Inflow, est.");
  });

  it("links each river label to its river dashboard", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const links = Array.from(container.querySelectorAll("a[href^='/water/']"))
      .map((a) => ({ href: a.getAttribute("href"), text: a.textContent }))
      .filter((l) => l.href !== "/water/gsl");
    // The four scenario-inflow labels link to the four river dashboards.
    expect(links).toContainEqual({ href: "/water/bear-river", text: "Bear River" });
    expect(links).toContainEqual({ href: "/water/sevier-river", text: "Sevier River" });
    expect(links).toContainEqual({ href: "/water/jordan-river", text: "Jordan River" });
    expect(links).toContainEqual({ href: "/water/weber-river", text: "Weber River" });
    // The linked label still labels its slider.
    expect(screen.getByLabelText("Bear River")).toBeTruthy();
  });

  it("notes under the inflows card that gauge MAF overstates what reaches the lake", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("last recorded gauge");
    expect(text).toContain("not a true representation");
    // The Bear River example, computed from the river's committed data:
    // 2025 carried 0.58 MAF at Corinne, only 0.03 MAF reached the lake.
    expect(text).toContain("0.58");
    expect(text).toContain("0.03");
    expect(text).toContain("2025");
    // And it links to the Bear River dashboard to see where the water goes.
    const link = Array.from(container.querySelectorAll("a"))
      .map((a) => a.getAttribute("href"))
      .filter((h): h is string => Boolean(h))
      .find((h) => h === "/water/bear-river");
    expect(link).toBe("/water/bear-river");
  });
});

describe("WaterDashboard — How this works + About the data", () => {
  it("renders the How this works section (terminal lake + the model equation)", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("terminal lake");
    expect(text).toContain("Δh = I ÷ A − e");
    // The observed record range and the magic level are stated.
    expect(text).toContain("1847–2026");
    expect(text).toContain("4,200 ft");
  });

  it("renders the Limitations section with the calibrated-residual and fit-quality facts", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("calibrated residual");
    expect(text).toContain("upstream of diversions");
    expect(text).toContain("1957–1962"); // Bear River gauge gap
    expect(text).toContain("RMSE");
    expect(text).toContain("0.18"); // 0.183 ft RMSE → "0.18"
  });

  it("fills the About-the-data Levels and Inflows lines from the source metadata", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    // Levels line: the lake-level gauge station.
    expect(text).toContain("USGS-10010000");
    // Inflows line: the river gauges.
    expect(text).toContain("Bear River (USGS 10126000)");
    expect(text).toContain("Weber River (USGS 10141000)");
  });

  it("shows the real data-as-of date (not NaN) in About the data", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("NaN");
    expect(text).toContain("2026-10-25");
  });
});

describe("WaterDashboard — Data sources + processing", () => {
  it("renders both the data-sources and the processing sections", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("Where the data comes from");
    expect(text).toContain("How the data is processed");
  });

  it("links each gauge to its USGS monitoring-location page", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const hrefs = Array.from(
      container.querySelectorAll("a[href^='https://waterdata.usgs.gov/monitoring-location/']"),
    ).map((a) => a.getAttribute("href"));
    // Lake level + the four river gauges.
    expect(hrefs).toContain("https://waterdata.usgs.gov/monitoring-location/10010000");
    expect(hrefs).toContain("https://waterdata.usgs.gov/monitoring-location/10126000");
    expect(hrefs).toContain("https://waterdata.usgs.gov/monitoring-location/10219000");
    expect(hrefs).toContain("https://waterdata.usgs.gov/monitoring-location/10171000");
    expect(hrefs).toContain("https://waterdata.usgs.gov/monitoring-location/10141000");
  });

  it("links the elevation-area curve to the Utah DWR page and the daily data to the USGS API", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const hrefs = Array.from(container.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href"))
      .filter((h): h is string => Boolean(h));
    expect(hrefs).toContain("https://water.utah.gov/great-salt-lake/");
    expect(hrefs).toContain("https://api.waterdata.usgs.gov/ogcapi/v1/collections/daily/items");
  });

  it("explains each processing step and why it is acceptable", () => {
    const { container } = render(<WaterDashboard lake={lake} />);
    const text = container.textContent ?? "";
    expect(text).toContain("Cubic feet per second → acre-feet");
    expect(text).toContain("Gap-filling");
    expect(text).toContain("PCHIP");
    expect(text).toContain("Calibrated residual evaporation");
    expect(text).toContain("Rounding");
    // The "why acceptable" framing is present for the two most consequential steps.
    expect(text).toContain("no data is added or removed");
    expect(text).toContain("not a change to the observed data");
  });
});
