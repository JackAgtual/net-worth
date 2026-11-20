import { Liability } from "@/generated/prisma/client";
import { LiabilityInputType } from "@/generated/prisma/schemas";
import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { prisma } from "../db/prisma";
import { getStatementFromId } from "./statement-dal";

export async function addLiabilityToStatement(
  statementId: number,
  data: LiabilityInputType
) {
  await getValidSessionOrRedirect();
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) return null;

  const { statement: _statement, ...liabilityData } = data;

  return prisma.liability.create({ data: { ...liabilityData, statementId } });
}

export async function deleteLiability(id: number) {
  const { user } = await getValidSessionOrRedirect();

  const { count } = await prisma.liability.deleteMany({
    where: { id, statement: { userId: user.id } },
  });

  return count > 0;
}

export async function updateLiability(data: Liability) {
  const { user } = await getValidSessionOrRedirect();

  const updated = await prisma.liability.update({
    where: { id: data.id, statement: { userId: user.id } },
    data,
  });

  return !!updated;
}
