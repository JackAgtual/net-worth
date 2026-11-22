import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { numberify } from "../db/numberify";
import { prisma } from "../db/prisma";
import { StatementForm } from "../types/statement-types";

export async function createStatement(data: StatementForm) {
  const { user } = await getValidSessionOrRedirect();

  const { assets, liabilities, ...statement } = data;

  await prisma.statement.create({
    data: {
      ...statement,
      userId: user.id,
      assets: { create: assets },
      liabilities: { create: liabilities },
    },
  });
}

export async function getAllStatements(sortAscending: boolean = true) {
  const { user } = await getValidSessionOrRedirect();

  const statement = await prisma.statement.findMany({
    where: { userId: user.id },
    orderBy: { year: sortAscending ? "asc" : "desc" },
    include: { assets: true, liabilities: true },
  });
  return numberify(statement);
}

export async function getStatementFromYear(year: number) {
  const { user } = await getValidSessionOrRedirect();

  const statement = await prisma.statement.findUnique({
    where: { userId_year: { userId: user.id, year } },
    include: {
      assets: { orderBy: { createdAt: "asc" } },
      liabilities: { orderBy: { createdAt: "asc" } },
    },
  });
  return numberify(statement);
}

export async function getStatementFromId(id: number) {
  const { user } = await getValidSessionOrRedirect();

  const statement = await prisma.statement.findUnique({
    where: { id, userId: user.id },
    include: { assets: true, liabilities: true },
  });
  return numberify(statement);
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
