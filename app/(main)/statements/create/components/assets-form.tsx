"use client";

import AssetForm from "@/components/form/asset-form";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AssetForm as TAssetForm } from "@/lib/types/asset-types";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { Category } from "@/types/types";
import { FieldPath, useFieldArray, UseFormSetValue } from "react-hook-form";

type AssetsFormProps = {
  control: StatementFormControl;
  setValue: UseFormSetValue<StatementForm>;
};

export default function AssetsForm({ control, setValue }: AssetsFormProps) {
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
              <AssetForm
                baseName={baseName}
                control={control}
                setValue={setValue}
              />
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
