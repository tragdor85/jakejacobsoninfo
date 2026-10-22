import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./project-card";
import type { Project } from "@/lib/projects";

const pageProject: Project = {
  slug: "m1max32gaiconfig",
  category: "agents",
  title: "M1 Max 32GB → local AI workbench",
  blurb: "The workbench.",
  tags: ["local-llm"],
  href: "/local-ai",
  repo: "https://github.com/tragdor85/m1max32gaiconfig",
};

const repoProject: Project = {
  slug: "pi-imessage",
  category: "agents",
  title: "pi-imessage",
  blurb: "iMessage channel for pi.",
  tags: ["pi"],
  href: "https://github.com/tragdor85/pi-imessage",
};

const localProject: Project = {
  slug: "pi-tree-manager",
  category: "agents",
  title: "pi-tree-manager",
  blurb: "Keeps trees tidy.",
  tags: ["pi"],
};

describe("ProjectCard", () => {
  it("links the title to the depth page and offers a GitHub chip", () => {
    render(<ProjectCard project={pageProject} />);
    const title = screen.getByRole("link", { name: /M1 Max 32GB/ });
    expect(title.getAttribute("href")).toBe("/local-ai");
    expect(title.getAttribute("target")).toBeNull();
    const chip = screen.getByRole("link", { name: /github/ });
    expect(chip.getAttribute("href")).toBe("https://github.com/tragdor85/m1max32gaiconfig");
    expect(chip.getAttribute("target")).toBe("_blank");
    expect(chip.getAttribute("rel")).toContain("noopener");
  });

  it("links the title to GitHub in a new tab for repo-only projects", () => {
    render(<ProjectCard project={repoProject} />);
    const title = screen.getByRole("link", { name: /pi-imessage/ });
    expect(title.getAttribute("href")).toBe("https://github.com/tragdor85/pi-imessage");
    expect(title.getAttribute("target")).toBe("_blank");
    // the title already goes to the repo — no duplicate chip
    expect(screen.queryByRole("link", { name: /github/ })).toBeNull();
  });

  it("renders local-only projects without any links", () => {
    render(<ProjectCard project={localProject} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText("local")).toBeInTheDocument();
  });
});
