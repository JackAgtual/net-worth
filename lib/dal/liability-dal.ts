import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { prisma } from "../db/prisma";
import { LiabilityForm } from "../types/liability-types";
import { getStatementFromId } from "./statement-dal";

export async function addLiabilityToStatement(
  statementId: number,
  data: LiabilityForm
) {
  await getValidSessionOrRedirect();
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) return null;

  return prisma.liability.create({ data: { ...data, statementId } });
}

export async function deleteLiability(id: number) {
  const { user } = await getValidSessionOrRedirect();

  const { count } = await prisma.liability.deleteMany({
    where: { id, statement: { userId: user.id } },
  });

  return count > 0;
}

export async function updateLiability(id: number, data: LiabilityForm) {
  const { user } = await getValidSessionOrRedirect();

  const updated = await prisma.liability.update({
    where: { id, statement: { userId: user.id } },
    data,
  });

  return !!updated;
}
