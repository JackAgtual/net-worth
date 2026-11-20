import { Asset } from "@/generated/prisma/client";
import { AssetInputType } from "@/generated/prisma/schemas";
import { getValidSessionOrRedirect } from "../auth/auth-utils";
import { prisma } from "../db/prisma";
import { getStatementFromId } from "./statement-dal";

export async function addAssetToStatement(
  statementId: number,
  data: AssetInputType
) {
  await getValidSessionOrRedirect();

  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  const { statement: _statement, ...assetData } = data;

  return prisma.asset.create({
    data: {
      ...assetData,
      statementId,
    },
  });
}

export async function deleteAsset(id: number) {
  const { user } = await getValidSessionOrRedirect();

  const { count } = await prisma.asset.deleteMany({
    where: { id, statement: { userId: user.id } },
  });

  return count > 0;
}

export async function updateAsset(data: Asset) {
  const { user } = await getValidSessionOrRedirect();

  const updated = await prisma.asset.update({
    where: { id: data.id, statement: { userId: user.id } },
    data,
  });

  return !!updated;
}
