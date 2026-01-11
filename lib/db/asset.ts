import mongoose, { Model, Schema, Types } from "mongoose";

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

interface Document {
  _id: Types.ObjectId;
}

interface AssetDoc extends Document {
  title: string;
  category: Category;
  amount: number;

  retirement?: boolean;
  amountOneYearAgo?: number;
  contributions?: number;
  selfContribution?: boolean;
  notes?: string;
}

interface AssetVirtuals {
  growthFromAppreciation?: number;
}

type AssetModelType = Model<AssetDoc, {}, {}, AssetVirtuals>;

const required = true;

const assetSchema = new Schema<AssetDoc, AssetModelType, {}, {}, AssetVirtuals>(
  {
    title: { type: String, trim: true, required },
    category: {
      type: String,
      enum: Object.values(Category),
      required,
    },
    amount: { type: Number, required },

    retirement: Boolean,
    amountOneYearAgo: Number,
    contributions: Number,
    selfContribution: Boolean,
    notes: String,
  },
  {
    virtuals: {
      growthFromAppreciation: {
        get() {
          if (
            typeof this.amountOneYearAgo !== "number" ||
            typeof this.contributions !== "number"
          ) {
            return undefined;
          }

          return this.amount - this.amountOneYearAgo - this.contributions;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Asset: AssetModelType =
  mongoose.models.Asset || mongoose.model<AssetDoc>("Asset", assetSchema);
