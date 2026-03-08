"use client";

import DollarInput from "@/components/form/DollarInput";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createStatement } from "@/lib/actions/statement-actions";
import {
  StatementForm as TStatementForm,
  statementFormSchema,
} from "@/lib/types/statement-types";
import { setFormErrors } from "@/lib/utils/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import AssetsForm from "./assets-form";
import LiabilitiesForm from "./liabilities-form";

export default function StatementForm({
  defaultValues,
}: {
  defaultValues?: TStatementForm;
}) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TStatementForm>({
    resolver: zodResolver(statementFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TStatementForm) => {
    const response = await createStatement(data);

    if (response.success) {
      redirect(`/statements/${data.year}`);
    }
    setFormErrors(response.errors, setError);
  };

  return (
    <form
      className="flex-col"
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.error(err);
      })}
    >
      <Controller
        name="year"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Year</FieldLabel>
            <Input
              {...field}
              id="year"
              aria-invalid={fieldState.invalid}
              placeholder="2023"
              type="text"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                field.onChange(val === "" ? undefined : Number(val));
              }}
              value={field.value ?? ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <DollarInput
        control={control}
        label="Last year salary"
        name="lastYearSalary"
        placeholder="70,000"
      />
      <AssetsForm control={control} />
      <LiabilitiesForm control={control} />

      <Button type="submit">Create</Button>
      {errors.root && (
        <FieldError errors={[{ message: errors.root.message }]} />
      )}
    </form>
  );
}
