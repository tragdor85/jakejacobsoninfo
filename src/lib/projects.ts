export type Category = "agents" | "maker" | "lab";

export interface Project {
  slug: string;
  category: Category;
  title: string;
  blurb: string;
  tags: string[];
  /**
   * Where the card's title links to: a site depth page, or the project's
   * GitHub repo when there is no page. Omitted for projects that stay
   * local on purpose — those cards have no link.
   */
  href?: string;
  /** Secondary GitHub link (the "github ↗" chip) when the card's title
   *  links to a page instead. */
  repo?: string;
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
    repo: "https://github.com/tragdor85/m1max32gaiconfig",
  },
  {
    slug: "splash",
    category: "agents",
    title: "Splash (M1/M2 fork)",
    blurb:
      "Inco's local inference engine for Apple silicon — running on an M1 Max via a community Metal-kernel fork.",
    tags: ["local-llm", "apple-silicon", "inference"],
    href: "https://github.com/paperniuk/splash",
  },
  {
    slug: "splash-serve",
    category: "agents",
    title: "Splash Serve",
    blurb:
      "Custom launcher (27B / 35B / bonsai) plus the launchd watchdog that keeps the model server alive.",
    tags: ["local-llm", "watchdog"],
    href: "https://github.com/tragdor85/splash-serve",
  },
  {
    slug: "pi-imessage",
    category: "agents",
    title: "pi-imessage",
    blurb:
      "An iMessage channel for my pi coding agents — the way most of this site gets built.",
    tags: ["pi", "imessage", "automation"],
    href: "https://github.com/tragdor85/pi-imessage",
  },
  {
    slug: "pi-todo",
    category: "agents",
    title: "pi-todo",
    blurb:
      "A global todo queue the agents work from, driven by iMessage. Tasks get picked up when the local model is free.",
    tags: ["pi", "automation"],
    href: "https://github.com/tragdor85/pi-todo",
  },
  {
    slug: "pi-tree-manager",
    category: "agents",
    title: "pi-tree-manager",
    blurb: "Keep agent session trees tidy, on purpose.",
    tags: ["pi"],
  },
  {
    slug: "pi-memory-manager",
    category: "agents",
    title: "pi-memory-manager",
    blurb: "Memory management for long-running agent sessions.",
    tags: ["pi", "memory"],
  },
  {
    slug: "mtplx-extensions",
    category: "agents",
    title: "mtplx Extensions",
    blurb: "Extension pack for the mtplx toolkit.",
    tags: ["tooling"],
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
      "QMK, trimmed to build the Ploopy Nano 2: keyboard firmware running a trackball, plus the fixes.",
    tags: ["trackball", "qmk", "hardware"],
    href: "https://github.com/tragdor85/qmk_ploopy_nano_2",
  },
  {
    slug: "nano-2-trackball",
    category: "maker",
    title: "Ploopy Nano 2 Trackball",
    blurb:
      "The Ploopy Nano 2, end to end: a minimalist, single-button, 3D-printable trackball that runs QMK — pointer, not keyboard.",
    tags: ["trackball", "qmk", "hardware"],
    href: "https://github.com/ploopyco/nano-2-trackball",
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
