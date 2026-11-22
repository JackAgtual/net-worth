import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { getStatementFromYear } from "../dal/statement-dal";
import { StatementForm } from "../types/statement-types";

export async function getStatementFormPrefillData(year: number) {
  await getValidSessionOrRedirect();

  const prefillStatement = await getStatementFromYear(year);

  if (!prefillStatement)
    throw new Error(`Could not populate statement data from ${year}`);

  return {
    assets: prefillStatement.assets.map((asset) => {
      return {
        title: asset.title,
        category: asset.category,
        retirement: asset.retirement,
        includeInGrowthCalculation: asset.includeInGrowthCalculation,
        amountOneYearAgo: asset.amount,
      };
    }),
    liabilities: prefillStatement.liabilities.map((liability) => {
      return {
        title: liability.title,
      };
    }),
  } as StatementForm; // TODO: Fix typing
}
