import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, blurb, tags = [], href } = project;
  return (
    <Link href={href} className="group block">
      <article
        id={slug}
        className="flex h-full flex-col gap-2 rounded-lg border border-line bg-card p-5 transition-colors group-hover:border-accent"
      >
        <h3 className="font-semibold leading-snug group-hover:text-accent">
          {title}
        </h3>
        <p className="text-sm text-muted">{blurb}</p>
        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Link>
  );
}
