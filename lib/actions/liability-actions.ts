"use server";

import { revalidatePath } from "next/cache";
import { getValidSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { getErrors, validateId, validatePath } from "./action-utils";

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

  const statementIdParseResult = validateId(statementId);
  const pathParseResult = validatePath(path);

  const dataParseResult = liabilityFormSchema.safeParse(data);
  if (!dataParseResult.success) {
    const errors = getErrors<LiabilityForm>(dataParseResult.error.issues);
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

  revalidatePath(pathParseResult.data);
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

  const liabilityIdParseResult = validateId(liabilityId);
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

  const deleted = await statementDoc.deleteLiability(
    liabilityIdParseResult.data
  );

  if (!deleted) {
    return liabilityNotFound;
  }

  revalidatePath(pathParseResult.data);
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

  const liabilityIdParseResult = validateId(liabilityId);
  const statementIdParseResult = validateId(statementId);
  const pathParseResult = validatePath(path);

  const dataParseResult = liabilityFormSchema.safeParse(data);
  if (!dataParseResult.success) {
    const errors = getErrors<LiabilityForm>(dataParseResult.error.issues);
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

  const liabilityDoc = await statementDoc.updateLiability(
    liabilityIdParseResult.data,
    dataParseResult.data
  );

  if (!liabilityDoc) {
    return liabilityNotFound;
  }

  revalidatePath(pathParseResult.data);
  return { success: true };
}
