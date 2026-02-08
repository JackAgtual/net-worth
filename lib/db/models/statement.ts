import { Asset, Liability } from "@/lib/db/models";
import { AssetDoc, AssetHydrated, AssetUpdate } from "@/lib/types/asset-types";
import {
  LiabilityDoc,
  LiabilityHydrated,
  LiabilityUpdate,
} from "@/lib/types/liability-types";
import {
  StatementDoc,
  StatementMethods,
  StatementModelType,
} from "@/lib/types/statement-types";
import { Category, Contributor } from "@/types/types";
import mongoose, { Schema, Types } from "mongoose";

const required = true;

const statementMongooseSchema = new Schema<
  StatementDoc,
  StatementModelType,
  StatementMethods
>(
  {
    userId: { type: String, required },
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
      async getAssets(): Promise<AssetHydrated[]> {
        const statement = await this.populate<{ assets: AssetHydrated[] }>(
          "assets"
        );
        return statement.assets;
      },
      async getLiabilities(): Promise<LiabilityHydrated[]> {
        const statement = await this.populate<{
          liabilities: LiabilityHydrated[];
        }>("liabilities");
        return statement.liabilities;
      },
      async getTotalAssetAmount(): Promise<number> {
        const assets = await this.getAssets();
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
      async getTotalAssetAmountByCategory(category: Category): Promise<number> {
        const assets = await this.getAssets();
        return assets
          .filter((asset) => asset.category === category)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getPercentOfAssetsByCategory(category: Category): Promise<number> {
        const totalAmountInCategory = await this.getTotalAssetAmountByCategory(
          category
        );
        const totalAssets = await this.getTotalAssetAmount();
        return totalAmountInCategory / totalAssets;
      },
      async getContributionAmountByContributor(
        contributor: Contributor
      ): Promise<number> {
        const assets = await this.getAssets();
        return assets.reduce((acc, cur) => {
          if (!cur.contribution) return acc;
          switch (contributor) {
            case Contributor.All:
              return acc + cur.getTotalContributions();
            case Contributor.Self:
              return acc + (cur.contribution?.self ?? 0);
            case Contributor.NonSelf:
              return acc + (cur.contribution?.nonSelf ?? 0);
            default:
              return acc;
          }
        }, 0);
      },
      async getContributioPercentOfSalaryByContributor(
        contributor: Contributor
      ): Promise<number | undefined> {
        if (!this.lastYearSalary) return undefined;
        const contributionAmount =
          await this.getContributionAmountByContributor(contributor);
        return contributionAmount / this.lastYearSalary;
      },
      async getLastYearAssetGrowth(): Promise<number> {
        const assets = await this.getAssets();
        return assets
          .filter((asset) => {
            return (
              asset.includeInGrowthCalculation === true &&
              asset.amountOneYearAgo !== undefined
            );
          })
          .reduce(
            (acc, cur) => acc + (cur.getGrowthFromAppreciation() ?? 0),
            0
          );
      },
      async getLastYearAssetGrowthPercentOfSalary(): Promise<
        number | undefined
      > {
        if (!this.lastYearSalary) return undefined;

        const lastYearAssetGrowth = await this.getLastYearAssetGrowth();
        return lastYearAssetGrowth / this.lastYearSalary;
      },
      async getTotalRetirementAssets(): Promise<number> {
        const assets = await this.getAssets();
        return assets
          .filter((asset) => asset.retirement)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getRetirementAssetsByCategory(category: Category): Promise<number> {
        const assets = await this.getAssets();
        return assets
          .filter((asset) => asset.retirement && asset.category === category)
          .reduce((acc, cur) => acc + cur.amount, 0);
      },
      async addLiability(
        liabilityParams: LiabilityDoc
      ): Promise<LiabilityHydrated> {
        const liability = await Liability.create(liabilityParams);
        this.liabilities.push(liability._id);
        return liability;
      },
      async deleteLiability(id: Types.ObjectId | string): Promise<boolean> {
        const deletedDoc = await Liability.findByIdAndDelete(id);
        if (!deletedDoc) return false;
        this.liabilities.pull({ _id: deletedDoc._id });
        await this.save();
        return true;
      },
      async updateLiability(
        id: Types.ObjectId | string,
        changes: LiabilityUpdate
      ): Promise<LiabilityHydrated | null> {
        const liabilityId = this.liabilities.find(
          (el) => el.toString() === id.toString()
        );

        if (!liabilityId) return null;

        const liability = await Liability.findById(id);

        if (!liability) return null;

        Object.assign(liability, changes);
        await liability.save();
        return liability;
      },
      async addAsset(asset: AssetDoc): Promise<AssetHydrated> {
        const createdAsset = await Asset.create(asset);
        this.assets.push(createdAsset._id);
        return createdAsset;
      },
      async deleteAsset(id: Types.ObjectId | string): Promise<boolean> {
        const deletedDoc = await Asset.findByIdAndDelete(id);
        if (!deletedDoc) return false;

        this.assets.pull({ _id: deletedDoc._id });
        await this.save();
        return true;
      },
      async updateAsset(
        id: Types.ObjectId | string,
        changes: AssetUpdate
      ): Promise<AssetHydrated | null> {
        const assetId = this.assets.find(
          (el) => el.toString() === id.toString()
        );

        if (!assetId) return null;

        const asset = await Asset.findById(id);

        if (!asset) return null;

        Object.assign(asset, changes);
        await asset.save();
        return asset;
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

statementMongooseSchema.pre("find", function () {
  this.populate("assets");
  this.populate("liabilities");
});

export const Statement: StatementModelType =
  mongoose.models.Statement ||
  mongoose.model<StatementDoc>("Statement", statementMongooseSchema);
