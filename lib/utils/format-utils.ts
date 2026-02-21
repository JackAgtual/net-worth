export function formatAsDollar(
  amount: number | undefined,
  compact: boolean = false
): string {
  if (amount === undefined) return "";

  const locale = amount.toLocaleString("en-US", {
    notation: compact ? "compact" : "standard",
  });
  if (amount > 0) {
    return `$${locale}`;
  } else if (amount < 0) {
    return `($${locale.slice(1)})`;
  }
  return "$-";
}

export function formatAsPercent(amount: number | undefined): string {
  if (amount === undefined) return "0%";
  return `${Math.trunc(amount * 100)}%`;
}
