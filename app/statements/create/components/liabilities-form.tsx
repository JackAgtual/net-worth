"use client";

import LiabilityForm from "@/components/form/liability-form";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { FieldPath, useFieldArray } from "react-hook-form";

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
              <LiabilityForm baseName={baseName} control={control} />
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
