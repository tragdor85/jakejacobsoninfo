import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LevelChart } from "./level-chart";

// Small synthetic series shaped like the GSL record (keeps the tests fast;
// the data itself is covered by the lib tests).
const observed: [number, number][] = [
  [1847, 4199.8],
  [1900, 4205],
  [1986, 4211.6],
  [2022, 4188.5],
  [2026, 4195],
];

describe("LevelChart", () => {
  it("renders an svg with role=img and the given aria-label", () => {
    const { container } = render(<LevelChart observed={observed} ariaLabel="test chart" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("test chart");
  });

  it("renders one polyline per series passed", () => {
    const { container } = render(
      <LevelChart
        observed={observed}
        whatIf={[
          [2025, 4195],
          [2026, 4197],
        ]}
        projected={[
          [2025, 4195],
          [2026, 4197],
          [2027, 4198],
        ]}
        bau={[
          [2025, 4195],
          [2026, 4196],
        ]}
        ariaLabel="all series"
      />,
    );
    expect(container.querySelectorAll("polyline").length).toBe(4);
  });

  it("omits polylines for series not passed", () => {
    const { container } = render(<LevelChart observed={observed} ariaLabel="obs only" />);
    expect(container.querySelectorAll("polyline").length).toBe(1);
  });

  it("renders the magic-level line and label when given", () => {
    const { container } = render(
      <LevelChart observed={observed} magicLevel={4200} magicLabel="4,200 ft — historic average" ariaLabel="magic" />,
    );
    expect(container.textContent).toContain("4,200 ft — historic average");
  });

  it("renders the low marker dot and label", () => {
    const { container } = render(
      <LevelChart
        observed={observed}
        lowMarker={{ year: 2022.85, ft: 4188.5, label: "2022 low 4188.5 ft" }}
        ariaLabel="low"
      />,
    );
    expect(container.textContent).toContain("2022 low 4188.5 ft");
    expect(container.querySelectorAll("circle").length).toBe(1);
  });

  it("extends the y domain to include the magic level and low marker", () => {
    // Observed spans 4205–4212 only; the 4185 ft marker is well below that,
    // so without the domain extension it would plot outside the chart.
    const { container } = render(
      <LevelChart
        observed={[
          [1980, 4205],
          [1981, 4212],
        ]}
        magicLevel={4200}
        lowMarker={{ year: 2022.85, ft: 4185, label: "low" }}
        ariaLabel="domain"
      />,
    );
    const svg = container.querySelector("svg")!;
    const [, , vbW, vbH] = svg.getAttribute("viewBox")!.split(" ").map(Number);
    const inView = (el: Element, attr: string) => {
      const v = Number(el.getAttribute(attr));
      const limit = attr === "cx" || attr === "x1" || attr === "x2" ? vbW : vbH;
      return v >= 0 && v <= limit;
    };
    const circle = container.querySelector("circle")!;
    expect(circle).not.toBeNull();
    expect(inView(circle, "cx")).toBe(true);
    expect(inView(circle, "cy")).toBe(true);
    // The magic line is the horizontal dashed magic-color line (the low
    // marker's guide is vertical).
    const magicLine = Array.from(container.querySelectorAll("line")).find(
      (l) =>
        l.getAttribute("stroke") === "var(--chart-magic)" &&
        l.getAttribute("stroke-dasharray") === "2 4" &&
        l.getAttribute("y1") === l.getAttribute("y2"),
    );
    expect(magicLine).not.toBeNull();
    expect(inView(magicLine!, "y1")).toBe(true);
  });

  it("renders a legend item per series actually drawn", () => {
    const { container } = render(
      <LevelChart
        observed={observed}
        whatIf={[
          [2025, 4195],
          [2026, 4197],
        ]}
        bau={[
          [2025, 4195],
          [2026, 4196],
        ]}
        ariaLabel="legend"
      />,
    );
    expect(container.textContent).toContain("Observed");
    expect(container.textContent).toContain("What-if");
    expect(container.textContent).toContain("BAU (mean inflow)");
    expect(container.textContent).not.toContain("Projected");
  });

  it("renders an empty svg when there is no data", () => {
    const { container } = render(<LevelChart observed={[]} ariaLabel="empty" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelectorAll("polyline").length).toBe(0);
  });
});
