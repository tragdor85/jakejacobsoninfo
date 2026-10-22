import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ContentPage } from "@/components/content-page";
import { getContent, getContentTitle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Local AI",
  description:
    "Running a 27B local model on a 32GB M1 Max: the inference engine, three models, the agent stack, and a local model that manages Google Sheets.",
};

export default function LocalAI() {
  const title = getContentTitle("local-ai");
  return (
    <AppShell current="/local-ai">
      <ContentPage title={title} markdown={getContent("local-ai")} />
    </AppShell>
  );
}
