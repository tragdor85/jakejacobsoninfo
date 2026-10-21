import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";

describe("SiteFooter", () => {
  it("states the privacy promise", () => {
    render(<SiteFooter />);
    expect(
      screen.getByText(/no analytics|no cookies|no tracking/i),
    ).toBeInTheDocument();
  });

  it("no contact info anywhere in the footer", () => {
    render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");
    const text = footer.textContent ?? "";
    expect(text).not.toMatch(/\w+@\w+\.\w+/); // no email addresses
    expect(footer.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(screen.queryByRole("link", { name: /contact/i })).toBeNull();
  });

  it("links out to the public profiles", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: /github/i }),
    ).toHaveAttribute("href", siteConfig.socials.github);
    expect(
      screen.getByRole("link", { name: /linkedin/i }),
    ).toHaveAttribute("href", siteConfig.socials.linkedin);
  });
});
