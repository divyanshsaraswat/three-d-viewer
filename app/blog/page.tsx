import { sanityClient } from "@/lib/sanity/client";
import { allPostsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import BlogListClient, { type BlogListPost } from "./BlogListClient";

export const revalidate = 60;

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default async function BlogPage() {
    const rawPosts = await sanityClient.fetch(allPostsQuery);

    const posts: BlogListPost[] = rawPosts.map((p: any) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        author: p.author,
        date: formatDate(p.date),
        image: p.image ? urlFor(p.image).width(1200).url() : "",
    }));

    return <BlogListClient posts={posts} />;
}
