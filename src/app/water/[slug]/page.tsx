import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { WaterLakeView } from "@/components/water/water-lake-view";
import { WaterRiverView } from "@/components/water/water-river-view";
import { getWater, waterSlugs } from "@/lib/water";

export function generateStaticParams() {
  return waterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const body = getWater(slug);
  if (!body) return { title: "Water" };
  if (body.kind === "lake") {
    return {
      title: `${body.name} — What-If Water Level`,
      description: `Model ${body.name} water levels under different inflow and evaporation scenarios.`,
    };
  }
  return {
    title: `${body.name} — What-If Flow to the Lake`,
    description: `Model how much of the ${body.name} reaches the Great Salt Lake under different diversion and inflow scenarios.`,
  };
}

export default async function WaterBodyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = getWater(slug);
  if (!body) notFound();
  return (
    <AppShell current="/water">
      {body.kind === "lake" ? <WaterLakeView lake={body} /> : <WaterRiverView river={body} />}
    </AppShell>
  );
}
