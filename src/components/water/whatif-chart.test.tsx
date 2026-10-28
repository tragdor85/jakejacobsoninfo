import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { WhatIfChart } from "./whatif-chart";

describe("WhatIfChart", () => {
  it("renders an svg with the year in the aria-label", () => {
    const { container } = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4197} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("Lake level 2025: actual vs what-if");
  });

  it("labels the axis with the water-year start and end years", () => {
    const { container } = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4197} />);
    expect(container.textContent).toContain("Oct 1 2025");
    expect(container.textContent).toContain("Sep 30 2026");
  });

  it("colors the actual legend label to match the actual line", () => {
    const { container } = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4197} />);
    const actualLabel = Array.from(container.querySelectorAll("text")).find(
      (t) => (t.textContent ?? "").includes("actual"),
    );
    expect(actualLabel?.getAttribute("fill")).toBe("var(--chart-obs)");
  });

  it("renders three gridlines, the actual line, the what-if line, and an endpoint dot", () => {
    const { container } = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4197} />);
    expect(container.querySelectorAll("line").length).toBe(5);
    expect(container.querySelectorAll("circle").length).toBe(1);
  });

  it("colors a rising what-if with the accent and a falling one with muted", () => {
    const rising = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4198} />);
    const risingLine = Array.from(rising.container.querySelectorAll("line")).find(
      (l) => l.getAttribute("stroke-width") === "2.5",
    );
    expect(risingLine?.getAttribute("stroke")).toBe("var(--chart-whatif)");

    const falling = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4194} />);
    const fallingLine = Array.from(falling.container.querySelectorAll("line")).find(
      (l) => l.getAttribute("stroke-width") === "2.5",
    );
    expect(fallingLine?.getAttribute("stroke")).toBe("var(--chart-bau)");
  });

  it("scales the y domain to include start, actual, and what-if values", () => {
    const { container } = render(<WhatIfChart year={2025} startFt={4195} actualEndFt={4196} whatIfEndFt={4192} />);
    const labels = Array.from(container.querySelectorAll("text"))
      .map((t) => t.textContent)
      .filter((t) => t?.endsWith(" ft"))
      .map((t) => parseFloat(t!.replace(" ft", "")));
    // Domain is [min-0.5, max+0.5] = [4191.5, 4196.5]; the three gridline
    // labels are lo, mid, hi.
    expect(Math.min(...labels)).toBeCloseTo(4191.5, 1);
    expect(Math.max(...labels)).toBeCloseTo(4196.5, 1);
  });
});
