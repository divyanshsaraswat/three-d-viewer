import { groq } from "next-sanity";

export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "id": slug.current,
    title,
    excerpt,
    "author": author->name,
    "date": publishedAt,
    "image": mainImage,
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    subtitle,
    "image": mainImage,
    tags,
    readTime,
    "published": publishedAt,
    "updated": updatedAt,
    body,
    author->{
      name,
      designation,
      "avatar": avatar,
      linkedin,
      twitter
    }
  }
`;

export const allSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc).slug.current
`;
