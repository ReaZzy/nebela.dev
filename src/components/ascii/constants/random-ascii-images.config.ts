import type { TransformerConfig } from "@components/transformers/pipe/pipe-transformer";
import type { TransformerPreset } from "./presets";
import { mediaQuery } from "@/constants/breakpoints";

export interface AsciiImageConfig {
  content: string;
  className?: string;
  preset?: TransformerPreset;
  transformers?: TransformerConfig[];
}

interface AsciiImagePathConfig {
  path: string;
  className: string;
  preset: TransformerPreset;
  clientMedia?: string;
}

export const ASCII_IMAGE_PATHS = {
  left: [
    {
      path: "src/assets/ascii-images/ascii-1.txt",
      className:
        "hidden 3xl:flex justify-start bg-clip-text text-transparent bg-linear-(--green-gradient) fixed inset-0",
      preset: "reverse",
      clientMedia: mediaQuery("3xl"),
    },
    {
      path: "src/assets/ascii-images/ascii-4.txt",
      className:
        "hidden 3xl:flex justify-start bg-clip-text text-transparent bg-linear-(--green-gradient) fixed inset-0",
      preset: "default",
      clientMedia: mediaQuery("3xl"),
    },
  ] satisfies AsciiImagePathConfig[],
  right: [
    {
      path: "src/assets/ascii-images/ascii-2.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "reverse",
    },
    {
      path: "src/assets/ascii-images/ascii-3.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "reverse",
    },
  ] satisfies AsciiImagePathConfig[],
  blog: [
    {
      path: "src/assets/ascii-images/ascii-2.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "no-flicker-reverse",
    },
    {
      path: "src/assets/ascii-images/ascii-3.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "no-flicker-reverse",
    },
  ] satisfies AsciiImagePathConfig[],
} as const;
