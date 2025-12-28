export function formatDate(date: Date, format: "short" | "long" = "long"): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: format,
    day: "numeric",
  });
}
