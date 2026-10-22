import { Marked, type RendererObject, type Tokens } from "marked";

// marked ≥5 doesn't emit heading ids by default, so deep links like
// `/local-ai#letting-it-manage-google-sheets` need this explicit renderer.
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const headingRenderer: RendererObject = {
  heading({ tokens, depth, text }: Tokens.Heading): string {
    const body = this.parser?.parseInline(tokens) ?? text;
    return `<h${depth} id="${slugify(text)}">${body}</h${depth}>\n`;
  },
};

const md = new Marked({ gfm: true, breaks: true });
md.use({ renderer: headingRenderer });

export interface ContentPageProps {
  /** Rendered as the page h1 (content markdown is stripped of its H1). */
  title: string;
  /** Markdown without the leading H1. Trusted, self-authored input (PLAN §4). */
  markdown: string;
}

/**
 * Renders a depth-page body inside the shared AppShell — the shell supplies
 * header/footer, so this is content only (h1 + prose).
 */
export function ContentPage({ title, markdown }: ContentPageProps) {
  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        {title}
      </h1>
      <div
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: md.parse(markdown, { async: false }) }}
      />
    </div>
  );
}
