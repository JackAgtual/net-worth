"use client";

import LiabilityForm from "@/components/form/liability-form";
import {
  liabilityFormSchema,
  LiabilityForm as TLiabilityForm,
} from "@/lib/types/liability-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";

type LiabilityDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: "edit" | "delete";
  id: string;
  data?: TLiabilityForm;
};

export default function LiabilityDialog({
  open,
  setOpen,
  action,
  id,
  data,
}: LiabilityDialogProps) {
  const { control, handleSubmit } = useForm<TLiabilityForm>({
    resolver: zodResolver(liabilityFormSchema),
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
      {action === "edit" && <LiabilityForm control={control} />}
    </EntryDialog>
  );
}
