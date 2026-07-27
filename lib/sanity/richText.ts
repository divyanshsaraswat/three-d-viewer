import * as cheerio from "cheerio";

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "u", "s", "a",
  "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "code", "pre",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "iframe", "span",
]);

// Tags stripped along with their content (never just unwrapped).
const STRIP_WITH_CONTENT = new Set(["script", "style", "noscript", "object", "embed"]);

const ALLOWED_ATTR = new Set([
  "href", "src", "alt", "title", "target", "rel",
  "width", "height", "style", "class",
  "allow", "allowfullscreen", "frameborder",
  "colspan", "rowspan", "id",
]);

const URL_ATTR = new Set(["href", "src"]);
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

// ponytail: hand-rolled allowlist sanitizer instead of isomorphic-dompurify —
// dompurify's jsdom dependency broke Vercel's Turbopack SSR bundle (ESM/CJS
// interop crash in html-encoding-sniffer). cheerio was already a dependency here.
function sanitize(html: string): string {
  const $ = cheerio.load(html, null, false);

  $("*").each((_, el) => {
    if (el.type !== "tag") return;
    const $el = $(el);

    if (STRIP_WITH_CONTENT.has(el.tagName)) {
      $el.remove();
      return;
    }
    if (!ALLOWED_TAGS.has(el.tagName)) {
      $el.replaceWith(el.children as never);
      return;
    }

    for (const attr of Object.keys(el.attribs)) {
      if (attr.toLowerCase().startsWith("on") || !ALLOWED_ATTR.has(attr)) {
        $el.removeAttr(attr);
        continue;
      }
      if (URL_ATTR.has(attr) && !SAFE_URL.test(el.attribs[attr].trim())) {
        $el.removeAttr(attr);
      }
    }
  });

  return $.html();
}

export interface Heading {
  id: string;
  num: string;
  title: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function processBodyHtml(rawHtml: string): { html: string; headings: Heading[] } {
  const clean = sanitize(rawHtml || "");
  const $ = cheerio.load(clean, null, false);

  const headings: Heading[] = [];
  $("h2").each((i, el) => {
    const title = $(el).text().trim();
    const id = slugify(title);
    $(el).attr("id", id);
    $(el).addClass("scroll-mt-32");
    headings.push({ id, num: String(i + 1).padStart(2, "0"), title });
  });

  return { html: $.html(), headings };
}
