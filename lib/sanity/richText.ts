import DOMPurify from "isomorphic-dompurify";
import * as cheerio from "cheerio";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "a",
  "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "code", "pre",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "iframe", "span",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "target", "rel",
  "width", "height", "style", "class",
  "allow", "allowfullscreen", "frameborder",
  "colspan", "rowspan", "id",
];

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
  const clean = DOMPurify.sanitize(rawHtml || "", { ALLOWED_TAGS, ALLOWED_ATTR });
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
