import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Category, Entry } from "@/types/types";

type Contribution = {
  self?: number;
  nonSelf?: number;
};

export type AssetDoc = Entry & {
  category: Category;
  retirement?: boolean;
  amountOneYearAgo?: number;
  contribution?: Contribution;
  includeInGrowthCalculation?: boolean;
};
export type AssetUpdate = Partial<AssetDoc>;

type AssetMethods = {
  getTotalContributions(): number;
  getGrowthFromAppreciation(): number | undefined;
};

export type AssetHydrated = HydratedDocument<AssetDoc, AssetMethods>;

type AssetModelType = Model<AssetDoc, {}, AssetMethods>;

const required = true;

const contributionSchema = new Schema<Contribution>({
  self: { type: Number, required },
  nonSelf: { type: Number, required },
});

const assetSchema = new Schema<AssetDoc, AssetModelType, AssetMethods>(
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
    methods: {
      getTotalContributions(): number {
        const { contribution } = this;
        if (!contribution) return 0;

        return (contribution.self ?? 0) + (contribution.nonSelf ?? 0);
      },
      getGrowthFromAppreciation(): number | undefined {
        if (!this.amountOneYearAgo) return undefined;

        return (
          this.amount - this.amountOneYearAgo - this.getTotalContributions()
        );
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Asset: AssetModelType =
  mongoose.models.Asset || mongoose.model<AssetDoc>("Asset", assetSchema);
