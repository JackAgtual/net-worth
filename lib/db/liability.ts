import mongoose, { Model, model, Schema } from "mongoose";
import { Entry as LiabilityDoc } from "./types";

type LiabilityModelType = Model<LiabilityDoc>;

const required = true;

const liabilitySchema = new Schema<LiabilityDoc, LiabilityModelType>({
  title: { type: String, trim: true, required },
  amount: { type: Number, required },
});

export const Liability: LiabilityModelType =
  mongoose.models.Liability ||
  model<LiabilityDoc>("Liability", liabilitySchema);
