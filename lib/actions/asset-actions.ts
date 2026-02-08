"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { AssetForm, assetFormSchema } from "../types/asset-types";
import { getErrors, validateId, validatePath } from "./action-utils";

const assetNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find asset" }],
};

const statementNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find statement" }],
};

// export async function createAsset(
//   data: unknown,
//   path: unknown
// ): Promise<ActionResponse<AssetForm>> {
//   await dbConnect();
//   const pathParseResult = validatePath(path);

//   const dataParseResult = assetFormSchema.safeParse(data);
//   if (!dataParseResult.success) {
//     const errors = getErrors<AssetForm>(dataParseResult.error.issues);
//     return { success: false, errors };
//   }

//   const session = await getValidSession();

//   const assetDoc = await Asset.create({
//     userId: session.user.id,
//     ...dataParseResult.data,
//   });

//   if (!assetDoc) {
//     return {
//       success: false,
//       errors: [{ path: "root", message: "Something went wrong" }],
//     };
//   }

//   revalidatePath(pathParseResult.data);
//   return { success: true };
// }

export async function deleteAsset(
  assetId: unknown,
  statementId: unknown,
  path: unknown
): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const assetIdParseResult = validateId(assetId);
  const statementIdParseResult = validateId(statementId);
  const pathParseResult = validatePath(path);
  const session = await getValidSession();

  const statementDoc = await Statement.findOne({
    userId: session.user.id,
    _id: statementIdParseResult.data,
  });

  if (!statementDoc) {
    return statementNotFound;
  }

  const deleted = await statementDoc.deleteAsset(assetIdParseResult.data);

  if (!deleted) {
    return assetNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}

export async function updateAsset(
  assetId: unknown,
  statementId: unknown,
  data: unknown,
  path: unknown
): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const assetIdParseResult = validateId(assetId);
  const statementIdParseResult = validateId(statementId);
  const pathParseResult = validatePath(path);

  const dataParseResult = assetFormSchema.safeParse(data);
  if (!dataParseResult.success) {
    const errors = getErrors<AssetForm>(dataParseResult.error.issues);
    return { success: false, errors };
  }

  const session = await getValidSession();

  const statementDoc = await Statement.findOne({
    userId: session.user.id,
    _id: statementIdParseResult.data,
  });

  if (!statementDoc) {
    return statementNotFound;
  }

  const assetDoc = await statementDoc.updateAsset(
    assetIdParseResult.data,
    dataParseResult.data
  );

  if (!assetDoc) {
    return assetNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}
