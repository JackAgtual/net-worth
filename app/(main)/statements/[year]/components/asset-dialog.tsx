"use client";

import AssetForm from "@/components/form/asset-form";
import { FieldError } from "@/components/ui/field";
import {
  createAsset,
  deleteAsset,
  updateAsset,
} from "@/lib/actions/asset-actions";
import {
  assetFormSchema,
  AssetForm as TAssetForm,
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
    setValue,
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
    const serializable = JSON.parse(
      JSON.stringify(data, (_, v) => (v === undefined ? null : v))
    );

    const result = await updateAsset({
      assetId,
      statementId,
      data: serializable,
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

  let onSubmit;
  switch (action) {
    case "create":
      onSubmit = handleSubmit(handleCreate);
      break;
    case "edit":
      onSubmit = handleSubmit(handleEdit);
      break;
    case "delete":
      onSubmit = handleDelete;
      break;
  }

  const includesContributionData =
    !!data?.amountOneYearAgo ||
    !!data?.contribution?.self ||
    !!data?.contribution?.nonSelf ||
    !!data?.withdrawals ||
    !!data?.includeInGrowthCalculation;

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
      {action !== "delete" && (
        <>
          <AssetForm
            control={control}
            setValue={setValue}
            initialIncludeContributions={includesContributionData}
          />
          {errors.root && (
            <FieldError errors={[{ message: errors.root.message }]} />
          )}
        </>
      )}
    </EntryDialog>
  );
}
