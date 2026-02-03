"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Asset } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { AssetForm, assetFormSchema } from "../types/asset-types";
import { getErrors, validateId, validatePath } from "./action-utils";

const assetNotFound: ActionResponse<AssetForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find asset" }],
};

export async function deleteAsset(
  id: unknown,
  path: unknown
): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const idParseResult = validateId(id);
  const pathParseResult = validatePath(path);
  const session = await getValidSession();

  const assetDoc = await Asset.findOneAndDelete({
    _id: idParseResult.data,
    userId: session.user.id,
  });

  if (!assetDoc) {
    return assetNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}

export async function updateAsset(
  id: unknown,
  data: unknown,
  path: unknown
): Promise<ActionResponse<AssetForm>> {
  await dbConnect();

  const idParseResult = validateId(id);
  const pathParseResult = validatePath(path);

  const dataParseResult = assetFormSchema.safeParse(data);
  if (!dataParseResult.success) {
    const errors = getErrors<AssetForm>(dataParseResult.error.issues);
    return { success: false, errors };
  }

  const session = await getValidSession();

  const assetDoc = await Asset.findOneAndUpdate(
    {
      _id: idParseResult.data,
      userId: session.user.id,
    },
    dataParseResult.data
  );

  if (!assetDoc) {
    return assetNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}
