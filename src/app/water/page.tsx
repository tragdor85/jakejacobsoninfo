import Link from "next/link";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { getLake, lakeSlugs } from "@/lib/water";

export const metadata: Metadata = {
  title: "Water",
  description:
    "What-if water dashboards: model lake levels under different inflow and evaporation scenarios, built from public USGS data and running entirely in your browser.",
};

export default function WaterIndex() {
  const slugs = lakeSlugs();
  return (
    <AppShell current="/water">
      <div className="mx-auto max-w-3xl py-10 sm:py-14">
        <Section kicker="water" title="What-if water dashboards">
        <p className="max-w-2xl text-muted">
          Interactive models of real water bodies. Each one is built from public
          USGS data, runs entirely in your browser, and answers a simple question:
          what happens to the water if the inflows change?
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {slugs.map((slug) => {
            const lake = getLake(slug);
            if (!lake) return null;
            return (
              <Link
                key={slug}
                href={`/water/${slug}`}
                prefetch={false}
                className="group rounded-lg border border-line bg-card p-5 transition-colors hover:border-accent"
              >
                <p className="font-mono text-xs text-muted group-hover:text-accent">
                  {slug} ↗
                </p>
                <h3 className="mt-2 font-semibold group-hover:text-accent">{lake.name}</h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {lake.location} · {lake.yearRange[0]}–{lake.yearRange[1]}
                </p>
                <p className="mt-2 text-sm text-muted">{lake.description}</p>
              </Link>
            );
          })}
        </div>
        </Section>
      </div>
    </AppShell>
  );
}
