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

type TDollarInput = {
  name: FieldPath<TAssetForm>;
  label: string;
  placeholder: string;
};

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
  const dollarInputs: TDollarInput[] = [
    {
      name: "amountOneYearAgo",
      label: "Amount one year ago",
      placeholder: "10,000",
    },
    {
      name: "contribution.self",
      label: "Self contribution",
      placeholder: "1,000",
    },
    {
      name: "contribution.nonSelf",
      label: "Non-self contribution",
      placeholder: "500",
    },
    { name: "withdrawals", label: "Withdrawals", placeholder: "250" },
  ];
  const includeInGrowth: FieldPath<TAssetForm> = "includeInGrowthCalculation";

  function handleContributionClose() {
    const fieldsToClear: FieldPath<TAssetForm>[] = [
      ...dollarInputs.map((input) => input.name),
      includeInGrowth,
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
        {dollarInputs.map(({ label, name, placeholder }) => (
          <DollarInput
            key={name}
            control={control}
            label={label}
            name={getName(name)}
            placeholder={placeholder}
          />
        ))}
        <Controller
          name={getName(includeInGrowth)}
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id={getName(includeInGrowth)}
                name={getName(includeInGrowth)}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor={getName(includeInGrowth)}>
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
