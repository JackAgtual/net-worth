import mongoose, { model, Schema } from "mongoose";
import {
  LiabilityDoc,
  LiabilityMethods,
  LiabilityModelType,
} from "@/lib/types/liability-types";

const required = true;

const liabilityMongooseSchema = new Schema<
  LiabilityDoc,
  LiabilityModelType,
  LiabilityMethods
>(
  {
    userId: { type: String, required },
    title: { type: String, trim: true, required },
    amount: { type: Number, required },
    amountOneYearAgo: Number,
    paymentsMade: Number,
    notes: String,
  },
  {
    methods: {
      getGrowthFromInterest() {
        if (this.amountOneYearAgo == null) return;

        const paymentsMade = this.paymentsMade == null ? 0 : this.paymentsMade;

        return this.amount - this.amountOneYearAgo + paymentsMade;
      },
    },
  }
);

export const Liability: LiabilityModelType =
  mongoose.models.Liability ||
  model<LiabilityDoc>("Liability", liabilityMongooseSchema);
