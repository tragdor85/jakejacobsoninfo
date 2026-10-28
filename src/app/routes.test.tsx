import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";
import About from "./about/page";
import Career from "./career/page";
import Projects from "./projects/page";
import LocalAI from "./local-ai/page";
import Printer from "./printer/page";
import Keyboards from "./keyboards/page";
import Lab from "./lab/page";
import GSL from "./gsl/page";
import NotFound from "./not-found";

// Banned strings — PLAN.md sanitization rules, checked against the rendered
// HTML of every page.
const BANNED = [
  "ai for humanity",
  "ai-news-scraper",
  "paramount",
  "groove",
  "dancemanager",
  "sonotester",
  "budget",
  "aigroup",
  "health-mcp",
];

function assertClean(html: string, page: string) {
  const lower = html.toLowerCase();
  for (const banned of BANNED) {
    expect(lower, `${page} must not contain "${banned}"`).not.toContain(banned);
  }
}

const htmlOf = (page: React.ReactElement) => {
  const { container } = render(page);
  return container.innerHTML;
};

describe("home", () => {
  it("renders the four doors and the glance rows", () => {
    render(<Home />);
    expect(screen.getByText("pick a rabbit hole")).toBeTruthy();
    expect(screen.getByText("A 27B brain in a 32GB Mac")).toBeTruthy();
    expect(screen.getByText("An Anet A8 with a camera and opinions")).toBeTruthy();
    expect(screen.getByText("One Pi, two jobs")).toBeTruthy();
    expect(screen.getByText("Two 40%s, a split, and a trackball")).toBeTruthy();
    expect(screen.getByText("See what I’ve built").textContent).toBeTruthy();
    expect(screen.getAllByText(/nineteen real projects/i).length).toBeGreaterThan(0);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<Home />), "home");
  });
});

describe("about", () => {
  it("carries the FIZ joke with the 44oz cup detail", () => {
    render(<About />);
    const body = screen.getByText(/Threat Level Midnight/).closest("p")!.textContent!;
    expect(body).toContain("FIZ");
    expect(body).toContain("dirty soda shop");
    expect(body).toContain("44oz insulated cup");
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<About />), "about");
  });
});

describe("career", () => {
  it("tells the real arc: UK2 then MasterControl, fourteen years", () => {
    render(<Career />);
    expect(screen.getByText("2009 – 2012")).toBeTruthy();
    expect(screen.getAllByText(/UK2 Group/).length).toBeGreaterThan(0);
    expect(screen.getByText("2012 – present")).toBeTruthy();
    expect(screen.getAllByText(/MasterControl/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Utah State/).length).toBeGreaterThan(0);
  });

  it("is not a job hunt", () => {
    const { container } = render(<Career />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/not what I’m looking for/);
    const html = container.innerHTML.toLowerCase();
    expect(html).not.toContain("resume");
    expect(html).not.toContain("salary");
    expect(html).not.toContain("compensation");
  });

  it("passes sanitization rules (no Paramount, no Groove)", () => {
    assertClean(htmlOf(<Career />), "career");
  });
});

describe("projects", () => {
  it("renders all nineteen cards grouped by category", () => {
    const { container } = render(<Projects />);
    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(19);
  });

  it("leads the keyboards section to the depth page", () => {
    render(<Projects />);
    expect(screen.getAllByText(/keyboards page →/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/printer page →/).length).toBeGreaterThan(0);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<Projects />), "projects");
  });
});

describe("local-ai", () => {
  it("renders the markdown content", () => {
    render(<LocalAI />);
    expect(screen.getByText("27B on 32GB")).toBeTruthy();
    expect(screen.getAllByText(/binds to loopback/).length).toBeGreaterThan(0);
  });

  it("keeps the Google Sheets how-to generic", () => {
    const { container } = render(<LocalAI />);
    const html = container.innerHTML.toLowerCase();
    expect(html).toContain("google sheets");
    expect(html).not.toContain("83298");
    // no real sheet IDs (23-char strings of the Sheets alphabet)
    expect(html).not.toMatch(/spreadsheets\/d\/[a-z0-9]{23,}/);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<LocalAI />), "local-ai");
  });
});

describe("printer", () => {
  it("renders the printer build", () => {
    render(<Printer />);
    expect(screen.getAllByText(/Anet A8/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/klipperpi\.local/).length).toBeGreaterThan(0);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<Printer />), "printer");
  });
});

describe("lab", () => {
  it("renders the pi and the 5.1.2 theater", () => {
    render(<Lab />);
    expect(screen.getByText("The House")).toBeTruthy();
    // The H1 used to be a copy of the local-ai page's — keep it out of this page.
    expect(screen.queryByText("27B on 32GB")).toBeNull();
    expect(screen.getAllByText(/klipperpi/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("5.1.2").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("7.1.2").length).toBe(0);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<Lab />), "lab");
  });
});

describe("gsl", () => {
  it("renders the Great Salt Lake dashboard page", () => {
    render(<GSL />);
    expect(screen.getByText("Great Salt Lake What-If Dashboard")).toBeTruthy();
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<GSL />), "gsl");
  });
});

describe("keyboards", () => {
  it("renders the input stack: the sandwich, the mat, the pointer story", () => {
    render(<Keyboards />);
    expect(screen.getAllByText(/Vortex/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Moonlander/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/thumb cluster/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cutting mat/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/trackpad/i).length).toBeGreaterThan(0);
  });

  it("passes sanitization rules", () => {
    assertClean(htmlOf(<Keyboards />), "keyboards");
  });
});

describe("not-found", () => {
  it("renders the 404 page", () => {
    render(<NotFound />);
    expect(screen.getByText("This page never got out of the scratch folder.")).toBeTruthy();
  });
});
