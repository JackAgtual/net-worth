import type { Liability } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export function getGrowthFromInterest(liability: Liability): Decimal | void {
  if (liability.amountOneYearAgo == null) return;

  const paymentsMade =
    liability.paymentsMade == null ? Decimal(0) : liability.paymentsMade;

  const x: Decimal = liability.amountOneYearAgo;
  return liability.amount.sub(liability.amountOneYearAgo).add(paymentsMade);
}
