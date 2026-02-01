"use client";

import AssetForm from "@/components/form/asset-form";
import DollarInput from "@/components/form/DollarInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { Category } from "@/types/types";
import { Controller, FieldPath, useFieldArray } from "react-hook-form";

type AssetsFormProps = {
  control: StatementFormControl;
};

export default function AssetsForm({ control }: AssetsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <FieldSet className="my-6">
      <FieldLegend>Assets</FieldLegend>
      <FieldGroup>
        {fields.map((field, index) => {
          const baseName: FieldPath<StatementForm> = `assets.${index}`;
          return (
            <FieldGroup key={field.id}>
              <AssetForm baseName={baseName} control={control} />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  remove(index);
                }}
              >
                Remove asset
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
            append({
              title: "",
              amount: "" as unknown as number, // bad practice but it works
              category: Category.Cash,
              retirement: false,
              includeInGrowthCalculation: false,
            });
          }}
        >
          Add asset
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
