import type { Liability } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { toDecimal } from "../utils/decimal-utils";

export function getGrowthFromInterest(liability: Liability): Decimal | void {
  if (liability.amountOneYearAgo == null) return;

  return liability.amount
    .sub(liability.amountOneYearAgo)
    .add(toDecimal(liability.paymentsMade));
}
