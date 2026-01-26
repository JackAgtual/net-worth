"use client";

import { Category } from "@/types/types";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";
import { Controller, FieldPath, useFieldArray } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DollarInput from "@/components/shared/DollarInput";

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
              <Controller
                name={`${baseName}.title`}
                control={control}
                render={({ field: controllerField, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      {...controllerField}
                      id={`${baseName}.title`}
                      placeholder="Investment account"
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
                name={`${baseName}.category`}
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Category).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name={`${baseName}.retirement`}
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`${baseName}.retirement`}
                      name={`${baseName}.retirement`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor={`${baseName}.retirement`}>
                      Retirement asset
                    </FieldLabel>
                  </Field>
                )}
              />
              <DollarInput
                control={control}
                label="Amount one year ago"
                name={`${baseName}.amountOneYearAgo`}
                placeholder="10,000"
              />
              <DollarInput
                control={control}
                label="Self contribution"
                name={`${baseName}.contribution.self`}
                placeholder="1,000"
              />
              <DollarInput
                control={control}
                label="Non-self contribution"
                name={`${baseName}.contribution.nonSelf`}
                placeholder="500"
              />
              <Controller
                name={`${baseName}.includeInGrowthCalculation`}
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`${baseName}.includeInGrowthCalculation`}
                      name={`${baseName}.includeInGrowthCalculation`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor={`${baseName}.includeInGrowthCalculation`}
                      >
                        Include in growth calculation
                      </FieldLabel>
                      <FieldDescription>
                        By clicking this checkbox, this asset will be counted
                        towards your asset growth metric.
                      </FieldDescription>
                    </FieldContent>
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
              amount: 0,
              category: Category.Cash,
              retirement: false,
              includeInGrowthCalculation: false,
            }); // TODO: Don't requrie default for amount, category,
          }}
        >
          Add asset
        </Button>
      </FieldGroup>
    </FieldSet>
  );
}
