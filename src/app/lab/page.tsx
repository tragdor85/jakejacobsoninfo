import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import { getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "The House",
  description:
    "One Raspberry Pi doing two jobs — 3D-printer server and home-automation hub — plus the 5.1.2 Sonos theater it lives next to.",
};

export default function Lab() {
  const title = getContentTitle("lab");
  return (
    <AppShell current="/lab">
      <ContentPage title={title} markdown={getContent("lab")} />
    </AppShell>
  );
}
