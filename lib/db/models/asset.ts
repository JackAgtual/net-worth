import mongoose, { Model, Schema } from "mongoose";
import { Entry } from "../types";

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

interface DeltaAmount {
  amountOneYearAgo: number;
  contributions: number;
  selfContribution: boolean;
}

export interface AssetDoc extends Entry {
  category: Category;
  retirement?: boolean;
  deltaAmount?: DeltaAmount;
}

interface AssetVirtuals {
  growthFromAppreciation?: number;
}

type AssetModelType = Model<AssetDoc, {}, {}, AssetVirtuals>;

const required = true;

const deltaAmountSchema = new Schema<DeltaAmount>({
  amountOneYearAgo: { type: Number, required },
  contributions: { type: Number, required },
  selfContribution: { type: Boolean, required },
});

const assetSchema = new Schema<AssetDoc, AssetModelType, {}, {}, AssetVirtuals>(
  {
    title: { type: String, trim: true, required },
    category: {
      type: String,
      enum: Object.values(Category),
      required,
    },
    amount: { type: Number, required },

    deltaAmount: deltaAmountSchema,
    retirement: Boolean,
    notes: String,
  },
  {
    virtuals: {
      growthFromAppreciation: {
        get() {
          const { deltaAmount } = this;
          if (deltaAmount === undefined) return undefined;

          return (
            this.amount -
            deltaAmount.amountOneYearAgo -
            deltaAmount.contributions
          );
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Asset: AssetModelType =
  mongoose.models.Asset || mongoose.model<AssetDoc>("Asset", assetSchema);
