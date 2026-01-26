"use client";

import { createStatement } from "@/lib/actions/statement-actions";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import LiabilitiesForm from "./components/liability-form";
import AssetsForm from "./components/assets-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  statementFormSchema,
  statementSchema,
  StatementForm,
} from "@/lib/types/statement-types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import DollarInput from "@/components/shared/DollarInput";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  const { control, handleSubmit } = useForm<StatementForm>({
    resolver: zodResolver(statementFormSchema),
  });

  if (isPending) {
    return <p>Loading</p>;
  }
  if (!session) {
    redirect("/login");
  }

  // CONTINUE HERE:
  // putting 0 as default value for number input
  // add/remove liability styling
  // if year is blank error says expected number received string. Should say year is required

  const onSubmit = async (data: StatementForm) => {
    console.log("submitting");
    console.log(data);
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
