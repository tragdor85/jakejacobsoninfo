import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "Career",
  description:
    "Fourteen years at one company: cloud infrastructure, delivery pipelines, on-call machinery. Not a resume, not a job hunt.",
};

const timeline = [
  {
    years: "2009 – 2012",
    place: "UK2 Group — technical support supervisor",
    note: "Shared web hosting, tier 1/2, Logan UT. Where I learned the one rule this whole career runs on: if you do it twice, automate it.",
  },
  {
    years: "2012 – present",
    place: "MasterControl — software engineer → senior (L3)",
    note: "Fourteen years, one company. Document & records SaaS in a regulated space (FDA, GxP). Long enough at one place to see systems fail, get rebuilt, and fail differently.",
  },
  {
    years: "~2012",
    place: "Utah State University — BS, Management Information Systems",
    note: "The degree that was supposed to be a shortcut into management. It was, actually — a shortcut into understanding why the machines are where they are.",
  },
];

const scope = [
  {
    title: "The delivery pipeline",
    text: "The end-to-end pipeline that ships the product: Jenkins and Groovy at scale, running against multi-account, multi-region AWS. When it's boring, I'm doing it right.",
  },
  {
    title: "Onboarding automation",
    text: "New environments used to take 8–12 hours of careful hand-holding. Now it's under an hour, and it doesn't need me. That delta is the job, really.",
  },
  {
    title: "The on-call machinery",
    text: "Alerting, runbooks, and the dashboards that answer 'is it the network or the app' before 7 a.m. Regulated-industry discipline: everything reproducible, everything documented, nothing 'it worked on my machine'.",
  },
];

const deepIn = [
  "AWS multi-account + CloudFormation",
  "Terraform",
  "Jenkins / Groovy at scale",
  "Windows automation (pywinrm)",
  "Kubernetes",
  "Postgres",
  "on-call runbooks",
  "local LLM tooling — the part with its own page",
];

export default function Career() {
  return (
    <AppShell current="/career">
      <Section kicker="career" title="Fourteen years, one through-line">
        <p className="text-lg text-fg">
          The professional part. I’m a senior software engineer. The last fourteen
          years have been one company; the three before that were technical support.
          Nothing exotic — and I’d argue that’s exactly why the last decade was
          good: same place, same machines, every failure mode visible from both
          sides.
        </p>
        <div className="mt-6">
          {timeline.map((entry) => (
            <div
              key={entry.years}
              className="grid gap-1 border-b border-line py-4 last:border-0 sm:grid-cols-[8rem_1fr] sm:gap-4"
            >
              <span className="font-mono text-xs text-muted">{entry.years}</span>
              <span>
                <span className="font-semibold">{entry.place}</span>
                <span className="block text-sm text-muted">{entry.note}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="now" title="What I actually do">
        <div className="grid gap-4 sm:grid-cols-3">
          {scope.map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-card p-5">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="lately" title="Deep in">
        <ul className="flex flex-wrap gap-2">
          {deepIn.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-xs"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="not here" title="What this page is not">
        <p className="text-muted">
          This page describes what I do, not what I’m looking for. No open roles,
          no comp talk, no résumé, no “excited to connect” energy. If you’ve worked
          with me and something above needs a name changed before it’s public,
          message me on GitHub — it’s in the footer.
        </p>
      </Section>
    </AppShell>
  );
}
