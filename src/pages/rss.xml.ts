import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPosts } from "@/utils/blog";
import { ME } from "@/constants/me";

export async function GET(context: APIContext) {
  const posts = getBlogPosts();

  return rss({
    title: `${ME.name}'s blog`,
    description: `Articles and thoughts from ${ME.name}`,
    site: context.site ?? "nebela.dev",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
