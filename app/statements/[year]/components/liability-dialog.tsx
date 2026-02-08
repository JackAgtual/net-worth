"use client";

import LiabilityForm from "@/components/form/liability-form";
import { FieldError } from "@/components/ui/field";
import {
  deleteLiability,
  updateLiability,
} from "@/lib/actions/liability-actions";
import { LiabilityDialogProps } from "@/lib/types/entry-dialog-types";
import {
  liabilityFormSchema,
  LiabilityForm as TLiabilityForm,
} from "@/lib/types/liability-types";
import { setFormErrors } from "@/lib/utils/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import EntryDialog from "./entry-dialog";

export default function LiabilityDialog(props: LiabilityDialogProps) {
  const { open, setOpen, statementId, action } = props;

  let data = undefined;
  let liabilityId = undefined;

  switch (action) {
    case "edit":
      liabilityId = props.entryId;
      data = props.data;
      break;
    case "delete":
      liabilityId = props.entryId;
      break;
  }

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
