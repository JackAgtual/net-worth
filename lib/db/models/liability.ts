import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { Entry } from "../types";

export interface LiabilityDoc extends Entry {}

export type LiabilityHydrated = HydratedDocument<LiabilityDoc>;

export type LiabilityUpdate = Partial<LiabilityDoc>;

type LiabilityModelType = Model<LiabilityDoc>;

const required = true;

const liabilitySchema = new Schema<LiabilityDoc, LiabilityModelType>({
  title: { type: String, trim: true, required },
  amount: { type: Number, required },
  notes: String,
});

export const Liability: LiabilityModelType =
  mongoose.models.Liability ||
  model<LiabilityDoc>("Liability", liabilitySchema);
