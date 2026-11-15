import type { Asset } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { toDecimal } from "../utils/decimal-utils";

export function getTotalContributions(asset: Asset): Decimal {
  return toDecimal(asset.selfContributions).add(
    toDecimal(asset.nonSelfContributions)
  );
}

export function getNetContributions(asset: Asset): Decimal {
  return getTotalContributions(asset).sub(toDecimal(asset.withdrawals));
}

export function getGrowthFromAppreciation(asset: Asset): Decimal | undefined {
  if (!asset.amountOneYearAgo) return undefined;

  return toDecimal(asset.amount)
    .sub(asset.amountOneYearAgo)
    .sub(getNetContributions(asset));
}
