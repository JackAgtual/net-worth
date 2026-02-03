"use client";

import AssetForm from "@/components/form/asset-form";
import { FieldError } from "@/components/ui/field";
import {
  AssetForm as TAssetForm,
  assetFormSchema,
} from "@/lib/types/asset-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";
import { deleteAsset, updateAsset } from "@/lib/actions/asset-actions";

type AssetDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: "edit" | "delete";
  id: string;
  data?: TAssetForm;
};

export default function AssetDialog({
  open,
  setOpen,
  action,
  id,
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

  useEffect(() => {
    if (open) {
      reset(data);
    }
  }, [open, data]);

  const handleEdit = async (data: TAssetForm) => {
    const result = await updateAsset(id, data, pathname);

    // TODO: extract this to function to make it reuseable
    if (!result.success) {
      result.errors.forEach((error) => {
        setError(error.path, { message: error.message });
      });
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const result = await deleteAsset(id, pathname);

    // TODO: extract this to function to make it reuseable
    if (!result.success) {
      result.errors.forEach((error) => {
        setError(error.path, { message: error.message });
      });
      return;
    }

    setOpen(false);
  };

  const onSubmit =
    action === "edit" ? handleSubmit(handleEdit) : handleSubmit(handleDelete);

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      action={action}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      {action === "edit" && (
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
