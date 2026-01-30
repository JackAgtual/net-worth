"use server";

import { getSession } from "../auth/auth-utils";
import { Asset, Liability, Statement } from "../db/models";
import dbConnect from "../db/mongodb";
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

  await dbConnect();

  const statementData = result.data;
  const userId = session.user.id;

  const existingStatements = await Statement.find({ year: statementData.year });
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
    const assetIds = await Promise.all(
      statementData.assets?.map(async (asset) => {
        const assetDoc = await Asset.create({ userId, ...asset });
        return assetDoc._id;
      }) ?? []
    );

    const liabilityIds = await Promise.all(
      statementData.liabilities?.map(async (liability) => {
        const liabilityDoc = await Liability.create({ userId, ...liability });
        return liabilityDoc._id;
      }) ?? []
    );

    await Statement.create({
      userId,
      year: statementData.year,
      lastYearSalary: statementData.lastYearSalary,
      assets: assetIds,
      liabilities: liabilityIds,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      errors: [{ path: "root", message: "Something went wrong" }],
    };
  }
}
