import type { Liability } from "@/generated/prisma/client";
import { Numberify } from "./numberify";

export function getGrowthFromInterest(
  liability: Numberify<Liability>
): number | void {
  if (liability.amountOneYearAgo == null) return;

  return (
    liability.amount -
    liability.amountOneYearAgo +
    (liability.paymentsMade ?? 0)
  );
}
