import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  it("wraps page content with header nav and the privacy footer", () => {
    render(
      <AppShell current="/lab">
        <p>lab-page-marker</p>
      </AppShell>,
    );
    expect(screen.getByText("lab-page-marker")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(
      screen.getByText(/no analytics, no cookies, no tracking/i),
    ).toBeInTheDocument();
  });
});
