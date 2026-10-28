import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { WaterLakeView } from "@/components/water/water-lake-view";
import { getLake, lakeSlugs } from "@/lib/water";

export function generateStaticParams() {
  return lakeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lake = getLake(slug);
  if (!lake) return { title: "Water" };
  return {
    title: `${lake.name} — What-If Water Level`,
    description: `Model ${lake.name} water levels under different inflow and evaporation scenarios.`,
  };
}

export default async function WaterLakePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lake = getLake(slug);
  if (!lake) notFound();
  return (
    <AppShell current="/water">
      <WaterLakeView lake={lake} />
    </AppShell>
  );
}
