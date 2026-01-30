"use server";

import { getSession } from "../auth/auth-utils";
import { StatementForm, statementFormSchema } from "../types/statement-types";
import { ActionResponse } from "./action-types";
import { getErrors } from "./action-utils";

export async function createStatement(
  formData: unknown
): Promise<ActionResponse<StatementForm>> {
  const session = await getSession();
  if (!session) {
    throw new Error("Invalid session");
  }

  const result = statementFormSchema.safeParse(formData);

  if (!result.success) {
    const issues = result.error.issues;
    return { success: false, errors: getErrors<StatementForm>(issues) };
  }

  // TODO: create statement for user
  return { success: true };
}
