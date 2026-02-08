import { z } from "zod";
import { Category, Contributor, UserItem, userItemSchema } from "@/types/types";
import {
  AssetDoc,
  assetFormSchema,
  AssetHydrated,
  assetSchema,
  AssetUpdate,
} from "./asset-types";
import {
  LiabilityDoc,
  liabilityFormSchema,
  LiabilityHydrated,
  liabilitySchema,
  LiabilityUpdate,
} from "./liability-types";
import { HydratedDocument, Model, Types } from "mongoose";
import { Control } from "react-hook-form";

const statementSchemaBase = userItemSchema.extend({
  year: z.int(),
  lastYearSalary: z.number().optional(),
  assets: z.array(assetSchema),
  liabilities: z.array(liabilitySchema),
});

export const statementSchema = statementSchemaBase.extend({
  assets: z.array(assetSchema),
  liabilities: z.array(liabilitySchema),
});

export const statementFormSchema = statementSchema
  .extend({
    assets: z.array(assetFormSchema).optional(),
    liabilities: z.array(liabilityFormSchema).optional(),
  })
  .omit({ userId: true });

export type StatementForm = z.infer<typeof statementFormSchema>;

export type StatementFormControl = Control<StatementForm>;

// not infering type form zod because I need to reference ObjectId
export type StatementDoc = Omit<
  z.infer<typeof statementSchema>,
  "assets" | "liabilities"
> & {
  assets: Types.Array<Types.ObjectId>;
  liabilities: Types.Array<Types.ObjectId>;
};

export type StatementMethods = {
  getAssets(): Promise<AssetHydrated[]>;
  getLiabilities(): Promise<LiabilityHydrated[]>;
  getTotalAssetAmount(): Promise<number>;
  getTotalLiabilityAmount(): Promise<number>;
  getNetWorth(): Promise<number>;
  getTotalAssetAmountByCategory(category: Category): Promise<number>;
  getPercentOfAssetsByCategory(category: Category): Promise<number>;
  getContributionAmountByContributor(contributor: Contributor): Promise<number>;
  getContributioPercentOfSalaryByContributor(
    contributor: Contributor
  ): Promise<number | undefined>;
  getLastYearAssetGrowth(): Promise<number>;
  getLastYearAssetGrowthPercentOfSalary(): Promise<number | undefined>;
  getTotalRetirementAssets(): Promise<number>;
  getRetirementAssetsByCategory(category: Category): Promise<number>;
  addLiability(liability: LiabilityDoc): Promise<LiabilityHydrated>;
  deleteLiability(id: Types.ObjectId | string): Promise<boolean>;
  updateLiability(
    id: Types.ObjectId,
    changes: LiabilityUpdate
  ): Promise<LiabilityHydrated | null>;
  addAsset(asset: AssetDoc): Promise<AssetHydrated>;
  deleteAsset(id: Types.ObjectId | string): Promise<boolean>;
  updateAsset(
    id: Types.ObjectId,
    changes: AssetUpdate
  ): Promise<AssetHydrated | null>;
};

export type StatementModelType = Model<StatementDoc, {}, StatementMethods>;

export type StatementHydrated = HydratedDocument<
  StatementDoc,
  StatementMethods
>;
