import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import { getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Keyboards & Mice",
  description:
    "Two Vortex 40%s, a QMK-modded Moonlander, an Apple trackpad, and a Ploopy under the thumb — the full input stack, including the sandwich layout.",
};

export default function Keyboards() {
  const title = getContentTitle("keyboards");
  return (
    <AppShell current="/keyboards">
      <ContentPage title={title} markdown={getContent("keyboards")} />
    </AppShell>
  );
}
