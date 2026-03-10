import { useState } from "react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";

type DollarInputProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
> = {
  name: TName;
  label: string;
  control: Control<TFormValues>;
  placeholder?: string;
};

type DollarInputInnerProps = {
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  label: string;
  placeholder: string;
  name: string;
};

function DollarInputInner({
  field,
  fieldState,
  label,
  placeholder,
  name,
}: DollarInputInnerProps) {
  const initialValue = field.value as number | undefined;
  const [displayVal, setDisplayVal] = useState(
    initialValue !== undefined && initialValue !== null
      ? initialValue.toLocaleString("en-US")
      : ""
  );

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
          value={displayVal}
          onChange={(e) => {
            const rawVal = e.target.value.replaceAll(",", "");
            const normalized = rawVal.startsWith(".") ? "0" + rawVal : rawVal;

            // Only allow digits and one decimal point with max 2 decimal places
            if (!/^\d*\.?\d{0,2}$/.test(normalized)) return;

            let formatted: string;
            if (normalized === "") {
              formatted = "";
            } else if (normalized.endsWith(".") || /\.\d*0$/.test(normalized)) {
              formatted = normalized;
            } else {
              formatted = Number(normalized).toLocaleString("en-US");
            }

            setDisplayVal(formatted);
            field.onChange(normalized === "" ? undefined : Number(normalized));
          }}
        />
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export default function DollarInput<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
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
      render={({ field, fieldState }) => (
        <DollarInputInner
          field={field}
          fieldState={fieldState}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
