import type { PortableTextComponents } from "@portabletext/react";
import BlurImage from "@/components/BlurImage";
import { urlFor } from "./image";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function blockText(block: any): string {
  return (block.children || []).map((c: any) => c.text).join("");
}

export function extractHeadings(body: any[] = []) {
  return body
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b, i) => ({
      id: slugify(blockText(b)),
      num: String(i + 1).padStart(2, "0"),
      title: blockText(b),
    }));
}

export const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-32">
        {children}
      </h2>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <div className="my-8 rounded-2xl overflow-hidden">
        <BlurImage
          src={urlFor(value).width(1600).url()}
          alt={value.alt || ""}
          width={1600}
          height={900}
          className="w-full h-auto"
        />
      </div>
    ),
  },
};
