import type { TransformerConfig } from "@/components/ascii/transformers/pipe/pipe-transformer";
import type { TransformerPreset } from "@/components/ascii/constants/presets";

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
}

export const ASCII_IMAGE_PATHS = {
  left: [
    {
      path: "ascii-images/ascii-1.txt",
      className:
        "hidden 3xl:flex justify-start bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 left-0 3xl:opacity-100 opacity-40",
      preset: "reverse",
    },
    {
      path: "ascii-images/ascii-4.txt",
      className:
        "hidden 3xl:flex justify-start bg-clip-text text-transparent bg-linear-(--green-gradient) fixed inset-0 3xl:opacity-100 opacity-30",
      preset: "default",
    },
  ] satisfies AsciiImagePathConfig[],
  right: [
    {
      path: "ascii-images/ascii-2.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none 3xl:opacity-100 opacity-30",
      preset: "reverse",
    },
    {
      path: "ascii-images/ascii-3.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none 3xl:opacity-100 opacity-30",
      preset: "reverse",
    },
  ] satisfies AsciiImagePathConfig[],
  blog: [
    {
      path: "ascii-images/ascii-2.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "no-flicker-reverse",
    },
    {
      path: "ascii-images/ascii-3.txt",
      className:
        "flex flex-col justify-end bg-clip-text text-transparent bg-linear-(--green-gradient) fixed bottom-0 right-0 h-dvh pointer-events-none",
      preset: "no-flicker-reverse",
    },
  ] satisfies AsciiImagePathConfig[],
} as const;
