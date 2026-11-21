import type { Asset } from "@/generated/prisma/client";
import { Numberify } from "./numberify";

export function getTotalContributions(asset: Numberify<Asset>): number {
  return (asset.selfContributions ?? 0) + (asset.nonSelfContributions ?? 0);
}

export function getNetContributions(asset: Numberify<Asset>): number {
  return getTotalContributions(asset) - (asset.withdrawals ?? 0);
}

export function getGrowthFromAppreciation(
  asset: Numberify<Asset>
): number | undefined {
  if (!asset.amountOneYearAgo) return undefined;

  return asset.amount - asset.amountOneYearAgo - getNetContributions(asset);
}
