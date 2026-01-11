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
  totalAssets?: number;
  totalLiabilities?: number;
  netWorth?: number;

  cashAmount?: number;
  afterTaxAmount?: number;
  taxFreeAmount?: number;
  taxDeferredAmount?: number;
  propertyAmount?: number;

  cashPercent?: number;
  afterTaxPercent?: number;
  taxFreePercent?: number;
  taxDeferredPercent?: number;
  propertyPercent?: number;

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

type StatementModelType = Model<StatementDoc, {}, {}, StatementVirtuals>;

const required = true;

const statementSchema = new Schema<
  StatementDoc,
  StatementModelType,
  {},
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
      totalAssets: {
        get() {
          if (!this.populated("assets")) {
            console.error("assets not populated");
            return undefined;
          }

          const assets = this.assets as unknown as AssetDoc[];
          return assets.reduce((acc, cur) => acc + cur.amount, 0);
        },
      },
      totalLiabilities: {
        get() {
          if (!this.populated("liabilities")) {
            console.error("liabilities not populated");
            return undefined;
          }
          const liabilities = this.liabilities as unknown as LiabilityDoc[];
          return liabilities.reduce((acc, cur) => acc + cur.amount, 0);
        },
      },
      netWorth: {
        get(this: StatementDoc & StatementVirtuals) {
          if (typeof this.totalAssets !== "number") {
            console.error("Undefined total assets");
            return undefined;
          }
          if (typeof this.totalLiabilities !== "number") {
            throw new Error("Undefined total liabilities");
          }

          return this.totalAssets - this.totalLiabilities;
        },
      },

      cashAmount: {
        get() {
          return 1;
        },
      },
      afterTaxAmount: {
        get() {
          return 1;
        },
      },
      taxFreeAmount: {
        get() {
          return 1;
        },
      },
      taxDeferredAmount: {
        get() {
          return 1;
        },
      },
      propertyAmount: {
        get() {
          return 1;
        },
      },

      cashPercent: {
        get() {
          return 1;
        },
      },
      afterTaxPercent: {
        get() {
          return 1;
        },
      },
      taxFreePercent: {
        get() {
          return 1;
        },
      },
      taxDeferredPercent: {
        get() {
          return 1;
        },
      },
      propertyPercent: {
        get() {
          return 1;
        },
      },

      lastYearLiquidAssetGrowth: {
        get() {
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
        get() {
          return 1;
        },
      },
      taxDeferredRetirementAssets: {
        get() {
          return 1;
        },
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
