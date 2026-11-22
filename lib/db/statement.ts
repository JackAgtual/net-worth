import { AssetCategory } from "@/generated/prisma/enums";
import { Contributor } from "@/types/types";
import { FullStatement } from "../types/statement-types";
import { getGrowthFromAppreciation, getTotalContributions } from "./asset";
import { getGrowthFromInterest } from "./liability";
import { Numberify } from "./numberify";

export function getTotalAssetAmount(
  statement: Numberify<FullStatement>
): number {
  return statement.assets.reduce((acc, cur) => acc + cur.amount, 0);
}

export function getTotalLiabilityAmount(
  statement: Numberify<FullStatement>
): number {
  return statement.liabilities.reduce((acc, cur) => acc + cur.amount, 0);
}

export function getNetWorth(statement: Numberify<FullStatement>): number {
  return getTotalAssetAmount(statement) - getTotalLiabilityAmount(statement);
}

export function getTotalAssetAmountByCategory(
  statement: Numberify<FullStatement>,
  category: AssetCategory
): number {
  return statement.assets
    .filter((asset) => asset.category === category)
    .reduce((acc, cur) => acc + cur.amount, 0);
}

export function getPercentOfAssetsByCategory(
  statement: Numberify<FullStatement>,
  category: AssetCategory
): number {
  const totalAmountInCategory = getTotalAssetAmountByCategory(
    statement,
    category
  );
  const totalAssets = getTotalAssetAmount(statement);
  return totalAmountInCategory / totalAssets;
}

export function getContributionAmountByContributor(
  statement: Numberify<FullStatement>,
  contributor: Contributor
): number {
  return statement.assets.reduce((acc, cur) => {
    switch (contributor) {
      case Contributor.All:
        return acc + getTotalContributions(cur);
      case Contributor.Self:
        return acc + (cur.selfContributions ?? 0);
      case Contributor.NonSelf:
        return acc + (cur.nonSelfContributions ?? 0);
      default:
        return acc;
    }
  }, 0);
}

export function getContributioPercentOfSalaryByContributor(
  statement: Numberify<FullStatement>,
  contributor: Contributor
): number | undefined {
  if (!statement.lastYearSalary) return undefined;

  const contributionAmount = getContributionAmountByContributor(
    statement,
    contributor
  );
  return getPercentOfSalary(contributionAmount, statement);
}

export function getTotalWithdrawals(
  statement: Numberify<FullStatement>
): number {
  return statement.assets.reduce((acc, cur) => acc + (cur.withdrawals ?? 0), 0);
}

export function getTotalWithdrawalsPercentOfSalary(
  statement: Numberify<FullStatement>
): number | undefined {
  const totalWithdrawals = getTotalWithdrawals(statement);
  return getPercentOfSalary(totalWithdrawals, statement);
}

export function getNetContributions(
  statement: Numberify<FullStatement>
): number {
  const totalContributions = getContributionAmountByContributor(
    statement,
    Contributor.All
  );
  const totalWithdrawals = getTotalWithdrawals(statement);
  return totalContributions - totalWithdrawals;
}

export function getNetContributionsPercentOfSalary(
  statement: Numberify<FullStatement>
) {
  const netContributions = getNetContributions(statement);
  return getPercentOfSalary(netContributions, statement);
}

export function getLastYearAssetGrowth(
  statement: Numberify<FullStatement>
): number {
  return statement.assets
    .filter((asset) => {
      return (
        asset.includeInGrowthCalculation === true &&
        asset.amountOneYearAgo !== undefined
      );
    })
    .reduce((acc, cur) => acc + (getGrowthFromAppreciation(cur) ?? 0), 0);
}

export function getLastYearAssetGrowthPercentOfSalary(
  statement: Numberify<FullStatement>
): number | undefined {
  if (!statement.lastYearSalary) return undefined;

  const lastYearAssetGrowth = getLastYearAssetGrowth(statement);
  return getPercentOfSalary(lastYearAssetGrowth, statement);
}

export function getTotalRetirementAssets(
  statement: Numberify<FullStatement>
): number {
  return statement.assets
    .filter((asset) => asset.retirement)
    .reduce((acc, cur) => acc + cur.amount, 0);
}

export function getRetirementAssetsByCategory(
  statement: Numberify<FullStatement>,
  category: AssetCategory
): number {
  return statement.assets
    .filter((asset) => asset.retirement && asset.category === category)
    .reduce((acc, cur) => acc + cur.amount, 0);
}

export function getTotalLiabilityPaymentsMade(
  statement: Numberify<FullStatement>
) {
  return statement.liabilities.reduce(
    (acc, cur) => acc + (cur.paymentsMade ?? 0),
    0
  );
}

export function getTotalLiabilityPaymentsMadePercentOfSalary(
  statement: Numberify<FullStatement>
) {
  const totalLiabilityPaymentsMade = getTotalLiabilityPaymentsMade(statement);
  return getPercentOfSalary(totalLiabilityPaymentsMade, statement);
}

export function getTotalLiabilityGrowthFromInterest(
  statement: Numberify<FullStatement>
) {
  return statement.liabilities.reduce(
    (acc, cur) => acc + (getGrowthFromInterest(cur) ?? 0),
    0
  );
}

export function getTotalLiabilityGrowthFromInterestPercentOfSalary(
  statement: Numberify<FullStatement>
) {
  const totalLiabilityGrowthFromInterest =
    getTotalLiabilityGrowthFromInterest(statement);
  return getPercentOfSalary(totalLiabilityGrowthFromInterest, statement);
}

export function getPercentOfSalary(
  number: number,
  statement: Numberify<FullStatement>
) {
  if (!statement.lastYearSalary) return undefined;

  return number / statement.lastYearSalary;
}
