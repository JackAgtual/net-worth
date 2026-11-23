import { AssetCategory } from "@/generated/prisma/enums";
import { AssetInputSchema } from "@/generated/prisma/schemas";
import z from "zod";

export const assetFormSchema = AssetInputSchema.omit({ statement: true });

export type AssetForm = z.infer<typeof assetFormSchema>;

// Needed as empty default values for liability form
export const emptyAsset = {
  title: "",
  amount: "" as unknown as number,
  category: "" as AssetCategory,
  includeInGrowthCalculation: false,
  retirement: false,
  amountOneYearAgo: null,
  nonSelfContributions: null,
  notes: null,
  selfContributions: null,
  withdrawals: null,
} as AssetForm;
