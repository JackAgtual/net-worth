"use client";

import DollarInput from "@/components/shared/DollarInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createStatement } from "@/lib/actions/statement-actions";
import { authClient } from "@/lib/auth/auth-client";
import {
  StatementForm,
  statementFormSchema,
} from "@/lib/types/statement-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import AssetsForm from "./components/assets-form";
import LiabilitiesForm from "./components/liability-form";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  const { control, handleSubmit, setError } = useForm<StatementForm>({
    resolver: zodResolver(statementFormSchema),
  });

  if (isPending) {
    return <p>Loading</p>;
  }
  if (!session) {
    redirect("/login");
  }

  // CONTINUE HERE:
  // add/remove liability styling
  // if year is blank error says expected number received string. Should say year is required

  const onSubmit = async (data: StatementForm) => {
    console.log("form submit");

    const response = await createStatement(data);

    if (response.success) {
      console.log("success");
      return; // redirect
    }

    response.errors.forEach((error) => {
      setError(error.path, { message: error.message });
    });
  };

  return (
    <Card>
      <CardHeader>Add a statement</CardHeader>
      <CardContent>
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
                  type="number"
                  onChange={(e) => {
                    const val = e.target.valueAsNumber;
                    field.onChange(Number.isFinite(val) ? val : undefined);
                  }}
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
        </form>
      </CardContent>
    </Card>
  );
}
