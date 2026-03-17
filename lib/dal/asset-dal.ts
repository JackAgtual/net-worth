import { checkSession } from "../auth/auth-utils";
import { AssetForm } from "../types/asset-types";
import { getStatementFromId } from "./statement-dal";

export async function addAssetToStatement(
  statementId: string,
  data: AssetForm
) {
  const session = await checkSession();

  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  return statementDoc.addAsset({
    userId: session.user.id,
    ...data,
  });
}

export async function removeAssetFromStatement(
  statementId: string,
  assetId: string
) {
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  return statementDoc.deleteAsset(assetId);
}

export async function updateAssetOnStatement(
  statementId: string,
  assetId: string,
  data: AssetForm
) {
  const statementDoc = await getStatementFromId(statementId);

  if (!statementDoc) {
    return null;
  }

  return statementDoc.updateAsset(assetId, data);
}
