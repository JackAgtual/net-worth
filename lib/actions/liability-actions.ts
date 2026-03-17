"use server";

import { revalidatePath } from "next/cache";
import {
  addLiabilityToStatement,
  removeLiabilityFromStatement,
  updateLiabilityOnStatement,
} from "../dal/liability-dal";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { parseFormData, validateActionInputs } from "./action-utils";

const liabilityNotFound: ActionResponse<LiabilityForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find liability" }],
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

  const liabilityDoc = await addLiabilityToStatement(
    inputs.statementId,
    dataParseResult.data
  );

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
  const validatedInputs = validateActionInputs({
    statementId,
    entryId: liabilityId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const deleted = await removeLiabilityFromStatement(
    inputs.statementId,
    inputs.entryId
  );

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

  const liabilityDoc = updateLiabilityOnStatement(
    inputs.statementId,
    inputs.entryId,
    dataParseResult.data
  );

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}
