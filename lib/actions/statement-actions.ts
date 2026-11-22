"use server";

import { getValidSessionOrThrow } from "../auth/auth-utils";
import {
  createStatement,
  statementYearAlreadyExists,
} from "../dal/statement-dal";
import { ActionResponse } from "../types/action-types";
import { StatementForm, statementFormSchema } from "../types/statement-types";
import { parseFormData } from "./action-utils";

export async function createStatementAction(
  formData: unknown
): Promise<ActionResponse<StatementForm>> {
  await getValidSessionOrThrow();

  const dataParseResult = parseFormData(formData, statementFormSchema);
  if (!dataParseResult.success) {
    return dataParseResult;
  }

  const statementData = dataParseResult.data;

  const statementAlreadyExists = await statementYearAlreadyExists(
    statementData.year
  );

  if (statementAlreadyExists) {
    return {
      success: false,
      errors: [
        {
          path: "year",
          message: `Statement for ${statementData.year} already exists`,
        },
      ],
    };
  }

  await createStatement(statementData);
  return { success: true };
}
