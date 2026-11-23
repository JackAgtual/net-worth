"use client";

import { AssetForm } from "@/components/form/asset-form";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AssetCategory } from "@/generated/prisma/enums";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { FieldPath, useFieldArray, UseFormSetValue } from "react-hook-form";

type AssetsFormProps = {
  control: StatementFormControl;
  setValue: UseFormSetValue<StatementForm>;
  showAllContributionSubForms?: boolean;
};

export function AssetsForm({
  control,
  setValue,
  showAllContributionSubForms = false,
}: AssetsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <FieldSet className="my-6 @container">
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
                initialIncludeContributions={showAllContributionSubForms}
              />
              <Button
                className="w-fit"
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
              category: AssetCategory.CASH,
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
