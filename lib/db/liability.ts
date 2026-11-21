import type { Liability } from "@/generated/prisma/client";
import { Numberify } from "./numberify";

export function getGrowthFromInterest(
  liability: Numberify<Liability>
): number | null {
  if (liability.amountOneYearAgo == null) return null;

  return (
    liability.amount -
    liability.amountOneYearAgo +
    (liability.paymentsMade ?? 0)
  );
}
