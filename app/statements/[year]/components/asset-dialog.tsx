"use client";

import AssetForm from "@/components/form/asset-form";
import { FieldError } from "@/components/ui/field";
import {
  createAsset,
  deleteAsset,
  updateAsset,
} from "@/lib/actions/asset-actions";
import {
  AssetForm as TAssetForm,
  assetFormSchema,
} from "@/lib/types/asset-types";
import type { AssetDialogProps } from "@/lib/types/entry-dialog-types";
import { setFormErrors } from "@/lib/utils/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";

export default function AssetDialog(props: AssetDialogProps) {
  const { open, setOpen, statementId, action } = props;

  let data = undefined;
  let assetId = undefined;

  switch (action) {
    case "edit":
      assetId = props.entryId;
      data = props.data;
      break;
    case "delete":
      assetId = props.entryId;
      break;
  }

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
  const path = usePathname();

  const handleCreate = async (data: TAssetForm) => {
    const result = await createAsset({ statementId, data, path });

    if (!result.success) {
      setFormErrors(result.errors, setError);
      return;
    }

    setOpen(false);
  };

  const handleEdit = async (data: TAssetForm) => {
    const result = await updateAsset({
      assetId,
      statementId,
      data,
      path,
    });

    if (!result.success) {
      setFormErrors(result.errors, setError);
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteAsset({ assetId, statementId, path });

    if (!result.success) {
      setFormErrors(result.errors, setError);
      return;
    }

    setOpen(false);
  };

  let handler;
  switch (action) {
    case "create":
      handler = handleCreate;
      break;
    case "edit":
      handler = handleEdit;
      break;
    case "delete":
      handler = handleDelete;
      break;
  }
  const onSubmit = handleSubmit(handler);

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
      {(action === "edit" || action === "create") && (
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
