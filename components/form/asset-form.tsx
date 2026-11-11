import { AssetForm as TAssetForm } from "@/lib/types/asset-types";
import { Category } from "@/lib/types/types";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import DollarInput from "./DollarInput";
import ContributionForm from "./contribution-form";

type AssetFormProps<TForm extends FieldValues & TAssetForm = TAssetForm> = {
  control: Control<any>; // TODO: Fix types
  setValue: UseFormSetValue<any>; // TODO: Fix types
  baseName?: FieldPath<TForm>;
  initialIncludeContributions?: boolean;
};

export default function AssetForm<
  TForm extends FieldValues & TAssetForm = TAssetForm,
>({
  control,
  setValue,
  baseName,
  initialIncludeContributions = false,
}: AssetFormProps<TForm>) {
  const [includeContributions, setIncludeContributions] = useState(
    initialIncludeContributions
  );

  function getName(name: FieldPath<TAssetForm>): FieldPath<TForm> {
    if (!baseName) return name as FieldPath<TForm>;

    return `${baseName}.${name}` as FieldPath<TForm>;
  }

  return (
    <>
      <Controller
        name={getName("title")}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              {...controllerField}
              id={getName("title")}
              placeholder="Investment account"
              type="string"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <DollarInput control={control} label="Amount" name={getName("amount")} />
      <Controller
        name={getName("category")}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        // TODO: fixme, changing from uncontrolled to controlled
        name={getName("retirement")}
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id={getName("retirement")}
              name="retirement"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor={getName("retirement")}>
              Retirement asset
            </FieldLabel>
          </Field>
        )}
      />
      {includeContributions ? (
        <ContributionForm
          control={control}
          getName={getName}
          setIncludeContributions={setIncludeContributions}
          setValue={setValue}
        />
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIncludeContributions(true)}
        >
          Include contribution details
        </Button>
      )}
      <Controller
        name={getName("notes")}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              {...controllerField}
              id={getName("notes")}
              placeholder="Type your notes here."
              aria-invalid={fieldState.invalid}
              value={controllerField.value ?? ""}
              onChange={(e) => controllerField.onChange(e.target.value)}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
