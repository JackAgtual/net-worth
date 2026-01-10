import mongoose from "mongoose";
const { Schema } = mongoose;

const assetSchema = new Schema({
  title: String,
  amount: Number,
});

export const Asset = mongoose.model("Asset", assetSchema);
