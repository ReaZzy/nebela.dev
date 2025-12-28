import { useEffect, useState, useRef } from "react";
import {
  type AsciiAnimationStrategy,
  type AsciiAnimationStrategyConstructor,
} from "./ascii-animation-strategy";
import { AsciiLinearAnimationStrategy } from "./ascii-linear-animation-strategy";
import { AsciiFlickerAnimationStrategy } from "./ascii-flicker-animation-strategy";
import { AsciiMouseAnimationStrategy } from "./ascii-mouse-animation-strategy";
import {
  AsciiPipeAnimationStrategy,
  type PipeStrategyItem,
} from "./ascii-pipe-animation-strategy";

interface AsciiImageProps {
  path: string;
  strategies?: PipeStrategyItem[];
  className?: string;
}
const DEFAULT_STRATEGIES: PipeStrategyItem[] = [
  { strategy: AsciiLinearAnimationStrategy, sync: false },
  { strategy: AsciiFlickerAnimationStrategy, sync: false },
  { strategy: AsciiMouseAnimationStrategy, sync: false },
];

function AsciiImage({
  path,
  strategies = DEFAULT_STRATEGIES,
  className,
}: AsciiImageProps) {
  const [content, setContent] = useState<string>("");
  const asciiArtRef = useRef<string>("");
  const flickerStrategyRef = useRef<AsciiFlickerAnimationStrategy | null>(null);
  const mouseStrategyRef = useRef<AsciiMouseAnimationStrategy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const isRevealingRef = useRef(false);

  useEffect(() => {
    let animationStrategyInstance: AsciiAnimationStrategy | null = null;

    const runAnimation = async () => {
      if (isRevealingRef.current) return;
      isRevealingRef.current = true;

      try {
        const res = await fetch(path);
        const art = await res.text();
        asciiArtRef.current = art;

        const presenter = {
          updateUi: (updatedArt: string) => {
            setContent(updatedArt);
          },
        };

        if (strategies) {
          const pipeStrategy = new AsciiPipeAnimationStrategy({
            asciiArt: art,
            presenter,
            strategies,
          });
          animationStrategyInstance = pipeStrategy;

          await pipeStrategy.animate();

          // Populate refs from the pipe strategy instances so interactions work
          const runningStrategies = pipeStrategy.getStrategies();

          const mouseStrategy = runningStrategies.find(
            (s): s is AsciiMouseAnimationStrategy =>
              s instanceof AsciiMouseAnimationStrategy
          );
          if (mouseStrategy) {
            mouseStrategyRef.current = mouseStrategy;
          }

          const flickerStrategy = runningStrategies.find(
            (s): s is AsciiFlickerAnimationStrategy =>
              s instanceof AsciiFlickerAnimationStrategy
          );
          if (flickerStrategy) {
            flickerStrategyRef.current = flickerStrategy;
          }

        }
      } catch (e) {
        console.error(e);
        setContent(asciiArtRef.current);
      } finally {
        isRevealingRef.current = false;
      }
    };

    runAnimation();

    return () => {
      animationStrategyInstance?.stop();
    };
  }, [path, strategies]);

  const handleMouseEnter = () => {
    if (
      isRevealingRef.current ||
      flickerStrategyRef.current ||
      mouseStrategyRef.current
    )
      return;

    const presenter = {
      updateUi: (art: string) => {
        setContent(art);
      },
    };

    const mouseStrategy = new AsciiMouseAnimationStrategy({
      asciiArt: asciiArtRef.current,
      presenter,
    });
    mouseStrategyRef.current = mouseStrategy;
    mouseStrategy.animate();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseStrategyRef.current || !preRef.current) return;

    const rect = preRef.current.getBoundingClientRect();
    const isRotated = className?.includes("rotate-180");

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (isRotated) {
      x = rect.width - x;
      y = rect.height - y;
    }

    // Monospace width is usually consistent
    const charWidth = 7.22;
    const charHeight = 12;

    const col = Math.floor(x / charWidth);
    const row = Math.floor(y / charHeight);

    mouseStrategyRef.current.updateMousePos(col, row);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col justify-end items-start overflow-hidden ${className || ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      <pre
        ref={preRef}
        className="text-[12px] leading-[12px] whitespace-pre select-none"
      >
        {content}
      </pre>
    </div>
  );
}

AsciiImage.displayName = "AsciiImage";
export default AsciiImage;
