import { Controller, FieldPath, FieldPathValue } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "../ui/input-group";
import {
  StatementForm,
  StatementFormControl,
} from "@/lib/types/statement-types";

type DollarInputProps<TName extends FieldPath<StatementForm>> = {
  name: TName;
  label: string;
  control: StatementFormControl;
};

export default function DollarInput<TName extends FieldPath<StatementForm>>({
  name,
  label,
  control,
}: DollarInputProps<TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const val = field.value as FieldPathValue<StatementForm, TName> &
          (number | undefined);
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
                placeholder="1,500"
                type="number"
                value={val ?? ""}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  field.onChange(Number.isFinite(val) ? val : undefined);
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
