"use server";

import { getValidSession } from "../auth/auth-utils";
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

  const existingStatements = await Statement.find({
    userId,
    year: statementData.year,
  });
  if (existingStatements.length !== 0) {
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

  try {
    const statementDoc = new Statement({
      userId,
      year: statementData.year,
      lastYearSalary: statementData.lastYearSalary,
    });
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
    return somethingWentWrong;
  }
}
