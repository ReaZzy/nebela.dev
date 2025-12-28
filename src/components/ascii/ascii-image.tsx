import { useMemo, useRef } from "react";
import { type TransformerConfig } from "@/components/ascii/transformers/pipe/pipe-transformer";
import { useAsciiAnimation } from "@/components/ascii/hooks/use-ascii-animation";
import { useHoverableAsciiImage } from "@/components/ascii/hooks/use-hoverable-ascii-image";
import { useIsEngaged } from "@/hooks/use-is-engaged";
import { ASCII_TRANSFORMER_PRESETS, type TransformerPreset } from "@/components/ascii/constants/presets";

export interface AsciiImageProps {
  content: string;
  preset?: TransformerPreset;
  transformers?: TransformerConfig[];
  className?: string;
}

function AsciiImage({
  content: asciiArt,
  preset = "default",
  transformers,
  className,
}: AsciiImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isEngaged = useIsEngaged(containerRef);
  const resolvedTransformers = useMemo(
    () => [...ASCII_TRANSFORMER_PRESETS[preset], ...(transformers ?? [])],
    [preset, transformers]
  );
  const { content, emit } = useAsciiAnimation(resolvedTransformers, asciiArt, !isEngaged);

  const { contentRef } = useHoverableAsciiImage({
    onPositionChange: (position) => {
      if (position) {
        emit("mouseMove", { x: position.col, y: position.row });
      } else {
        emit("mouseLeave", undefined);
      }
    },
  });

  return (
    <div ref={containerRef} className={`pointer-events-none ${className ?? ""}`}>
      <pre
        ref={contentRef}
        className="text-[4px] leading-[4px] md:text-[5px] md:leading-[5px] lg:text-[7px] lg:leading-[7px] xl:text-[9px] xl:leading-[9px] 2xl:text-[12px] 2xl:leading-[12px] whitespace-pre select-none pointer-events-none"
      >
        {content}
      </pre>
    </div>
  );
}

AsciiImage.displayName = "AsciiImage";
export default AsciiImage;
