import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";

type DollarInputProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>
> = {
  name: TName;
  label: string;
  control: Control<TFormValues>;
  placeholder?: string;
};

export default function DollarInput<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>
>({
  name,
  label,
  control,
  placeholder = "1,500",
}: DollarInputProps<TFormValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const val = field.value as number | undefined;
        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                id={name}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                type="text"
                value={val !== undefined ? val.toLocaleString("en-US") : ""}
                onChange={(e) => {
                  const val = e.target.value.replaceAll(",", "");
                  if (!/^\d*$/.test(val)) return;

                  field.onChange(val === "" ? undefined : Number(val));
                }}
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
