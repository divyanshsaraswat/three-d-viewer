import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { postBySlugQuery, allSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { siteConfig } from "@/utils/seo";
import BlogPostClient, { type BlogPostData } from "./BlogPostClient";

export const revalidate = 60;

function formatDate(iso: string | null): string | null {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

async function getPost(slug: string) {
    const raw = await sanityClient.fetch(postBySlugQuery, { slug });
    if (!raw) return null;

    const post: BlogPostData = {
        title: raw.title,
        subtitle: raw.subtitle,
        image: raw.image ? urlFor(raw.image).width(2000).url() : "",
        tags: raw.tags || [],
        body: raw.body || [],
        author: {
            name: raw.author?.name ?? "",
            designation: raw.author?.designation ?? "",
            avatar: raw.author?.avatar ? urlFor(raw.author.avatar).width(200).url() : "",
            readTime: raw.readTime ?? "",
            published: formatDate(raw.published) ?? "",
            updated: formatDate(raw.updated),
            linkedin: raw.author?.linkedin ?? "",
            twitter: raw.author?.twitter ?? "",
        },
    };
    return post;
}

export async function generateStaticParams() {
    const slugs: string[] = await sanityClient.fetch(allSlugsQuery);
    return slugs.map((id) => ({ id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);
    if (!post) return {};

    return {
        title: `${post.title} | ${siteConfig.name}`,
        description: post.subtitle,
        alternates: { canonical: `/blog/${id}` },
        openGraph: {
            title: post.title,
            description: post.subtitle,
            url: `/blog/${id}`,
            images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.subtitle,
            images: post.image ? [post.image] : undefined,
        },
    };
}

export default async function BlogPost({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPost(id);
    if (!post) notFound();

    const slugs: string[] = await sanityClient.fetch(allSlugsQuery);
    const currentIndex = slugs.indexOf(id);
    const prevId = currentIndex > 0 ? slugs[currentIndex - 1] : null;
    const nextId = currentIndex >= 0 && currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;

    return <BlogPostClient post={post} prevId={prevId} nextId={nextId} />;
}
