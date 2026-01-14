import mongoose, { Model, Schema, Types } from "mongoose";
import { MongoDocument } from "../types";
import { Category } from "@/lib/db/models/asset";
import { AssetHydrated, LiabilityHydrated } from "@/lib/db/models";

interface StatementDoc extends MongoDocument {
  year: number;
  lastYearSalary?: number;
  assets: Types.ObjectId[];
  liabilities: Types.ObjectId[];
}

export enum Contributor {
  Self,
  NonSelf,
  All,
}

interface StatementMethods {
  getTotalAssetAmount(): Promise<number>;
  getTotalLiabilityAmount(): Promise<number>;
  getNetWorth(): Promise<number>;
  getTotalAmountByCategory(category: Category): Promise<number>;
  getPercentOfAssetsByCategory(category: Category): Promise<number>;
  getContributionAmountByContributor(contributor: Contributor): Promise<number>;
  getContributioPercentOfSalaryByContributor(
    contributor: Contributor
  ): Promise<number | undefined>;
  getLastYearAssetGrowth(): Promise<number>;
  getLastYearAssetGrowthPercentOfSalary(): Promise<number | undefined>;
  getTotalRetirementAssets(): Promise<number>;
  getRetirementAssetsByCategory(category: Category): Promise<number>;
}
type StatementModelType = Model<StatementDoc, {}, StatementMethods>;

const required = true;

const statementSchema = new Schema<
  StatementDoc,
  StatementModelType,
  StatementMethods
>(
  {
    year: { type: Number, required },
    lastYearSalary: Number,
    assets: [
      {
        type: Types.ObjectId,
        ref: "Asset",
        required,
        default: [],
      },
    ],
    liabilities: [
      {
        type: Types.ObjectId,
        ref: "Liability",
        required,
        default: [],
      },
    ],
  },
  {
    methods: {
      async getTotalAssetAmount(): Promise<number> {
        await this.populate("assets");
        const assets = this.assets as unknown as AssetHydrated[];
        return assets.reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getTotalLiabilityAmount(): Promise<number> {
        await this.populate("liabilities");
        const liabilities = this.liabilities as unknown as LiabilityHydrated[];
        return liabilities.reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getNetWorth(): Promise<number> {
        const [totalAssets, totalLiabilities] = await Promise.all([
          this.getTotalAssetAmount(),
          this.getTotalLiabilityAmount(),
        ]);
        return totalAssets - totalLiabilities;
      },
      async getTotalAmountByCategory(category: Category): Promise<number> {
        await this.populate("assets");

        const assets = this.assets as unknown as AssetHydrated[];
        return assets
          .filter((asset) => asset.category === category)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getPercentOfAssetsByCategory(category: Category): Promise<number> {
        const totalAmountInCategory = await this.getTotalAmountByCategory(
          category
        );
        const totalAssets = await this.getTotalAssetAmount();
        return totalAmountInCategory / totalAssets;
      },
      async getContributionAmountByContributor(
        contributor: Contributor
      ): Promise<number> {
        await this.populate("assets");

        const assets = this.assets as unknown as AssetHydrated[];
        return assets
          .filter((asset) => {
            if (asset.contribution === undefined) return false;
            const contribution = asset.contribution;

            switch (contributor) {
              case Contributor.All:
                return true;
              case Contributor.Self:
                return contribution.selfContribution;
              case Contributor.NonSelf:
                return !contribution.selfContribution;
              default:
                return false;
            }
          })
          .reduce((acc, cur) => {
            if (cur.contribution === undefined) return acc;
            return acc + cur.contribution.amount;
          }, 0);
      },
      async getContributioPercentOfSalaryByContributor(
        contributor: Contributor
      ): Promise<number | undefined> {
        if (this.lastYearSalary === undefined) return undefined;
        const contributionAmount =
          await this.getContributionAmountByContributor(contributor);
        return contributionAmount / this.lastYearSalary;
      },
      async getLastYearAssetGrowth(): Promise<number> {
        await this.populate("assets");

        const assets = this.assets as unknown as AssetHydrated[];
        return assets
          .filter((asset) => {
            return (
              asset.includeInGrowthCalculation === true &&
              asset.amountOneYearAgo !== undefined
            );
          })
          .reduce((acc, cur) => acc + (cur.growthFromAppreciation ?? 0), 0);
      },
      async getLastYearAssetGrowthPercentOfSalary(): Promise<
        number | undefined
      > {
        if (this.lastYearSalary === undefined) return undefined;

        const lastYearAssetGrowth = await this.getLastYearAssetGrowth();
        return lastYearAssetGrowth / this.lastYearSalary;
      },
      async getTotalRetirementAssets(): Promise<number> {
        await this.populate("assets");

        const assets = this.assets as unknown as AssetHydrated[];
        return assets
          .filter((asset) => asset.retirement)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getRetirementAssetsByCategory(category: Category): Promise<number> {
        await this.populate("assets");
        const assets = this.assets as unknown as AssetHydrated[];
        return assets
          .filter((asset) => asset.retirement && asset.category === category)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

statementSchema.pre("find", function () {
  this.populate("assets");
  this.populate("liabilities");
});

export const Statement: StatementModelType =
  mongoose.models.Statement ||
  mongoose.model<StatementDoc>("Statement", statementSchema);
