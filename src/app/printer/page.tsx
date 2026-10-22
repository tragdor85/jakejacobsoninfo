import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import { getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "3D Printer",
  description:
    "An Anet A8, modded to a point: Klipper on the Pi, a Cura profile recovered from old G-code, and a local model that judges my prints.",
};

export default function Printer() {
  const title = getContentTitle("printer");
  return (
    <AppShell current="/printer">
      <ContentPage title={title} markdown={getContent("printer")} />
    </AppShell>
  );
}
