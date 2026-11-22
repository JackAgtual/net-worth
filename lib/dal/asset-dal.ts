import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { numberify } from "../db/numberify";
import { prisma } from "../db/prisma";
import { AssetForm } from "../types/asset-types";
import { getStatementFromId } from "./statement-dal";

export async function addAssetToStatement(
  statementId: number,
  data: AssetForm
) {
  await getValidSessionOrRedirect();

  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  const asset = await prisma.asset.create({
    data: {
      ...data,
      statementId,
    },
  });
  return numberify(asset);
}

export async function deleteAsset(id: number) {
  const { user } = await getValidSessionOrRedirect();

  const { count } = await prisma.asset.deleteMany({
    where: { id, statement: { userId: user.id } },
  });

  return count > 0;
}

export async function updateAsset(id: number, data: AssetForm) {
  const { user } = await getValidSessionOrRedirect();

  const updated = await prisma.asset.update({
    where: { id, statement: { userId: user.id } },
    data,
  });

  return !!updated;
}
