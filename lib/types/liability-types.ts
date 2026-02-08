import z from "zod";
import { entrySchema } from "./types";
import { HydratedDocument, Model } from "mongoose";
import { Control } from "react-hook-form";

export const liabilitySchema = entrySchema;

export const liabilityFormSchema = liabilitySchema.omit({ userId: true });

export type LiabilityForm = z.infer<typeof liabilityFormSchema>;

export type LiabilityFormControl = Control<LiabilityForm>;

export type LiabilityDoc = z.infer<typeof liabilitySchema>;

export type LiabilityHydrated = HydratedDocument<LiabilityDoc>;

export type LiabilityUpdate = Partial<LiabilityForm>;

export type LiabilityModelType = Model<LiabilityDoc>;
