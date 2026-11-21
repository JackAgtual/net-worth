"use server";

import { revalidatePath } from "next/cache";
import { getValidSessionOrThrow } from "../auth/auth-utils";
import {
  addAssetToStatement,
  deleteAsset,
  updateAsset,
} from "../dal/asset-dal";
import { ActionResponse } from "../types/action-types";
import { AssetForm, assetFormSchema } from "../types/asset-types";
import { parseFormData, validateActionInputs } from "./action-utils";

const assetNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find asset" }],
};

export async function createAssetAction({
  statementId,
  data,
  path,
}: {
  statementId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  await getValidSessionOrThrow();

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

  await addAssetToStatement(inputs.statementId, dataParseResult.data);

  revalidatePath(inputs.path);
  return { success: true };
}

export async function deleteAssetAction({
  assetId,
  path,
}: {
  assetId: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  const validatedInputs = validateActionInputs({
    entryId: assetId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const deleted = deleteAsset(inputs.entryId);

  if (!deleted) {
    return assetNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function updateAssetAction({
  assetId,
  data,
  path,
}: {
  assetId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<AssetForm>> {
  const validatedInputs = validateActionInputs({
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

  const assetDoc = await updateAsset(
    validatedInputs.data.entryId,
    dataParseResult.data
  );

  if (!assetDoc) {
    return assetNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}
