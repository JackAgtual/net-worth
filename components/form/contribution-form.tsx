import { AssetForm as TAssetForm } from "@/lib/types/asset-types";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import DollarInput from "./DollarInput";

type ContributionFormProps<
  TForm extends FieldValues & TAssetForm = TAssetForm,
> = {
  control: Control<any>; // TODO: Fix types
  setValue: UseFormSetValue<any>; // TODO: Fix types
  getName: (name: FieldPath<TAssetForm>) => FieldPath<TForm>;
  setIncludeContributions: Dispatch<SetStateAction<boolean>>;
};

export default function ContributionForm<
  TForm extends FieldValues & TAssetForm = TAssetForm,
>({
  control,
  setValue,
  getName,
  setIncludeContributions,
}: ContributionFormProps<TForm>) {
  function handleContributionClose() {
    const fieldsToClear: FieldPath<TAssetForm>[] = [
      "amountOneYearAgo",
      "contribution.self",
      "contribution.nonSelf",
      "withdrawals",
      "includeInGrowthCalculation",
    ];

    fieldsToClear.forEach((field) =>
      setValue(getName(field), undefined as any)
    );
    setIncludeContributions(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Contribution Details</CardTitle>
        <Button variant="ghost" type="button" onClick={handleContributionClose}>
          <XIcon />
        </Button>
      </CardHeader>
      <CardContent>
        <DollarInput
          control={control}
          label="Amount one year ago"
          name={getName("amountOneYearAgo")}
          placeholder="10,000"
        />
        <DollarInput
          control={control}
          label="Self contribution"
          name={getName("contribution.self")}
          placeholder="1,000"
        />
        <DollarInput
          control={control}
          label="Non-self contribution"
          name={getName("contribution.nonSelf")}
          placeholder="500"
        />
        <DollarInput
          control={control}
          label="Withdrawals"
          name={getName("withdrawals")}
          placeholder="250"
        />
        <Controller
          name={getName("includeInGrowthCalculation")}
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id={getName("includeInGrowthCalculation")}
                name={getName("includeInGrowthCalculation")}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor={getName("includeInGrowthCalculation")}>
                  Include in growth calculation
                </FieldLabel>
                <FieldDescription>
                  By clicking this checkbox, this asset will be counted towards
                  your asset growth metric.
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
