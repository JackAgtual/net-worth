import { AssetCategory } from "@/generated/prisma/enums";
import { Contributor, FullStatement } from "@/types/types";
import { Decimal } from "@prisma/client/runtime/client";
import { toDecimal } from "../utils/decimal-utils";
import { getGrowthFromAppreciation, getTotalContributions } from "./asset";
import { getGrowthFromInterest } from "./liability";

export function getTotalAssetAmount(statement: FullStatement): Decimal {
  return statement.assets.reduce((acc, cur) => acc.add(cur.amount), Decimal(0));
}

export function getTotalLiabilityAmount(statement: FullStatement): Decimal {
  return statement.liabilities.reduce(
    (acc, cur) => acc.add(cur.amount),
    Decimal(0)
  );
}

export function getNetWorth(statement: FullStatement): Decimal {
  return getTotalAssetAmount(statement).sub(getTotalLiabilityAmount(statement));
}

export function getTotalAssetAmountByCategory(
  statement: FullStatement,
  category: AssetCategory
): Decimal {
  return statement.assets
    .filter((asset) => asset.category === category)
    .reduce((acc, cur) => acc.add(cur.amount), Decimal(0));
}

export function getPercentOfAssetsByCategory(
  statement: FullStatement,
  category: AssetCategory
): Decimal {
  const totalAmountInCategory = getTotalAssetAmountByCategory(
    statement,
    category
  );
  const totalAssets = getTotalAssetAmount(statement);
  return totalAmountInCategory.div(totalAssets);
}

export function getContributionAmountByContributor(
  statement: FullStatement,
  contributor: Contributor
): Decimal {
  return statement.assets.reduce((acc, cur) => {
    switch (contributor) {
      case Contributor.All:
        return acc.add(getTotalContributions(cur));
      case Contributor.Self:
        return acc.add(toDecimal(cur.selfContributions));
      case Contributor.NonSelf:
        return acc.add(toDecimal(cur.nonSelfContributions));
      default:
        return acc;
    }
  }, Decimal(0));
}

export function getContributioPercentOfSalaryByContributor(
  statement: FullStatement,
  contributor: Contributor
): Decimal | undefined {
  if (!statement.lastYearSalary) return undefined;

  const contributionAmount = getContributionAmountByContributor(
    statement,
    contributor
  );
  return getPercentOfSalary(contributionAmount, statement);
}

export function getTotalWithdrawals(statement: FullStatement): Decimal {
  return statement.assets.reduce(
    (acc, cur) => acc.add(toDecimal(cur.withdrawals)),
    Decimal(0)
  );
}

export function getTotalWithdrawalsPercentOfSalary(
  statement: FullStatement
): Decimal | undefined {
  const totalWithdrawals = getTotalWithdrawals(statement);
  return getPercentOfSalary(totalWithdrawals, statement);
}

export function getNetContributions(statement: FullStatement): Decimal {
  const totalContributions = getContributionAmountByContributor(
    statement,
    Contributor.All
  );
  const totalWithdrawals = getTotalWithdrawals(statement);
  return totalContributions.sub(totalWithdrawals);
}

export function getNetContributionsPercentOfSalary(statement: FullStatement) {
  const netContributions = getNetContributions(statement);
  return getPercentOfSalary(netContributions, statement);
}

export function getLastYearAssetGrowth(statement: FullStatement): Decimal {
  return statement.assets
    .filter((asset) => {
      return (
        asset.includeInGrowthCalculation === true &&
        asset.amountOneYearAgo !== undefined
      );
    })
    .reduce(
      (acc, cur) => acc.add(getGrowthFromAppreciation(cur) ?? 0),
      Decimal(0)
    );
}

export function getLastYearAssetGrowthPercentOfSalary(
  statement: FullStatement
): Decimal | undefined {
  if (!statement.lastYearSalary) return undefined;

  const lastYearAssetGrowth = getLastYearAssetGrowth(statement);
  return getPercentOfSalary(lastYearAssetGrowth, statement);
}

export function getTotalRetirementAssets(statement: FullStatement): Decimal {
  return statement.assets
    .filter((asset) => asset.retirement)
    .reduce((acc, cur) => acc.add(cur.amount), Decimal(0));
}

export function getRetirementAssetsByCategory(
  statement: FullStatement,
  category: AssetCategory
): Decimal {
  return statement.assets
    .filter((asset) => asset.retirement && asset.category === category)
    .reduce((acc, cur) => acc.add(cur.amount), Decimal(0));
}

export function getTotalLiabilityPaymentsMade(statement: FullStatement) {
  return statement.liabilities.reduce(
    (acc, cur) => acc.add(toDecimal(cur.paymentsMade)),
    Decimal(0)
  );
}

export function getTotalLiabilityPaymentsMadePercentOfSalary(
  statement: FullStatement
) {
  const totalLiabilityPaymentsMade = getTotalLiabilityPaymentsMade(statement);
  return getPercentOfSalary(totalLiabilityPaymentsMade, statement);
}

export function getTotalLiabilityGrowthFromInterest(statement: FullStatement) {
  return statement.liabilities.reduce(
    (acc, cur) => acc.add(getGrowthFromInterest(cur) ?? 0),
    Decimal(0)
  );
}

export function getTotalLiabilityGrowthFromInterestPercentOfSalary(
  statement: FullStatement
) {
  const totalLiabilityGrowthFromInterest =
    getTotalLiabilityGrowthFromInterest(statement);
  return getPercentOfSalary(totalLiabilityGrowthFromInterest, statement);
}

export function getPercentOfSalary(number: Decimal, statement: FullStatement) {
  if (!statement.lastYearSalary) return undefined;

  return number.div(statement.lastYearSalary);
}

// TODO: See if you need these methods or if prisma will handle them
//   export function addLiability(
//     liabilityParams: LiabilityDoc
//   ): Promise<LiabilityHydrated> {
//     const liability = await Liability.create(liabilityParams);
//     this.liabilities.push(liability._id);
//     save();
//     return liability;
//   }

//   export function addLiabilities(liabilities: LiabilityDoc[]): Promise<void> {
//     const liabilityDocs = await Liability.insertMany(liabilities);
//     if (liabilityDocs.length !== liabilities.length) {
//       throw new Error("Not all liabilities were added to statement");
//     }

//     liabilityDocs.forEach((asset) => {
//       this.liabilities.push(asset._id);
//     });
//     save();
//   }

//   export function deleteLiability(id: Types.ObjectId | string): Promise<boolean> {
//     const deletedDoc = await Liability.findByIdAndDelete(id);
//     if (!deletedDoc) return false;
//     this.liabilities.pull({ _id: deletedDoc._id });
//     save();
//     return true;
//   }

//   export function updateLiability(
//     id: Types.ObjectId | string,
//     changes: LiabilityUpdate
//   ): Promise<LiabilityHydrated | null> {
//     const liabilityId = this.liabilities.find(
//       (el) => el.toString() === id.toString()
//     );

//     if (!liabilityId) return null;

//     const liability = await Liability.findById(id);

//     if (!liability) return null;

//     Object.assign(liability, changes);
//     await liability.save();
//     return liability;
//   }

//   export function addAsset(asset: AssetDoc): Promise<AssetHydrated> {
//     const createdAsset = await Asset.create(asset);
//     this.assets.push(createdAsset._id);
//     save();
//     return createdAsset;
//   }

//   export function addAssets(assets: AssetDoc[]): Promise<void> {
//     const assetDocs = await Asset.insertMany(assets);
//     if (assetDocs.length !== assets.length) {
//       throw new Error("Not all assets were added to statement");
//     }

//     assetDocs.forEach((asset) => {
//       this.assets.push(asset._id);
//     });
//     save();
//   }

//   export function deleteAsset(id: Types.ObjectId | string): Promise<boolean> {
//     const deletedDoc = await Asset.findByIdAndDelete(id);
//     if (!deletedDoc) return false;

//     this.assets.pull({ _id: deletedDoc._id });
//     save();
//     return true;
//   }

//   export function updateAsset(
//     id: Types.ObjectId | string,
//     changes: AssetUpdate
//   ): Promise<AssetHydrated | null> {
//     const assetId = this.assets.find(
//       (el) => el.toString() === id.toString()
//     );

//     if (!assetId) return null;

//     const asset = await Asset.findById(id);

//     if (!asset) return null;

//     Object.assign(asset, changes);
//     await asset.save();
//     return asset;
//   }
