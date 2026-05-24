import { HydratedDocument, Model } from "mongoose";
import { Control } from "react-hook-form";
import z from "zod";
import { entrySchema } from "./types";

export const liabilitySchema = entrySchema.extend({
  amountOneYearAgo: z.number().nullable().optional(),
  paymentsMade: z.number().nullable().optional(),
});

export const liabilityFormSchema = liabilitySchema.omit({ userId: true });

export type LiabilityForm = z.infer<typeof liabilityFormSchema>;

export type LiabilityFormControl = Control<LiabilityForm>;

export type LiabilityDoc = z.infer<typeof liabilitySchema>;

export type LiabilityUpdate = Partial<LiabilityForm>;

export type LiabilityMethods = {
  getGrowthFromInterest(): number | undefined;
};

export type LiabilityHydrated = HydratedDocument<
  LiabilityDoc,
  LiabilityMethods
>;

export type LiabilityModelType = Model<LiabilityDoc, {}, LiabilityMethods>;
