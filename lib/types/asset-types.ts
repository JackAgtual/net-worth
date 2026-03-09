import z from "zod";
import { Category, entrySchema } from "@/types/types";
import { HydratedDocument, Model } from "mongoose";

const contributionSchema = z.object({
  self: z.number().nullable().optional(),
  nonSelf: z.number().nullable().optional(),
});

export type Contribution = z.infer<typeof contributionSchema>;
export const assetSchema = entrySchema.extend({
  category: z.enum(Category),
  retirement: z.boolean().nullable().optional(),
  amountOneYearAgo: z.number().nullable().optional(),
  contribution: contributionSchema.optional(),
  includeInGrowthCalculation: z.boolean().nullable().optional(),
});

export const assetFormSchema = assetSchema.omit({ userId: true });

export type AssetForm = z.infer<typeof assetFormSchema>;

export type AssetDoc = z.infer<typeof assetSchema>;

export type AssetUpdate = Partial<AssetForm>;

export type AssetMethods = {
  getTotalContributions(): number;
  getGrowthFromAppreciation(): number | undefined;
};

export type AssetHydrated = HydratedDocument<AssetDoc, AssetMethods>;

export type AssetModelType = Model<AssetDoc, {}, AssetMethods>;
