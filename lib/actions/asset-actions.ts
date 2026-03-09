"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { AssetForm, assetFormSchema } from "../types/asset-types";
import { parseFormData, validateActionInputs } from "./action-utils";

const assetNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find asset" }],
};

const statementNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find statement" }],
};

export async function createAsset({
  statementId,
  data,
  path,
}: {
  statementId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  await dbConnect();
  const validatedInputs = validateActionInputs({
    statementId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const dataParseResult = parseFormData(data, assetFormSchema);
  if (!dataParseResult.success) {
    return dataParseResult;
  }

  const session = await getValidSession();

  const statementDoc = await Statement.findOne({
    userId: session.user.id,
    _id: inputs.statementId,
  });

  if (!statementDoc) {
    return statementNotFound;
  }

  const assetDoc = await statementDoc.addAsset({
    userId: session.user.id,
    ...dataParseResult.data,
  });

  if (!assetDoc) {
    return {
      success: false,
      errors: [{ path: "root", message: "Could not create asset" }],
    };
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function deleteAsset({
  assetId,
  statementId,
  path,
}: {
  assetId: unknown;
  statementId: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const validatedInputs = validateActionInputs({
    statementId,
    entryId: assetId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const session = await getValidSession();

  const statementDoc = await Statement.findOne({
    userId: session.user.id,
    _id: inputs.statementId,
  });

  if (!statementDoc) {
    return statementNotFound;
  }

  const deleted = await statementDoc.deleteAsset(inputs.entryId);

  if (!deleted) {
    return assetNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function updateAsset({
  assetId,
  statementId,
  data,
  path,
}: {
  assetId: unknown;
  statementId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const validatedInputs = validateActionInputs({
    statementId,
    entryId: assetId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const dataParseResult = parseFormData(data, assetFormSchema);
  if (!dataParseResult.success) {
    return dataParseResult;
  }

  const session = await getValidSession();

  const statementDoc = await Statement.findOne({
    userId: session.user.id,
    _id: inputs.statementId,
  });

  if (!statementDoc) {
    return statementNotFound;
  }

  const assetDoc = await statementDoc.updateAsset(
    inputs.entryId,
    dataParseResult.data
  );

  if (!assetDoc) {
    return assetNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}
