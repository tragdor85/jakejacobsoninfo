export const siteConfig = {
  name: "Jake B. Jacobson",
  domain: "jakejacobson.info",
  url: "https://jakejacobson.info",
  tagline: "Cloud engineer by day. Local AI, printers, and a home lab by night.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Career", href: "/career" },
    { label: "Local AI", href: "/local-ai" },
    { label: "Printer", href: "/printer" },
    { label: "Keyboards & Mice", href: "/keyboards" },
    { label: "Lab", href: "/lab" },
    { label: "Water", href: "/water" },
  ],
  socials: {
    github: "https://github.com/tragdor85",
    linkedin: "https://www.linkedin.com/in/jakebjacobson",
  },
  privacyLine:
    "No analytics, no cookies, no tracking — and no contact form. Say hi on GitHub or LinkedIn instead.",
} as const;
