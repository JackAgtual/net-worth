"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { parseFormData, validateActionInputs } from "./action-utils";

const liabilityNotFound: ActionResponse<LiabilityForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find liability" }],
};

const statementNotFound: ActionResponse<LiabilityForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find statement" }],
};

export async function createLiability({
  statementId,
  data,
  path,
}: {
  statementId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<LiabilityForm>> {
  await dbConnect();

  const validatedInputs = validateActionInputs({
    statementId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const dataParseResult = parseFormData(data, liabilityFormSchema);

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

  const liabilityDoc = await statementDoc.addLiability({
    userId: session.user.id,
    ...dataParseResult.data,
  });

  if (!liabilityDoc) {
    return {
      success: false,
      errors: [{ path: "root", message: "Could not create liability" }],
    };
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function deleteLiability({
  liabilityId,
  statementId,
  path,
}: {
  liabilityId: unknown;
  statementId: unknown;
  path: unknown;
}): Promise<ActionResponse<LiabilityForm>> {
  await dbConnect();

  const validatedInputs = validateActionInputs({
    statementId,
    entryId: liabilityId,
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

  const deleted = await statementDoc.deleteLiability(inputs.entryId);

  if (!deleted) {
    return liabilityNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function updateLiability({
  liabilityId,
  statementId,
  data,
  path,
}: {
  liabilityId: unknown;
  statementId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<LiabilityForm>> {
  await dbConnect();

  const validatedInputs = validateActionInputs({
    statementId,
    entryId: liabilityId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const dataParseResult = parseFormData(data, liabilityFormSchema);

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

  const liabilityDoc = await statementDoc.updateLiability(
    inputs.entryId,
    dataParseResult.data
  );

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}
