export type Category = "agents" | "maker" | "lab";

export interface Project {
  slug: string;
  category: Category;
  title: string;
  blurb: string;
  tags: string[];
  href: string;
}

export const projects: Project[] = [
  // Agents & Local AI -------------------------------------------------------
  {
    slug: "m1max32gaiconfig",
    category: "agents",
    title: "M1 Max 32GB → local AI workbench",
    blurb:
      "A 32GB Mac running a 27B local model and the full agent stack that drives it. The config that makes it all fit.",
    tags: ["local-llm", "mac", "agents"],
    href: "/local-ai",
  },
  {
    slug: "splash",
    category: "agents",
    title: "Splash (M1/M2 fork)",
    blurb:
      "Inco's local inference engine for Apple silicon — running on an M1 Max via a community Metal-kernel fork.",
    tags: ["local-llm", "apple-silicon", "inference"],
    href: "/projects",
  },
  {
    slug: "splash-serve",
    category: "agents",
    title: "Splash Serve",
    blurb:
      "Custom launcher (27B / 35B / bonsai) plus the launchd watchdog that keeps the model server alive.",
    tags: ["local-llm", "watchdog"],
    href: "/projects",
  },
  {
    slug: "pi-imessage",
    category: "agents",
    title: "pi-imessage",
    blurb:
      "An iMessage channel for my pi coding agents — the way most of this site gets built.",
    tags: ["pi", "imessage", "automation"],
    href: "/projects",
  },
  {
    slug: "pi-todo",
    category: "agents",
    title: "pi-todo",
    blurb:
      "A global todo queue the agents work from, driven by iMessage. Tasks get picked up when the local model is free.",
    tags: ["pi", "automation"],
    href: "/projects",
  },
  {
    slug: "pi-tree-manager",
    category: "agents",
    title: "pi-tree-manager",
    blurb: "Keep agent session trees tidy, on purpose.",
    tags: ["pi"],
    href: "/projects",
  },
  {
    slug: "pi-memory-manager",
    category: "agents",
    title: "pi-memory-manager",
    blurb: "Memory management for long-running agent sessions.",
    tags: ["pi", "memory"],
    href: "/projects",
  },
  {
    slug: "mtplx-extensions",
    category: "agents",
    title: "mtplx Extensions",
    blurb: "Extension pack for the mtplx toolkit.",
    tags: ["tooling"],
    href: "/projects",
  },
  {
    slug: "googlesheets",
    category: "agents",
    title: "googlesheets CLI",
    blurb:
      "gog-based Google Suite CLI that my local agents use to read and write sheets — no cloud brain required.",
    tags: ["google-sheets", "cli", "local-ai"],
    href: "/local-ai",
  },
  // Maker & Hardware ----------------------------------------------------------
  {
    slug: "qmk-ploopy",
    category: "maker",
    title: "QMK: Ploopy Nano 2 fork",
    blurb:
      "Community fork of the Ploopy draw-while-you-type keyboard firmware, plus fixes.",
    tags: ["keyboard", "qmk", "hardware"],
    href: "/projects",
  },
  {
    slug: "nano-2-trackball",
    category: "maker",
    title: "Nano 2 Trackball",
    blurb:
      "A trackball mod for the Ploopy Nano 2 — pointer without a mouse.",
    tags: ["keyboard", "hardware", "cad"],
    href: "/projects",
  },
  {
    slug: "anet-a8",
    category: "maker",
    title: "Anet A8, tamed",
    blurb:
      "Klipper on an Anet A8: custom config, Cura profiles, fluidd, and the mods that actually helped.",
    tags: ["3d-printing", "klipper"],
    href: "/printer",
  },
  {
    slug: "openscad-parts",
    category: "maker",
    title: "OpenSCAD Printer Parts",
    blurb: "Parametric parts for the A8, generated instead of searched for.",
    tags: ["3d-printing", "cad"],
    href: "/projects",
  },
  // Home Lab -------------------------------------------------------------------
  {
    slug: "klipperpi",
    category: "lab",
    title: "KlipperPi",
    blurb:
      "One Raspberry Pi, two jobs: the printer server and the home-automation hub — managed by AI over SSH.",
    tags: ["raspberry-pi", "homelab", "ai-over-ssh"],
    href: "/lab",
  },
  {
    slug: "home-assistant",
    category: "lab",
    title: "Home Assistant Stack",
    blurb:
      "HA + Zigbee2MQTT + Mosquitto + InfluxDB + Prometheus, dockerized on the Pi.",
    tags: ["home-automation", "docker"],
    href: "/lab",
  },
  {
    slug: "sonos",
    category: "lab",
    title: "Sonos 5.1.2 Theater",
    blurb:
      "Six Sonos devices, one home theater — the cloud says one player, the local API tells the truth.",
    tags: ["sonos", "home-theater"],
    href: "/lab",
  },
];
