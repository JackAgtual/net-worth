import {
  assetFormSchema,
  AssetForm as TAssetForm,
} from "@/lib/types/asset-types";
import { Category } from "@/lib/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DollarInput from "./shared/DollarInput";
import { Checkbox } from "./ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type AssetFormProps = {
  data?: TAssetForm;
};

// TODO: Use this component in assets form (create statement)
export default function AssetForm({ data }: AssetFormProps) {
  const { control } = useForm<TAssetForm>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      title: data?.title,
      amount: data?.amount,
      category: data?.category,
      retirement: data?.retirement,
      amountOneYearAgo: data?.amountOneYearAgo,
      contribution: {
        self: data?.contribution?.self,
        nonSelf: data?.contribution?.nonSelf,
      },
      includeInGrowthCalculation: data?.includeInGrowthCalculation,
      notes: data?.notes,
    },
  });
  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              {...controllerField}
              id="title"
              placeholder="Investment account"
              type="string"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <DollarInput control={control} label="Amount" name="amount" />
      <Controller
        name="category"
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
        name="retirement"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="retirement"
              name="retirement"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="retirement">Retirement asset</FieldLabel>
          </Field>
        )}
      />
      <DollarInput
        control={control}
        label="Amount one year ago"
        name="amountOneYearAgo"
        placeholder="10,000"
      />
      <DollarInput
        control={control}
        label="Self contribution"
        name="contribution.self"
        placeholder="1,000"
      />
      <DollarInput
        control={control}
        label="Non-self contribution"
        name="contribution.nonSelf"
        placeholder="500"
      />
      <Controller
        name="includeInGrowthCalculation"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="includeInGrowthCalculation"
              name="includeInGrowthCalculation"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldContent>
              <FieldLabel htmlFor="includeInGrowthCalculation">
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
        name="notes"
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              {...controllerField}
              id="notes"
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
