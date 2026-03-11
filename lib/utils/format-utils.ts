export function formatAsDollar(
  amount: number | undefined | null,
  compact: boolean = false
): string {
  if (amount === undefined || amount === null) return "";

  const options: Intl.NumberFormatOptions = compact
    ? { notation: "compact" }
    : {
        ...(Number.isInteger(amount) && !compact
          ? {}
          : {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
      };

  const locale = amount.toLocaleString("en-US", options);
  if (amount > 0) {
    return `$${locale}`;
  } else if (amount < 0) {
    return `($${locale.slice(1)})`;
  }
  return "$-";
}

export function formatAsPercent(amount: number | undefined): string {
  if (amount === undefined) return "0%";
  return `${Math.round(amount * 100)}%`;
}
