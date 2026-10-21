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
    { label: "Lab", href: "/lab" },
  ],
  socials: {
    github: "https://github.com/tragdor85",
    linkedin: "https://www.linkedin.com/in/jakebjacobson",
  },
  privacyLine:
    "No analytics, no cookies, no tracking — and no contact form. Say hi on GitHub or LinkedIn instead.",
} as const;
