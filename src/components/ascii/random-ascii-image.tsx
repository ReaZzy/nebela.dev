import { useRandomAsciiImage } from "@/components/ascii/hooks/use-random-ascii-image";
import AsciiImage from "@/components/ascii/ascii-image";
import type { ASCII_IMAGE_PATHS } from "@/components/ascii/constants/random-ascii-images.config";
import type { TransformerPreset } from "@/components/ascii/constants/presets";

type ImageConfig =
  | (typeof ASCII_IMAGE_PATHS.left)[number]
  | (typeof ASCII_IMAGE_PATHS.right)[number]
  | (typeof ASCII_IMAGE_PATHS.blog)[number];

interface RandomAsciiImageProps {
  images: ImageConfig[];
  className?: string;
  preClassName?: string;
  preset?: TransformerPreset;
}

export default function RandomAsciiImage({
  images,
  className = "",
  preClassName = "",
  preset,
}: RandomAsciiImageProps) {
  const { content, config, isLoading } = useRandomAsciiImage(images);

  if (isLoading || !content || !config) {
    return null;
  }

  return (
    <AsciiImage
      content={content}
      className={`${preClassName} ${config.className} ${className}`}
      preset={preset ?? config.preset}
    />
  );
}
