import Link from "next/link";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { getWater, waterSlugs } from "@/lib/water";

export const metadata: Metadata = {
  title: "Water",
  description:
    "What-if water dashboards: model lake levels and river flows under different inflow and diversion scenarios, built from public USGS data and running entirely in your browser.",
};

export default function WaterIndex() {
  const slugs = waterSlugs();
  return (
    <AppShell current="/water">
      <div className="mx-auto max-w-3xl py-10 sm:py-14">
        <Section kicker="water" title="What-if water dashboards">
        <p className="max-w-2xl text-muted">
          Interactive models of real water bodies. Each one is built from public
          USGS data, runs entirely in your browser, and answers a simple question:
          what happens to the water if the inflows or diversions change?
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {slugs.map((slug) => {
            const body = getWater(slug);
            if (!body) return null;
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
                <h3 className="mt-2 font-semibold group-hover:text-accent">{body.name}</h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {body.location} · {body.yearRange[0]}–{body.yearRange[1]}
                </p>
                <p className="mt-2 text-sm text-muted">{body.description}</p>
              </Link>
            );
          })}
        </div>
        </Section>
      </div>
    </AppShell>
  );
}
