import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentPage } from "./content-page";

describe("ContentPage", () => {
  it("renders the title as the page h1", () => {
    const { getByRole } = render(
      <ContentPage title="Home Lab" markdown="Body.\n" />,
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Home Lab");
  });

  it("gives headings stable slug ids so deep links resolve", () => {
    const { container } = render(
      <ContentPage
        title="Home Lab"
        markdown={"## One box, two jobs\n\nBody.\n\n## The Sonos theater\n\nBody.\n"}
      />,
    );
    const h2s = [...container.querySelectorAll("h2")];
    expect(h2s.map((h) => h.getAttribute("id"))).toEqual([
      "one-box-two-jobs",
      "the-sonos-theater",
    ]);
  });

  it("slugifies punctuation and casing", () => {
    const { container } = render(
      <ContentPage
        title="T"
        markdown={"## Letting it manage Google Sheets\n\nBody.\n"}
      />,
    );
    expect(container.querySelector("h2")?.getAttribute("id")).toBe(
      "letting-it-manage-google-sheets",
    );
  });
});
