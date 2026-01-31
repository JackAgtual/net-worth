export function formatAsDollar(amount: number | undefined): string {
  if (amount === undefined) return "";

  const locale = amount.toLocaleString("en-US");
  if (amount > 0) {
    return `$${locale}`;
  } else if (amount < 0) {
    return `($${locale})`;
  }
  return "$-";
}

export function formatAsPercent(amount: number | undefined): string {
  if (amount === undefined) return "0%";
  return `${Math.trunc(amount * 100)}%`;
}
