import { useState, useRef, type RefObject, useEffect } from "react";
import { useResize } from "@/hooks/use-resize";

export interface HoverPosition {
  col: number;
  row: number;
}

export interface UseHoverableAsciiImageOptions {
  onPositionChange?: (position: HoverPosition | null) => void;
}

export interface UseHoverableAsciiImageReturn {
  position: HoverPosition | null;
  contentRef: RefObject<HTMLPreElement | null>;
}

interface CachedDimensions {
  charWidth: number;
  charHeight: number;
  maxCol: number;
  maxRow: number;
}

export function useHoverableAsciiImage(
  options: UseHoverableAsciiImageOptions = {}
): UseHoverableAsciiImageReturn {
  const { onPositionChange } = options;

  const [position, setPosition] = useState<HoverPosition | null>(null);
  const contentRef = useRef<HTMLPreElement>(null);
  const isHoveredRef = useRef(false);
  const dimensionsRef = useRef<CachedDimensions | null>(null);
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  useResize(contentRef, (element) => {
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize);

    const range = document.createRange();
    const textNode = element.firstChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
      range.setStart(textNode, 0);
      range.setEnd(textNode, 1);
      const charWidth = range.getBoundingClientRect().width;
      const rect = element.getBoundingClientRect();

      dimensionsRef.current = {
        charWidth,
        charHeight: lineHeight,
        maxCol: Math.floor(rect.width / charWidth) - 1,
        maxRow: Math.floor(rect.height / lineHeight) - 1,
      };
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dims = dimensionsRef.current;
      if (!dims || dims.charWidth === 0) return;

      const rect = contentRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inBounds = x >= 0 && x < rect.width && y >= 0 && y < rect.height;

      if (inBounds) {
        const col = Math.max(0, Math.min(dims.maxCol, Math.floor(x / dims.charWidth)));
        const row = Math.max(0, Math.min(dims.maxRow, Math.floor(y / dims.charHeight)));
        const newPosition = { col, row };

        isHoveredRef.current = true;
        setPosition(newPosition);
        onPositionChangeRef.current?.(newPosition);
      } else if (isHoveredRef.current) {
        isHoveredRef.current = false;
        setPosition(null);
        onPositionChangeRef.current?.(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return {
    position,
    contentRef,
  };
}
