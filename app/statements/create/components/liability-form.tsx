"use client";

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
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
              <Controller
                name={`${baseName}.amount`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Amount</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={`${baseName}.amount`}
                        aria-invalid={fieldState.invalid}
                        placeholder="1,500"
                        type="number"
                        value={field.value ?? ""}
                        // onChange={(e) =>
                        //   field.onChange(e.target.valueAsNumber ?? undefined)
                        // }
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(
                            Number.isFinite(val) ? val : undefined
                          );
                        }}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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
            </FieldGroup>
          );
        })}
        <Button
          type="button"
          onClick={() => {
            append({ title: "", amount: 0 });
          }}
        >
          Add liability
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
