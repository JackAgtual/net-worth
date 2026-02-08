import { Dispatch, SetStateAction } from "react";
import { AssetForm } from "./asset-types";
import { LiabilityForm } from "./liability-types";

const entryAction = {
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
} as const;

export type EntryAction = (typeof entryAction)[keyof typeof entryAction];

type BaseAssetOrLiabilityDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  statementId: string;
};

type CreateAssetOrLiabilityDialogProps = BaseAssetOrLiabilityDialogProps & {
  action: typeof entryAction.CREATE;
};

type EditAssetOrLiabilityDialogProps<T extends AssetForm | LiabilityForm> =
  BaseAssetOrLiabilityDialogProps & {
    action: typeof entryAction.EDIT;
    entryId: string;
    data: T;
  };

type DeleteAssetOrLiabilityDialogProps = BaseAssetOrLiabilityDialogProps & {
  action: typeof entryAction.DELETE;
  entryId: string;
};

type AssetOrLiabilityDialogProps<T extends AssetForm | LiabilityForm> =
  | CreateAssetOrLiabilityDialogProps
  | EditAssetOrLiabilityDialogProps<T>
  | DeleteAssetOrLiabilityDialogProps;

export type AssetDialogProps = AssetOrLiabilityDialogProps<AssetForm>;
export type LiabilityDialogProps = AssetOrLiabilityDialogProps<LiabilityForm>;
