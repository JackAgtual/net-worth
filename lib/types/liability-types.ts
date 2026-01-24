import z from "zod";
import { entrySchema } from "./types";
import { HydratedDocument, Model } from "mongoose";

export const liabilitySchema = entrySchema;

export type LiabilityDoc = z.infer<typeof liabilitySchema>;

export type LiabilityHydrated = HydratedDocument<LiabilityDoc>;

export type LiabilityUpdate = Partial<LiabilityDoc>;

export type LiabilityModelType = Model<LiabilityDoc>;
