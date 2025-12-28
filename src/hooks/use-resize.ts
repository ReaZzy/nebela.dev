import { useEffect, useRef, type RefObject } from "react";

export function useResize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (element: T) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleResize = () => {
      callbackRef.current(element);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);
}
