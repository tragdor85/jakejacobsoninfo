import type { ReactNode } from "react";

export function Section({
  kicker,
  title,
  children,
  id,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="py-10 first:pt-14 last:pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {kicker}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}
