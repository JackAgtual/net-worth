"use client";

import DollarInput from "@/components/form/DollarInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { Controller, FieldPath, useFieldArray } from "react-hook-form";

type LiabilitiesFormProps = {
  control: StatementFormControl;
};

export default function LiabilitiesForm({ control }: LiabilitiesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "liabilities",
  });

  return (
    <FieldSet className="my-6">
      <FieldLegend>Liabilities</FieldLegend>
      <FieldGroup>
        {fields.map((field, index) => {
          const baseName: FieldPath<StatementForm> = `liabilities.${index}`;
          return (
            <FieldGroup key={field.id}>
              <Controller
                name={`${baseName}.title`}
                control={control}
                render={({ field: controllerField, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      {...controllerField}
                      id={`${baseName}.title`}
                      placeholder="Credit card 1"
                      type="string"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <DollarInput
                control={control}
                label="Amount"
                name={`${baseName}.amount`}
              />
              <Controller
                name={`${baseName}.notes`}
                control={control}
                render={({ field: controllerField, fieldState }) => (
                  <Field>
                    <FieldLabel>Notes</FieldLabel>
                    <Textarea
                      {...controllerField}
                      id={`${baseName}.notes`}
                      placeholder="Type your notes here."
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  remove(index);
                }}
              >
                Remove liability
              </Button>
              {fields.length > 1 && index !== fields.length - 1 && (
                <Separator />
              )}
            </FieldGroup>
          );
        })}
        <Button
          type="button"
          onClick={() => {
            append({ title: "", amount: "" as unknown as number }); // bad practice but it works
          }}
        >
          Add liability
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
