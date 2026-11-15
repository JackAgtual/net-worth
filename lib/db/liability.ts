import type { Liability } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export function getGrowthFromInterest(liability: Liability) {
  if (liability.amountOneYearAgo == null) return;

  const paymentsMade =
    liability.paymentsMade == null ? 0 : liability.paymentsMade.toNumber();

  const x: Decimal = liability.amountOneYearAgo;
  return (
    liability.amount.toNumber() -
    liability.amountOneYearAgo.toNumber() +
    paymentsMade
  );
}
