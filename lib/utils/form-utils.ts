import { FieldValues, UseFormSetError } from "react-hook-form";
import { FormError } from "../types/action-types";

export function setFormErrors<T extends FieldValues>(
  errors: FormError<T>[],
  setError: UseFormSetError<T>
) {
  errors.forEach((error) => {
    const { path, message } = error;
    setError(path, { message });
  });
}
