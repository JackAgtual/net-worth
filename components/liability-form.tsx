import {
  LiabilityHydrated,
  LiabilityForm as TLiabilityForm,
  liabilityFormSchema,
} from "@/lib/types/liability-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import DollarInput from "./shared/DollarInput";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type LiabilityFormProps = {
  data?: TLiabilityForm;
};

// TODO: Use this component in liabilities form (create statement)
export default function LiabilityForm({ data }: LiabilityFormProps) {
  const { control } = useForm<TLiabilityForm>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      title: data?.title,
      amount: data?.amount,
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
              placeholder="Credit card 1"
              type="string"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <DollarInput control={control} label="Amount" name="amount" />
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
