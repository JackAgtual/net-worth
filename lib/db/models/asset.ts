import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { z } from "zod";
import { Category, Entry, entrySchema } from "@/types/types";

const contributionSchema = z.object({
  self: z.number().optional(),
  nonSelf: z.number().optional(),
});

type Contribution = z.infer<typeof contributionSchema>;

export const assetSchema = entrySchema.extend({
  category: z.enum(Category),
  retirement: z.boolean().optional(),
  amountOneYearAgo: z.number().optional(),
  contribution: contributionSchema.optional(),
  includeInGrowthCalculation: z.boolean().optional(),
});

export type AssetDoc = z.infer<typeof assetSchema>;

export type AssetUpdate = Partial<AssetDoc>;

type AssetMethods = {
  getTotalContributions(): number;
  getGrowthFromAppreciation(): number | undefined;
};

export type AssetHydrated = HydratedDocument<AssetDoc, AssetMethods>;

type AssetModelType = Model<AssetDoc, {}, AssetMethods>;

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
