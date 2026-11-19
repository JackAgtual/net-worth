import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { prisma } from "../db/prisma";

export async function getAllStatements(sortAscending: boolean = true) {
  const { user } = await getValidSessionOrRedirect();

  return prisma.statement.findMany({
    where: { userId: user.id },
    orderBy: { year: sortAscending ? "asc" : "desc" },
    include: { assets: true, liabilities: true },
  });
}

export async function getStatementFromYear(year: number) {
  const { user } = await getValidSessionOrRedirect();

  return prisma.statement.findUnique({
    where: { userId_year: { userId: user.id, year } },
    include: { assets: true, liabilities: true },
  });
}

export async function getStatementFromId(id: number) {
  const { user } = await getValidSessionOrRedirect();

  return prisma.statement.findUnique({
    where: { id, userId: user.id },
    include: { assets: true, liabilities: true },
  });
}

export async function statementYearAlreadyExists(year: number) {
  const { user } = await getValidSessionOrRedirect();

  const count = await prisma.statement.count({
    where: { userId: user.id, year },
  });
  return count > 0;
}

export async function deleteStatement(id: number) {
  const { user } = await getValidSessionOrRedirect();

  await prisma.statement.delete({ where: { id, userId: user.id } });
}
