/**
 * Accessibility audit (PLAN §5: Lighthouse ≥95 on a11y).
 *
 * Runs axe-core in jsdom against every route. `color-contrast` needs a real
 * layout engine and can only be *incomplete* here, so it is disabled — the
 * same pages are checked with Lighthouse in a real browser at deploy time.
 */
import axe from "axe-core";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import About from "./about/page";
import Career from "./career/page";
import Home from "./page";
import Lab from "./lab/page";
import LocalAI from "./local-ai/page";
import NotFound from "./not-found";
import Printer from "./printer/page";
import Projects from "./projects/page";

const pages: Record<string, () => ReactElement> = {
  home: () => <Home />,
  about: () => <About />,
  career: () => <Career />,
  projects: () => <Projects />,
  "local-ai": () => <LocalAI />,
  printer: () => <Printer />,
  lab: () => <Lab />,
  "404": () => <NotFound />,
};

async function runAxe(page: () => ReactElement) {
  const view = render(page());
  const results = await axe.run(view.container, {
    rules: {
      "color-contrast": { enabled: false },
    },
  });
  view.unmount();
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.html.slice(0, 120)),
  }));
}

describe("accessibility (PLAN §5)", () => {
  it.each(Object.keys(pages))("%s: no axe violations", async (name) => {
    const violations = await runAxe(pages[name]);
    expect(violations).toEqual([]);
  }, 30_000);
});
