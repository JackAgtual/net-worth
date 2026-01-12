import mongoose, { Model, Schema } from "mongoose";
import { Entry } from "../types";

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

interface Contribution {
  contributions: number;
  selfContribution: boolean;
}

export interface AssetDoc extends Entry {
  category: Category;
  retirement?: boolean;
  amountOneYearAgo?: number;
  contribution?: Contribution;
}

interface AssetVirtuals {
  growthFromAppreciation?: number;
}

type AssetModelType = Model<AssetDoc, {}, {}, AssetVirtuals>;

const required = true;

const contributionSchema = new Schema<Contribution>({
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

    amountOneYearAgo: Number,
    contribution: contributionSchema,
    retirement: Boolean,
    notes: String,
  },
  {
    virtuals: {
      growthFromAppreciation: {
        get() {
          if (this.amountOneYearAgo === undefined) return undefined;

          const { contribution } = this;
          if (contribution === undefined) return undefined;

          return (
            this.amount - this.amountOneYearAgo - contribution.contributions
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
