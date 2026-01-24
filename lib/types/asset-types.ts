import z from "zod";
import { Category, entrySchema } from "@/types/types";
import { HydratedDocument, Model } from "mongoose";

const contributionSchema = z.object({
  self: z.number().optional(),
  nonSelf: z.number().optional(),
});

export type Contribution = z.infer<typeof contributionSchema>;

export const assetSchema = entrySchema.extend({
  category: z.enum(Category),
  retirement: z.boolean().optional(),
  amountOneYearAgo: z.number().optional(),
  contribution: contributionSchema.optional(),
  includeInGrowthCalculation: z.boolean().optional(),
});

export type AssetDoc = z.infer<typeof assetSchema>;

export type AssetUpdate = Partial<AssetDoc>;

export type AssetMethods = {
  getTotalContributions(): number;
  getGrowthFromAppreciation(): number | undefined;
};

export type AssetHydrated = HydratedDocument<AssetDoc, AssetMethods>;

export type AssetModelType = Model<AssetDoc, {}, AssetMethods>;
