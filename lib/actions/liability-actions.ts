"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Liability } from "../db/models";
import dbConnect from "../db/mongodb";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { ActionResponse } from "../types/action-types";
import { getErrors, validateId, validatePath } from "./action-utils";

const liabilityNotFound: ActionResponse<LiabilityForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find liability" }],
};

export async function deleteLiability(
  id: unknown,
  path: unknown
): Promise<ActionResponse<LiabilityForm>> {
  await dbConnect();

  const idParseResult = validateId(id);
  const pathParseResult = validatePath(path);
  const session = await getValidSession();

  const liabilityDoc = await Liability.findOneAndDelete({
    _id: idParseResult.data,
    userId: session.user.id,
  });

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}

export async function updateLiability(
  id: unknown,
  data: unknown,
  path: unknown
): Promise<ActionResponse<LiabilityForm>> {
  await dbConnect();

  const idParseResult = validateId(id);
  const pathParseResult = validatePath(path);

  const dataParseResult = liabilityFormSchema.safeParse(data);
  if (!dataParseResult.success) {
    const errors = getErrors<LiabilityForm>(dataParseResult.error.issues);
    return { success: false, errors };
  }

  const session = await getValidSession();

  const liabilityDoc = await Liability.findOneAndUpdate(
    { _id: idParseResult.data, userId: session.user.id },
    dataParseResult.data
  );

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}
