import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Category, Entry } from "../types";

interface Contribution {
  self: number;
  nonSelf: number;
}

export interface AssetDoc extends Entry {
  category: Category;
  retirement?: boolean;
  amountOneYearAgo?: number;
  contribution?: Contribution;
  includeInGrowthCalculation?: boolean;
}
export type AssetUpdate = Partial<AssetDoc>;

interface AssetVirtuals {
  growthFromAppreciation?: number;
  totalContributions: number;
}

export type AssetHydrated = HydratedDocument<AssetDoc, AssetVirtuals>;

type AssetModelType = Model<AssetDoc, {}, {}, AssetVirtuals>;

const required = true;

const contributionSchema = new Schema<Contribution>({
  self: { type: Number, required },
  nonSelf: { type: Number, required },
});

const assetSchema = new Schema<AssetDoc, AssetModelType, {}, {}, AssetVirtuals>(
  {
    userId: { type: String, required },
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
      totalContributions: {
        get() {
          const { contribution } = this;
          if (!contribution) return 0;

          return contribution.self + contribution.nonSelf;
        },
      },
      growthFromAppreciation: {
        get() {
          if (!this.amountOneYearAgo) return undefined;

          const contribution = !this.contribution
            ? 0
            : this.contribution.self + this.contribution.nonSelf;

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
