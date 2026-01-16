import type { APIRoute } from "astro";
import { ME } from "@/constants/me";
import { getBlogPosts } from "@/utils/blog";
import { generateOgImage } from "@/lib/og";

export const prerender = true;

interface Page {
  slug: string;
  title: string;
  description?: string;
  isArticle?: boolean;
}

const blogPosts: Page[] = getBlogPosts().map((post) => ({
  slug: `blog/${post.slug}`,
  title: post.title,
  description: post.description,
  isArticle: true,
}));

const pages: Page[] = [
  {
    slug: "home",
    title: ME.name,
    description: ME.position,
  },
  {
    slug: "blog",
    title: "blog",
    description: `Articles & thoughts`,
  },
  {
    slug: "cv",
    title: "cv",
  },
  ...blogPosts,
];

export function getStaticPaths() {
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: page,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, isArticle } = props as Page;

  const png = await generateOgImage({ title, description, isArticle });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};
