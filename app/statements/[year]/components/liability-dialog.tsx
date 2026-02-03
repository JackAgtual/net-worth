"use client";

import LiabilityForm from "@/components/form/liability-form";
import {
  liabilityFormSchema,
  LiabilityForm as TLiabilityForm,
} from "@/lib/types/liability-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";
import {
  deleteLiability,
  updateLiability,
} from "@/lib/actions/liability-actions";
import { usePathname } from "next/navigation";
import { FieldError } from "@/components/ui/field";

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
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    reset,
  } = useForm<TLiabilityForm>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: data,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      reset(data);
    }
  }, [open, data]);

  const handleEdit = async (data: TLiabilityForm) => {
    const result = await updateLiability(id, data, pathname);

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
    const result = await deleteLiability(id, pathname);

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
          <LiabilityForm control={control} />
          {errors.root && (
            <FieldError errors={[{ message: errors.root.message }]} />
          )}
        </>
      )}
    </EntryDialog>
  );
}
