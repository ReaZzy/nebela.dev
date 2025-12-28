import { navigate } from "astro:transitions/client";

const routes: Record<string, string> = {
  h: "/",
  b: "/blog",
};

let abortController: AbortController | null = null;

function handleKeydown(e: KeyboardEvent) {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    e.target instanceof HTMLSelectElement ||
    (e.target instanceof HTMLElement && e.target.contentEditable === "true")
  ) {
    return;
  }

  const key = e.key.toLowerCase();
  const route = routes[key];

  if (route && window.location.pathname !== route) {
    e.preventDefault();
    navigate(route);
  }
}

export function initKeyboardNavigation() {
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  document.addEventListener("keydown", handleKeydown, { signal: abortController.signal });
}
