import { useSyncExternalStore, useEffect, useState, type RefObject } from "react";

function subscribeToPageVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getPageVisibilitySnapshot() {
  return document.visibilityState === "visible";
}

function getPageVisibilityServerSnapshot() {
  return true;
}

export function useIsEngaged<T extends HTMLElement>(ref: RefObject<T | null>): boolean {
  const isPageVisible = useSyncExternalStore(
    subscribeToPageVisibility,
    getPageVisibilitySnapshot,
    getPageVisibilityServerSnapshot
  );

  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsInViewport(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isInViewport && isPageVisible;
}
