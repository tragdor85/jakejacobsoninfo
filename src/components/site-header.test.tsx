import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

describe("SiteHeader", () => {
  it("shows the domain in the wordmark", () => {
    render(<SiteHeader />);
    expect(screen.getByText(siteConfig.domain)).toBeInTheDocument();
  });

  it("renders every nav link (the wordmark is Home)", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: siteConfig.domain })).toHaveAttribute(
      "href",
      "/",
    );
    for (const item of siteConfig.nav.slice(1)) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("marks the current page in nav", () => {
    render(<SiteHeader current="/about" />);
    const about = screen.getByRole("link", { name: "About" });
    expect(about).toHaveAttribute("aria-current", "page");
    const home = screen.getByRole("link", { name: siteConfig.domain });
    expect(home).not.toHaveAttribute("aria-current");
  });
});
