import {
  liabilityFormSchema,
  LiabilityForm as TLiabilityForm,
} from "@/lib/types/liability-types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  useForm,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DollarInput from "./DollarInput";

type LiabilityFormProps<
  TForm extends FieldValues & TLiabilityForm = TLiabilityForm
> = {
  control?: Control<any>; // TODO: Fix types
  baseName?: FieldPath<TForm>;
  data?: TLiabilityForm;
};

export default function LiabilityForm<
  TForm extends FieldValues & TLiabilityForm = TLiabilityForm
>({ control, baseName, data }: LiabilityFormProps<TForm>) {
  const { control: localControl } = useForm<TLiabilityForm>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      title: data?.title,
      amount: data?.amount,
      notes: data?.notes,
    },
  });

  function getName(name: FieldPath<TLiabilityForm>): FieldPath<TForm> {
    if (!baseName) return name as FieldPath<TForm>;

    return `${baseName}.${name}` as FieldPath<TForm>;
  }

  const usedControl = control ?? (localControl as unknown as Control<TForm>);

  return (
    <>
      <Controller
        name={getName("title")}
        control={usedControl}
        render={({ field: controllerField, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              {...controllerField}
              id={getName("title")}
              placeholder="Credit card 1"
              type="string"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <DollarInput
        control={usedControl}
        label="Amount"
        name={getName("amount")}
      />
      <Controller
        name={getName("notes")}
        control={usedControl}
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
