import satori from "satori";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const colors = {
  bg: "#18181b",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  green: "#4ade80",
};

let fontRegular: Buffer;
let fontBold: Buffer;
let asciiLines: string[];

async function loadAssets() {
  if (!fontRegular) {
    fontRegular = await readFile(join(process.cwd(), "public/fonts/GeistMono-Regular.ttf"));
    fontBold = await readFile(join(process.cwd(), "public/fonts/GeistMono-Bold.ttf"));
    const asciiArt = await readFile(
      join(process.cwd(), "public/ascii-images/ascii-2.txt"),
      "utf-8"
    );
    asciiLines = asciiArt.split("\n");
  }
}

interface OgImageProps {
  title: string;
  description?: string;
  isArticle?: boolean;
}

function OgImage({ title, description, isArticle }: OgImageProps) {
  const titleSize = isArticle ? 44 : 56;
  const descSize = isArticle ? 20 : 24;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        backgroundColor: colors.bg,
        fontFamily: "Geist Mono",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          paddingRight: "260px",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ color: colors.green, fontSize: 24 }}>~</span>
          <span style={{ color: colors.muted, fontSize: 24, marginLeft: 8 }}>nebela.dev</span>
        </div>

        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 24,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: descSize,
              color: colors.muted,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: colors.green, marginRight: 12, flexShrink: 0 }}>{">"}</span>
            <span style={{ overflow: "hidden" }}>{description}</span>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          right: -50,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          opacity: 0.3,
          fontSize: 6,
          lineHeight: 1,
          color: colors.green,
          whiteSpace: "pre",
        }}
      >
        {asciiLines.map((line) => (
          <>{line}</>
        ))}
      </div>
    </div>
  );
}

export async function generateOgImage(props: OgImageProps): Promise<Buffer> {
  await loadAssets();

  const svg = await satori(<OgImage {...props} />, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Geist Mono", data: fontRegular, weight: 400, style: "normal" },
      { name: "Geist Mono", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
