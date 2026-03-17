import { checkSession } from "../auth/auth-utils";
import { LiabilityForm } from "../types/liability-types";
import { getStatementFromId } from "./statement-dal";

export async function addLiabilityToStatement(
  statementId: string,
  data: LiabilityForm
) {
  const session = await checkSession();
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) return null;

  return statementDoc.addLiability({
    userId: session.user.id,
    ...data,
  });
}

export async function removeLiabilityFromStatement(
  statementId: string,
  liabilityId: string
) {
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  return statementDoc.deleteLiability(liabilityId);
}

export async function updateLiabilityOnStatement(
  statementId: string,
  liabilityId: string,
  data: LiabilityForm
) {
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  return statementDoc.updateLiability(liabilityId, data);
}
