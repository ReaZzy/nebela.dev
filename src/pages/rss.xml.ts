import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPosts } from "@/utils/blog";
import { ME } from "@/constants/me";

export async function GET(context: APIContext) {
  const posts = getBlogPosts();
  const site = context.site ?? new URL("https://nebela.dev");

  return rss({
    title: `${ME.name}'s blog`,
    description: `Articles and thoughts from ${ME.name}`,
    site: site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language><atom:link href="${new URL("rss.xml", site)}" rel="self" type="application/rss+xml"/>`,
  });
}
