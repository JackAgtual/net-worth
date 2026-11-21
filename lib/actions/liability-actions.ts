"use server";

import { revalidatePath } from "next/cache";
import {
  addLiabilityToStatement,
  deleteLiability,
  updateLiability,
} from "../dal/liability-dal";
import { ActionResponse } from "../types/action-types";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { parseFormData, validateActionInputs } from "./action-utils";

const liabilityNotFound: ActionResponse<LiabilityForm> = {
  success: false,
  errors: [{ path: "root", message: "Could not find liability" }],
};

export async function createLiabilityAction({
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

export async function deleteLiabilityAction({
  liabilityId,
  path,
}: {
  liabilityId: unknown;
  path: unknown;
}): Promise<ActionResponse<LiabilityForm>> {
  const validatedInputs = validateActionInputs({
    entryId: liabilityId,
    path,
  });

  if (!validatedInputs.success) {
    return validatedInputs;
  }

  const inputs = validatedInputs.data;

  const deleted = await deleteLiability(inputs.entryId);

  if (!deleted) {
    return liabilityNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}

export async function updateLiabilityAction({
  liabilityId,
  data,
  path,
}: {
  liabilityId: unknown;
  data: unknown;
  path: unknown;
}): Promise<ActionResponse<LiabilityForm>> {
  const validatedInputs = validateActionInputs({
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

  const liabilityDoc = updateLiability(inputs.entryId, dataParseResult.data);

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(inputs.path);
  return { success: true };
}
