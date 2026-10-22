import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell current="not-found">
      <section className="flex flex-col items-start py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          This page never got out of the scratch folder.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          The link is dead, or the page was retired, or you followed a redirect that
          ate a character. Either way, the workbench is one hop away.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
        >
          Back home
        </Link>
      </section>
    </AppShell>
  );
}
