import { checkSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import { StatementForm } from "../types/statement-types";

export async function getStatementFormPrefillData(year: number) {
  const session = await checkSession();
  const prefillStatement = await Statement.findOne({
    userId: session.user.id,
    year,
  });

  if (!prefillStatement)
    throw new Error(`Could not populate statement data from ${year}`);

  const [prefillAssets, prefillLiabilities] = await Promise.all([
    prefillStatement.getAssets(),
    prefillStatement.getLiabilities(),
  ]);

  return {
    assets: prefillAssets.map((asset) => {
      return {
        title: asset.title,
        category: asset.category,
        retirement: asset.retirement,
        includeInGrowthCalculation: asset.includeInGrowthCalculation,
        amountOneYearAgo: asset.amount,
      };
    }),
    liabilities: prefillLiabilities.map((liability) => {
      return {
        title: liability.title,
      };
    }),
  } as StatementForm; // TODO: Fix typing
}
