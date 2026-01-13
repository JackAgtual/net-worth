import mongoose, { Model, Schema, Types } from "mongoose";
import { MongoDocument } from "../types";
import { Category } from "@/lib/db/models/asset";
import { AssetDoc, LiabilityDoc } from "@/lib/db/models";

interface StatementDoc extends MongoDocument {
  year: number;
  lastYearSalary: number;
  assets: Types.ObjectId[];
  liabilities: Types.ObjectId[];
}

interface StatementVirtuals {
  lastYearLiquidAssetGrowth?: number;
  liquidAssetGrowthPercentOfSalary?: number;

  selfContribution?: number;
  totalContribution?: number;
  selfContributionsPercentOfSalary?: number;
  totalContributionsPercentOfSalary?: number;

  totalRetirementAssets?: number;
  taxFreeRetirementAssets?: number;
  taxDeferredRetirementAssets?: number;
}

interface StatementMethods {
  getTotalAssetAmount(): Promise<number>;
  getTotalLiabilityAmount(): Promise<number>;
  getNetWorth(): Promise<number>;
  getTotalAmountByCategory(category: Category): Promise<number>;
  getPercentOfAssetsByCategory(category: Category): Promise<number>;
}
type StatementModelType = Model<
  StatementDoc,
  {},
  StatementMethods,
  StatementVirtuals
>;

const required = true;

const statementSchema = new Schema<
  StatementDoc,
  StatementModelType,
  StatementMethods,
  {},
  StatementVirtuals
>(
  {
    year: { type: Number, required },
    lastYearSalary: { type: Number, required },
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
    virtuals: {
      lastYearLiquidAssetGrowth: {
        get() {
          // include if last year amount is not undefined
          return 1;
        },
      },
      liquidAssetGrowthPercentOfSalary: {
        get() {
          return 1;
        },
      },

      selfContribution: {
        get() {
          return 1;
        },
      },
      totalContribution: {
        get() {
          return 1;
        },
      },
      selfContributionsPercentOfSalary: {
        get() {
          return 1;
        },
      },
      totalContributionsPercentOfSalary: {
        get() {
          return 1;
        },
      },

      totalRetirementAssets: {
        get() {
          return 1;
        },
      },
      taxFreeRetirementAssets: {
        // make instance method
        get() {
          return 1;
        },
      },
      taxDeferredRetirementAssets: {
        // make instance method
        get() {
          return 1;
        },
      },
    },
    methods: {
      async getTotalAssetAmount(): Promise<number> {
        await this.populate("assets");
        const assets = this.assets as unknown as AssetDoc[];
        return assets.reduce((acc, cur) => acc + cur.amount, 0);
      },
      async getTotalLiabilityAmount(): Promise<number> {
        await this.populate("liabilities");
        const liabilities = this.liabilities as unknown as LiabilityDoc[];
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

        const assets = this.assets as unknown as AssetDoc[];
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
