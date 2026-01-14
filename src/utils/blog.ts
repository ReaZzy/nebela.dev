export interface Frontmatter {
  title: string;
  description: string;
  date: Date;
}

export interface BlogPost extends Frontmatter {
  slug: string;
}

const blogFiles = import.meta.glob<{ frontmatter: Frontmatter }>(
  "/src/pages/blog/*.astro",
  { eager: true }
);

export function getBlogPosts(): BlogPost[] {
  return Object.entries(blogFiles)
    .map(([path, mod]) => ({
      slug: path.replace("/src/pages/blog/", "").replace(".astro", ""),
      ...mod.frontmatter,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
