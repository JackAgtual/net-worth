"use client";

import LiabilityForm from "@/components/form/liability-form";
import { FieldError } from "@/components/ui/field";
import {
  deleteLiability,
  updateLiability,
} from "@/lib/actions/liability-actions";
import {
  liabilityFormSchema,
  LiabilityForm as TLiabilityForm,
} from "@/lib/types/liability-types";
import { setFormErrors } from "@/lib/utils/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";

type LiabilityDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: "edit" | "delete";
  liabilityId: string;
  statementId: string;
  data: TLiabilityForm;
};

export default function LiabilityDialog({
  open,
  setOpen,
  action,
  liabilityId,
  statementId,
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
  const path = usePathname();

  const handleEdit = async (data: TLiabilityForm) => {
    const result = await updateLiability({
      liabilityId,
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
    const result = await deleteLiability({
      liabilityId,
      statementId,
      path,
    });

    if (!result.success) {
      setFormErrors(result.errors, setError);
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
      reset={reset}
      data={data}
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
