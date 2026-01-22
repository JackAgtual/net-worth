import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { z } from "zod";
import { entrySchema } from "@/types/types";

export const liabilitySchema = entrySchema;

export type LiabilityDoc = z.infer<typeof liabilitySchema>;

export type LiabilityHydrated = HydratedDocument<LiabilityDoc>;

export type LiabilityUpdate = Partial<LiabilityDoc>;

type LiabilityModelType = Model<LiabilityDoc>;

const required = true;

const liabilityMongooseSchema = new Schema<LiabilityDoc, LiabilityModelType>({
  userId: { type: String, required },
  title: { type: String, trim: true, required },
  amount: { type: Number, required },
  notes: String,
});

export const Liability: LiabilityModelType =
  mongoose.models.Liability ||
  model<LiabilityDoc>("Liability", liabilityMongooseSchema);
