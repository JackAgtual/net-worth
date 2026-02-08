"use client";

import AssetForm from "@/components/form/asset-form";
import { FieldError } from "@/components/ui/field";
import { deleteAsset, updateAsset } from "@/lib/actions/asset-actions";
import {
  AssetForm as TAssetForm,
  assetFormSchema,
} from "@/lib/types/asset-types";
import { setFormErrors } from "@/lib/utils/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";
import { EntryAction } from "@/lib/types/types";

type AssetDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: EntryAction;
  statementId: string;
  assetId?: string;
  data?: TAssetForm;
};

// const Action = {
//   CREATE: "create",
//   EDIT: "edit",
//   DELETE: "delete",
// } as const;

// type BaseAssetDialogProps = {
//   open: boolean;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   statementId: string;
// };

// type CreateAssetDialogProps = BaseAssetDialogProps & {
//   action: typeof Action.CREATE;
//   data: TAssetForm;
// };

// type EditAssetDialogProps = BaseAssetDialogProps & {
//   action: typeof Action.EDIT;
//   assetId: string;
//   data: TAssetForm;
// };

// type DeleteAssetDialogProps = BaseAssetDialogProps & {
//   action: typeof Action.DELETE;
//   assetId: string;
// };

// type AssetDialogProps =
//   | CreateAssetDialogProps
//   | EditAssetDialogProps
//   | DeleteAssetDialogProps;

// figure out prop typing with create/edit/delete

export default function AssetDialog({
  open,
  setOpen,
  action,
  statementId,
  assetId,
  data,
}: AssetDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    reset,
  } = useForm<TAssetForm>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: data,
  });
  const pathname = usePathname();

  // const handleCreate = async (data: TAssetForm) => {
  //   const result = await createAsset(data, pathname);

  //   if (!result.success) {
  //     setFormErrors(result.errors, setError);
  //     return;
  //   }

  //   setOpen(false);
  // };

  const handleEdit = async (data: TAssetForm) => {
    const result = await updateAsset(assetId, statementId, data, pathname);

    if (!result.success) {
      setFormErrors(result.errors, setError);
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteAsset(assetId, statementId, pathname);

    if (!result.success) {
      setFormErrors(result.errors, setError);
      return;
    }

    setOpen(false);
  };

  // let handler;
  // switch (action) {
  //   case "new":
  //     handler = handleCreate;
  //     break;
  //   case "edit":
  //     handler = handleEdit;
  //     break;
  //   case "delete":
  //     handler = handleDelete;
  //     break;
  // }
  // const onSubmit = handleSubmit(handler);

  const onSubmit =
    action === "edit" ? handleSubmit(handleEdit) : handleSubmit(handleDelete);

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      action={action}
      onSubmit={onSubmit}
      reset={reset}
      data={data}
      isSubmitting={isSubmitting}
    >
      {action === "edit" && ( //|| action === "new") && (
        <>
          <AssetForm control={control} />
          {errors.root && (
            <FieldError errors={[{ message: errors.root.message }]} />
          )}
        </>
      )}
    </EntryDialog>
  );
}
