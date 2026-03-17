import { checkSession } from "../auth/auth-utils";
import { Statement } from "../db/models";
import { StatementForm } from "../types/statement-types";

export async function getAllStatements(sortAscending: boolean = true) {
  const session = await checkSession();

  return Statement.find({
    userId: session.user.id,
  }).sort({ year: sortAscending ? 1 : -1 });
}

export async function getStatementFromYear(year: number) {
  const session = await checkSession();

  return Statement.findOne({
    year,
    userId: session.user.id,
  });
}

export async function getStatementFromId(id: string) {
  const session = await checkSession();

  return Statement.findOne({
    userId: session.user.id,
    _id: id,
  });
}

export async function statementYearAlreadyExists(year: number) {
  const session = await checkSession();

  const existingStatements = await Statement.find({
    userId: session.user.id,
    year,
  });

  return existingStatements.length !== 0;
}

export async function deleteStatement(statementData: Partial<StatementForm>) {
  await Statement.deleteOne(statementData);
}
