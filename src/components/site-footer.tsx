import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-muted">
        <p>{siteConfig.privacyLine}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={`${siteConfig.socials.github}/jakejacobsoninfo`}
            className="hover:text-accent"
          >
            github.com/tragdor85/jakejacobsoninfo
          </Link>
          <Link href={siteConfig.socials.linkedin} className="hover:text-accent">
            linkedin.com/in/jakebjacobson
          </Link>
          <span className="ml-auto font-mono text-xs">
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>
        <p className="font-mono text-xs text-muted/70">
          static site · next.js · cloudflare pages
        </p>
      </div>
    </footer>
  );
}
