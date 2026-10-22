import Link from "next/link";
import type { Project } from "@/lib/projects";

const GITHUB_CHIP =
  "rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent";

function TitleLink({ project, href }: { project: Project; href: string }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      prefetch={false}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group/title"
    >
      <span className="underline-offset-4 group-hover/title:text-accent group-hover/title:underline">
        {project.title}
      </span>
      {external && (
        <span aria-hidden className="ml-1 text-muted group-hover/title:text-accent">
          ↗
        </span>
      )}
    </Link>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { slug, blurb, tags = [], href, repo } = project;
  const target = href ?? repo;
  return (
    <article
      id={slug}
      className="flex h-full flex-col gap-2 rounded-lg border border-line bg-card p-5 transition-colors hover:border-accent"
    >
      <h3 className="font-semibold leading-snug">
        {target ? (
          <TitleLink project={project} href={target} />
        ) : (
          project.title
        )}
      </h3>
      <p className="text-sm text-muted">{blurb}</p>
      {(tags.length > 0 || repo) && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {tag}
            </li>
          ))}
          {!target && (
            <li
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
              title="Kept local on purpose"
            >
              local
            </li>
          )}
          {href && repo && repo !== href && (
            <li>
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className={GITHUB_CHIP}
              >
                github ↗
              </a>
            </li>
          )}
        </ul>
      )}
    </article>
  );
}
