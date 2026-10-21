import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function AppShell({
  children,
  current,
}: {
  children: ReactNode;
  current?: string;
}) {
  return (
    <>
      <SiteHeader current={current} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
