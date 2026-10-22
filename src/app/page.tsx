import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";

const doors = [
  {
    href: "/local-ai",
    label: "local-ai",
    title: "A 27B brain in a 32GB Mac",
    blurb:
      "No cloud inference. A Metal-kernel engine, three local models, and the agent stack that drives all of it — plus a local model that manages Google Sheets.",
  },
  {
    href: "/printer",
    label: "printer",
    title: "An Anet A8 with a camera and opinions",
    blurb:
      "Klipper on the Pi, a Cura profile recovered from old G-code, and a local model that judges my first layers before I walk into the room.",
  },
  {
    href: "/lab",
    label: "lab",
    title: "One Pi, two jobs",
    blurb:
      "The klipperpi is both the 3D-printer server and the home-automation hub — administered over SSH by agents I drive from my phone.",
  },
];

const glance = [
  {
    href: "/career",
    label: "career",
    title: "The day job",
    text: "Fourteen years at one company: cloud infrastructure, delivery pipelines, and the on-call machinery that keeps them running.",
  },
  {
    href: "/projects",
    label: "projects",
    title: "Everything else",
    text: "Sixteen real projects — nine AI agents, four maker builds, three lab machines, and a local Google Sheets CLI.",
  },
  {
    href: "/about",
    label: "about",
    title: "The human",
    text: "Works in Salt Lake City, home in the valley with a house full of kids, and does most of this from a 32GB Mac with the lid closed.",
  },
];

function DoorCard({ href, label, title, blurb }: (typeof doors)[number]) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-line bg-card p-5 transition-colors hover:border-accent"
    >
      <p className="font-mono text-xs text-muted group-hover:text-accent">
        {label} ↗
      </p>
      <h3 className="mt-2 font-semibold group-hover:text-accent">{title}</h3>
      <p className="mt-2 text-sm text-muted">{blurb}</p>
    </Link>
  );
}

function GlanceRow({ href, label, title, text }: (typeof glance)[number]) {
  return (
    <Link href={href} className="group flex gap-4 border-b border-line py-4 last:border-0">
      <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-wider text-muted group-hover:text-accent">
        {label}
      </span>
      <span>
        <span className="font-semibold group-hover:text-accent">{title}</span>
        <span className="text-muted"> — {text}</span>
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <AppShell current="/">
      <section className="py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          the workbench
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Cloud engineer by day. Local AI, printers, and a home lab by night.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          I’m Jake — a senior software engineer who automates infrastructure for a
          living, and spends whatever computing headroom is left on experiments that
          will never make a résumé. This site is where those experiments live.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
          >
            See what I’ve built
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-line px-5 py-2.5 text-sm hover:border-accent"
          >
            Who is this guy
          </Link>
        </div>
      </section>

      <Section kicker="pick a rabbit hole" title="Three doors">
        <div className="grid gap-4 sm:grid-cols-3">
          {doors.map((door) => (
            <DoorCard key={door.href} {...door} />
          ))}
        </div>
      </Section>

      <Section kicker="at a glance" title="The rest of it">
        <div>
          {glance.map((row) => (
            <GlanceRow key={row.href} {...row} />
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
