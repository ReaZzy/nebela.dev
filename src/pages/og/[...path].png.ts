import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getCollection } from "astro:content";
import { ME } from "@/constants/me";
import { formatDate } from "@/utils/format-date";

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  const paths = [
    { params: { path: "home" } },
    { params: { path: "blog" } },
    { params: { path: "cv" } },
    ...posts.map((post) => ({
      params: { path: `blog/${post.slug}` },
    })),
  ];

  return paths;
}

interface OGImageData {
  title: string;
  description?: string;
  date?: string;
}

async function getPageData(path: string): Promise<OGImageData> {
  const pathParts = path.split("/");

  if (path === "home") {
    return {
      title: ME.name,
      description: ME.position,
    };
  }

  if (path === "blog") {
    return {
      title: "blog",
      description: `blog posts by ${ME.name}`,
    };
  }

  if (path === "cv") {
    return {
      title: "cv",
      description: `curriculum vitae of ${ME.name}`,
    };
  }

  if (pathParts[0] === "blog" && pathParts[1]) {
    const slug = pathParts[1];
    const posts = await getCollection("blog");
    const post = posts.find((p) => p.slug === slug);

    if (post) {
      return {
        title: post.data.title,
        description: post.data.description,
        date: formatDate(post.data.date),
      };
    }
  }

  return {
    title: ME.name,
    description: `personal website of ${ME.name}`,
  };
}

// Cache for font data
let fontData: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData;

  // Fetch IBM Plex Mono from Google Fonts
  const fontUrl =
    "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf";
  const response = await fetch(fontUrl);
  fontData = await response.arrayBuffer();
  return fontData;
}

export const GET: APIRoute = async ({ params }) => {
  const path = params.path || "home";
  const data = await getPageData(path);

  const font = await loadFont();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#18181b",
          fontFamily: "IBM Plex Mono",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "80px",
                position: "relative",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "64px",
                            fontWeight: "normal",
                            color: "#fafafa",
                            lineHeight: 1.2,
                          },
                          children: data.title,
                        },
                      },
                      ...(data.description
                        ? [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "32px",
                                  color: "#a1a1aa",
                                  lineHeight: 1.4,
                                },
                                children: data.description,
                              },
                            },
                          ]
                        : []),
                      ...(data.date
                        ? [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "24px",
                                  color: "#71717a",
                                  marginTop: "16px",
                                },
                                children: data.date,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      color: "#22c55e",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          children: "#",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            color: "#fafafa",
                          },
                          children: ME.name,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
