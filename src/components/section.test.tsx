import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

describe("Section", () => {
  it("renders a mono kicker and a heading above children", () => {
    render(
      <Section kicker="maker" title="On the bench">
        <p>body copy</p>
      </Section>,
    );
    expect(screen.getByText("maker")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "On the bench" })).toBeInTheDocument();
    expect(screen.getByText("body copy")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  const base = {
    slug: "klipperpi",
    category: "lab",
    title: "KlipperPi",
    blurb: "One Pi, two jobs.",
    tags: ["raspberry-pi", "3d-printing"],
    href: "/lab",
  } satisfies Project;

  it("renders title, blurb, tags and its link", () => {
    render(<ProjectCard project={base} />);
    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("id", "klipperpi");
    expect(screen.getByRole("heading", { name: "KlipperPi" })).toBeInTheDocument();
    expect(screen.getByText("One Pi, two jobs.")).toBeInTheDocument();
    expect(screen.getByText("raspberry-pi")).toBeInTheDocument();
    expect(screen.getByText("3d-printing")).toBeInTheDocument();
  });

  it("links to its detail page and omits tags when there are none", () => {
    render(<ProjectCard project={{ ...base, tags: [] }} />);
    const link = screen.getByRole("link", { name: /KlipperPi/ });
    expect(link).toHaveAttribute("href", "/lab");
    expect(screen.queryByText("raspberry-pi")).toBeNull();
  });
});
