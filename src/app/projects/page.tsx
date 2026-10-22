import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import type { Category } from "@/lib/projects";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Nineteen real projects: local AI agents, maker builds, the input stack, and the home lab. No vaporware, no 'coming soon'.",
};

const groups: { category: Category; label: string; blurb: string; pageHref?: string; pageLabel?: string }[] = [
  {
    category: "agents",
    label: "AI agents & local inference",
    blurb:
      "The stack that lets a 32GB Mac do the thinking: one model server, three models, a terminal agent, and the bridges that let a phone drive it all.",
  },
  {
    category: "maker",
    label: "Maker & hardware",
    blurb:
      "Things with motors and no cloud dependency.",
    pageHref: "/printer",
    pageLabel: "printer",
  },
  {
    category: "keyboards",
    label: "Keyboards & Mice",
    blurb:
      "The input stack: two 40%s, a split, a trackpad, and a single-button trackball — laid out so the Ploopy sits under the thumb.",
    pageHref: "/keyboards",
    pageLabel: "keyboards",
  },
  {
    category: "lab",
    label: "Home lab",
    blurb:
      "One Raspberry Pi doing two jobs, and the theater it lives next to.",
  },
];

export default function Projects() {
  return (
    <AppShell current="/projects">
      <Section kicker="projects" title="The whole bench">
        <p className="text-muted">
          Everything here is real and has run for at least a few months — no
          vaporware, no “coming soon.” Some projects have a page with the actual
          details; the rest link to their source or home.
        </p>
      </Section>

      {groups.map((group) => (
        <Section key={group.category} kicker={group.category} title={group.label}>
          <p className="text-muted">
            {group.blurb}
            {group.pageHref && group.pageLabel && (
              <> The full story is on the{" "}
                <Link
                  href={group.pageHref}
                  prefetch={false}
                  className="text-accent underline underline-offset-2"
                >
                  {group.pageLabel} page →
                </Link>
                .
              </>
            )}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projects
              .filter((project) => project.category === group.category)
              .map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
        </Section>
      ))}

      <Section kicker="missing?" title="Not every project makes the cut">
        <p className="text-muted">
          There’s a long tail of experiments that never left the scratch folder,
          and a few that stay local on purpose — private data stays private, always.
          If a project looks like it should be here but isn’t, that’s either a
          curation choice or a privacy one. The footer has the handles.{" "}
          <Link href="/" prefetch={false} className="text-accent underline underline-offset-2">
            Back to the top
          </Link>
        </p>
      </Section>
    </AppShell>
  );
}
