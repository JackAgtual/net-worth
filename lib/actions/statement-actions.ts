"use server";

import { getValidSession } from "../auth/auth-utils";
import {
  deleteStatement,
  statementYearAlreadyExists,
} from "../dal/statement-dal";
import { Statement } from "../db/models";
import dbConnect from "../db/mongodb";
import { ActionResponse } from "../types/action-types";
import { StatementForm, statementFormSchema } from "../types/statement-types";
import { parseFormData } from "./action-utils";

const somethingWentWrong: ActionResponse<StatementForm> = {
  success: false,
  errors: [{ path: "root", message: "Something went wrong" }],
};

export async function createStatement(
  formData: unknown
): Promise<ActionResponse<StatementForm>> {
  await dbConnect();

  const dataParseResult = parseFormData(formData, statementFormSchema);
  if (!dataParseResult.success) {
    return dataParseResult;
  }

  const session = await getValidSession();

  const statementData = dataParseResult.data;
  const userId = session.user.id;

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

  const statementLevelData = {
    userId,
    year: statementData.year,
    lastYearSalary: statementData.lastYearSalary,
  };
  try {
    const statementDoc = new Statement(statementLevelData);
    await statementDoc.save();

    if (!statementDoc) {
      return somethingWentWrong;
    }

    await statementDoc.addAssets(
      statementData.assets?.map((asset) => {
        return {
          userId,
          ...asset,
        };
      }) ?? []
    );

    await statementDoc.addLiabilities(
      statementData.liabilities?.map((liability) => {
        return {
          userId,
          ...liability,
        };
      }) ?? []
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    await deleteStatement(statementLevelData);
    return somethingWentWrong;
  }
}
