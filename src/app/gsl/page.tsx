import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import { getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Great Salt Lake What-If Dashboard",
  description:
    "Model Great Salt Lake water levels under different inflow and evaporation scenarios — adjust the start year, projection horizon, and what-if conditions.",
};

// The dashboard is a standalone static app in the utahwater repo, hosted on
// Cloudflare Pages (gsl-dashboard project); embedded via iframe.
const DASHBOARD_URL = "https://gsl-dashboard.pages.dev";

export default function GSL() {
  const title = getContentTitle("gsl");
  return (
    <AppShell current="/gsl">
      <ContentPage title={title} markdown={getContent("gsl")} />
      <div className="mt-8">
        <iframe
          src={DASHBOARD_URL}
          width="100%"
          height={800}
          frameBorder="0"
          allowFullScreen
          className="border border-line rounded-lg"
        />
      </div>
    </AppShell>
  );
}
