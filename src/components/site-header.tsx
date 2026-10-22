import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline gap-x-8 gap-y-2 px-6 py-5">
        <Link
          href="/"
          prefetch={false}
          className="font-mono text-sm text-fg hover:text-accent"
          aria-current={current === "/" ? "page" : undefined}
        >
          {siteConfig.domain}
        </Link>
        <nav
          aria-label="Main"
          className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm"
        >
          {siteConfig.nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={current === item.href ? "page" : undefined}
              className={
                current === item.href
                  ? "text-accent"
                  : "text-muted hover:text-fg"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
