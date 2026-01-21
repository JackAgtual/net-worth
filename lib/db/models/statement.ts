import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import {
  Asset,
  AssetUpdate,
  AssetHydrated,
  AssetDoc,
  Liability,
  LiabilityDoc,
  LiabilityHydrated,
  LiabilityUpdate,
} from "@/lib/db/models";
import { Category, UserItem } from "../../types";

interface StatementDoc extends UserItem {
  year: number;
  lastYearSalary?: number;
  assets: Types.ObjectId[];
  liabilities: Types.ObjectId[];
}

export enum Contributor {
  Self = "Self",
  NonSelf = "Non self",
  All = "All",
}

interface StatementMethods {
  getAssets(): Promise<AssetHydrated[]>;
  getLiabilities(): Promise<LiabilityHydrated[]>;
  getTotalAssetAmount(): Promise<number>;
  getTotalLiabilityAmount(): Promise<number>;
  getNetWorth(): Promise<number>;
  getTotalAssetAmountByCategory(category: Category): Promise<number>;
  getPercentOfAssetsByCategory(category: Category): Promise<number>;
  getContributionAmountByContributor(contributor: Contributor): Promise<number>;
  getContributioPercentOfSalaryByContributor(
    contributor: Contributor
  ): Promise<number | undefined>;
  getLastYearAssetGrowth(): Promise<number>;
  getLastYearAssetGrowthPercentOfSalary(): Promise<number | undefined>;
  getTotalRetirementAssets(): Promise<number>;
  getRetirementAssetsByCategory(category: Category): Promise<number>;
  addLiability(liability: LiabilityDoc): Promise<LiabilityHydrated>;
  deleteLiability(id: Types.ObjectId): Promise<boolean>;
  updateLiability(
    id: Types.ObjectId,
    changes: LiabilityUpdate
  ): Promise<LiabilityHydrated | null>;
  addAsset(asset: AssetDoc): Promise<AssetHydrated>;
  deleteAsset(id: Types.ObjectId): Promise<boolean>;
  updateAsset(
    id: Types.ObjectId,
    changes: AssetUpdate
  ): Promise<AssetHydrated | null>;
}
type StatementModelType = Model<StatementDoc, {}, StatementMethods>;

export type StatementHydrated = HydratedDocument<
  StatementDoc,
  StatementMethods
>;

const required = true;

const statementSchema = new Schema<
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
        await this.populate("assets");
        return this.assets as unknown as AssetHydrated[];
      },
      async getLiabilities(): Promise<LiabilityHydrated[]> {
        await this.populate("liabilities");
        return this.liabilities as unknown as LiabilityHydrated[];
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
      async deleteLiability(id: Types.ObjectId): Promise<boolean> {
        this.liabilities = this.liabilities.filter(
          (liabilityId) => liabilityId !== id
        );

        const deletedDoc = await Liability.findByIdAndDelete(id);
        return !!deletedDoc;
      },
      async updateLiability(
        id: Types.ObjectId,
        changes: LiabilityUpdate
      ): Promise<LiabilityHydrated | null> {
        const liabilityId = this.liabilities.find((el) => el === id);

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
      async deleteAsset(id: Types.ObjectId): Promise<boolean> {
        this.assets = this.assets.filter((assetId) => assetId !== id);

        const deletedDoc = await Asset.findByIdAndDelete(id);
        return !!deletedDoc;
      },
      async updateAsset(
        id: Types.ObjectId,
        changes: AssetUpdate
      ): Promise<AssetHydrated | null> {
        const assetId = this.assets.find((el) => el === id);

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

statementSchema.pre("find", function () {
  this.populate("assets");
  this.populate("liabilities");
});

export const Statement: StatementModelType =
  mongoose.models.Statement ||
  mongoose.model<StatementDoc>("Statement", statementSchema);
