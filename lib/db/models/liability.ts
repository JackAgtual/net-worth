import mongoose, { model, Schema } from "mongoose";
import { LiabilityDoc, LiabilityModelType } from "@/lib/types/liability-types";

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
