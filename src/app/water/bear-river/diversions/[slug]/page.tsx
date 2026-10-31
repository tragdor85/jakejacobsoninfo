import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import {
  bearRiverDiversionSlugs,
  getBearRiverDiversion,
  getBearRiverDiversionTitle,
  type BearRiverDiversionSlug,
} from "@/lib/content";

/**
 * Info pages for the Bear River dashboard's four diversions, at
 * /water/bear-river/diversions/<slug>. Each is a self-authored research page
 * (content/water/bear-river/<slug>.md) documenting where the water goes, who
 * holds the rights, how it is monitored, and whether any of it is wasted.
 * Static-exported: the markdown is read from disk at build time.
 */

const isDiversionSlug = (s: string): s is BearRiverDiversionSlug =>
  (bearRiverDiversionSlugs as readonly string[]).includes(s);

/** Per-page metadata (title + description) for the four diversions. */
const META: Record<BearRiverDiversionSlug, { title: string; description: string }> = {
  canals: {
    title: "Bear River: Box Elder Valley Canals",
    description:
      "Where the Bear River's canal irrigation water goes in the Box Elder Valley, who holds the water rights, how it is monitored, and whether any of it is wasted.",
  },
  brmd: {
    title: "Bear River: BRWCD Municipal Water",
    description:
      "The dashboard's 'BRMD' is really the Bear River Water Conservancy District — the valley's municipal water authority. Where its water goes, who controls it, and the waste question.",
  },
  brid: {
    title: "Bear River: Box Elder Irrigation",
    description:
      "The dashboard's 'BRID' is a generic label for the Box Elder Valley's irrigation — a patchwork of canal companies, not one district. What it is and how it is measured.",
  },
  bcid: {
    title: "Bear River: Brigham City Irrigation",
    description:
      "The dashboard's 'BCID' is a generic label for irrigation around Brigham City. What it is, who operates it, and how it is monitored.",
  },
};

export function generateStaticParams() {
  return bearRiverDiversionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isDiversionSlug(slug)) return { title: "Water" };
  return META[slug];
}

export default async function DiversionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isDiversionSlug(slug)) notFound();
  const title = getBearRiverDiversionTitle(slug);
  return (
    <AppShell current="/water">
      <ContentPage title={title} markdown={getBearRiverDiversion(slug)} />
    </AppShell>
  );
}
