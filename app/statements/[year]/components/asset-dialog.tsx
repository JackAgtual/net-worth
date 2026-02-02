"use client";

import AssetForm from "@/components/form/asset-form";
import {
  assetFormSchema,
  AssetForm as TAssetForm,
} from "@/lib/types/asset-types";
import { LiabilityForm as TLiabilityForm } from "@/lib/types/liability-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";

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
  const { control, handleSubmit } = useForm<TAssetForm>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: data,
  });

  const handleEdit = async (data: TLiabilityForm) => {
    console.log(`edit ${id}`);
    console.log(data);
  };

  const handleDelete = async () => {
    console.log(`delete ${id}`);
  };

  const onSubmit =
    action === "edit" ? handleSubmit(handleEdit) : handleSubmit(handleDelete);

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      action={action}
      onSubmit={onSubmit}
    >
      {action === "edit" && <AssetForm control={control} />}
    </EntryDialog>
  );
}
