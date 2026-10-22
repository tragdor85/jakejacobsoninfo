import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who's behind the workbench: senior software engineer in Salt Lake City, local-first tinkerer, dad of four. Runs on Dr Pepper and dirty soda.",
};

export default function About() {
  return (
    <AppShell current="/about">
      <Section kicker="about" title="The short version">
        <p className="text-lg text-fg">
          I’m Jake. I work in Salt Lake City, live up in the valley with a house full
          of kids, and do most of this from a 32GB M1 Max with the lid closed —
          driven from my phone.
        </p>
        <p className="text-muted">
          By day I’m a senior software engineer: cloud infrastructure, delivery
          pipelines, the kind of work where the best compliment is that nobody
          notices it. By night I’m in the workbench — local AI, 3D printing, home
          automation, and the occasional keyboard. The line between “hobby” and
          “job” stopped being useful about five years ago, so this site just
          assumes it.
        </p>
        <p className="text-muted">
          No coffee. It’s Dr Pepper — or, lately, a <strong className="text-fg">“Threat
          Level Midnight”</strong> from FIZ, the dirty soda shop: a The Office
          running joke that somehow became a real menu item. Arrives in a 44oz
          insulated cup, which has at this point become a load-bearing part of the
          setup.
        </p>
        <p className="text-muted">
          The rest of the evening résumé, briefly: music (I own the complete Taylor
          Swift catalog), running, drones, and the home theater — the theater has a{" "}
          <Link href="/lab#the-sonos-theater" className="text-accent underline underline-offset-2">
            lab page
          </Link>{" "}
          of its own.
        </p>
        <p className="text-muted">
          How I actually work: <strong className="text-fg">local-first</strong>. If a
          capability can run on the machine in front of me, it should. The cloud
          earns its keep in exactly one app (the{" "}
          <Link href="/local-ai#letting-it-manage-google-sheets" className="text-accent underline underline-offset-2">
            Google Sheets
          </Link>{" "}
          section), and even there the <em>thinking</em> stays local. Agents do the
          clicking; I do the reviewing. Anything important gets verified in logs, not
          vibes.
        </p>
        <p className="text-muted">
          This site is the night-shift part of my work, documented the way I like to
          document things: what I actually built, what it cost, and what broke.
        </p>
      </Section>
      <Section kicker="meta" title="How this site is made">
        <p className="text-muted">
          Next.js static export, deployed to Cloudflare Pages. No analytics, no
          cookies, no contact form — if we need to talk, the footer has my GitHub
          and LinkedIn. The source is public:{" "}
          <Link
            href="https://github.com/tragdor85/jakejacobsoninfo"
            className="text-accent underline underline-offset-2"
          >
            github.com/tragdor85/jakejacobsoninfo
          </Link>
          .
        </p>
      </Section>
    </AppShell>
  );
}
