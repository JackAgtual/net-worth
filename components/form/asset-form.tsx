import {
  assetFormSchema,
  AssetForm as TAssetForm,
} from "@/lib/types/asset-types";
import { Category } from "@/lib/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  useForm,
} from "react-hook-form";
import DollarInput from "./DollarInput";
import { Checkbox } from "../ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type AssetFormProps<TForm extends FieldValues & TAssetForm = TAssetForm> = {
  control: Control<any>; // TODO: Fix types
  baseName?: FieldPath<TForm>;
};

export default function AssetForm<
  TForm extends FieldValues & TAssetForm = TAssetForm
>({ control, baseName }: AssetFormProps<TForm>) {
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
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
