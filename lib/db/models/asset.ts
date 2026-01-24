import mongoose, { Schema } from "mongoose";
import { Category } from "@/types/types";
import {
  AssetDoc,
  AssetMethods,
  AssetModelType,
  Contribution,
} from "@/lib/types/asset-types";

const required = true;

const contributionMongooseSchema = new Schema<Contribution>({
  self: { type: Number, required },
  nonSelf: { type: Number, required },
});

const assetMongooseSchema = new Schema<AssetDoc, AssetModelType, AssetMethods>(
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
    contribution: contributionMongooseSchema,
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
  mongoose.models.Asset ||
  mongoose.model<AssetDoc>("Asset", assetMongooseSchema);
