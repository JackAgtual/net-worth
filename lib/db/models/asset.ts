import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Entry } from "../types";

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

interface Contribution {
  amount: number;
  selfContribution: boolean;
}

export interface AssetDoc extends Entry {
  category: Category;
  retirement?: boolean;
  amountOneYearAgo?: number;
  contribution?: Contribution;
  includeInGrowthCalculation?: boolean;
}

export type AssetTestDoc = Omit<AssetDoc, "_id">;

interface AssetVirtuals {
  growthFromAppreciation?: number;
}

export type AssetHydrated = HydratedDocument<AssetDoc, AssetVirtuals>;

type AssetModelType = Model<AssetDoc, {}, {}, AssetVirtuals>;

const required = true;

const contributionSchema = new Schema<Contribution>({
  amount: { type: Number, required },
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

    includeInGrowthCalculation: { type: Boolean, default: false },
    amountOneYearAgo: Number,
    contribution: contributionSchema,
    retirement: Boolean,
    notes: String,
  },
  {
    virtuals: {
      growthFromAppreciation: {
        get() {
          if (!this.amountOneYearAgo) return undefined;

          const contribution = !this.contribution
            ? 0
            : this.contribution.amount;

          return this.amount - this.amountOneYearAgo - contribution;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Asset: AssetModelType =
  mongoose.models.Asset || mongoose.model<AssetDoc>("Asset", assetSchema);
