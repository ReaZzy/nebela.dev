import { useState, useEffect } from "react";
import type { ASCII_IMAGE_PATHS } from "@/components/ascii/constants/random-ascii-images.config";

type ImageConfig =
  | (typeof ASCII_IMAGE_PATHS.left)[number]
  | (typeof ASCII_IMAGE_PATHS.right)[number]
  | (typeof ASCII_IMAGE_PATHS.blog)[number];

interface UseRandomAsciiImageResult {
  content: string | null;
  config: ImageConfig | null;
  isLoading: boolean;
}

export function useRandomAsciiImage(images: ImageConfig[]): UseRandomAsciiImageResult {
  const [content, setContent] = useState<string | null>(null);
  const [config, setConfig] = useState<ImageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const selectedConfig =
      images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;

    if (!selectedConfig) {
      setIsLoading(false);
      return;
    }

    setConfig(selectedConfig);

    fetch(`/${selectedConfig.path}`)
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
      })
      .catch((error) => {
        console.error("Failed to load ASCII image:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { content, config, isLoading };
}
