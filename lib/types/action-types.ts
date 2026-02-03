import { FieldPath, FieldValues } from "react-hook-form";

export type FormError<T extends FieldValues> = {
  path: FieldPath<T> | "root";
  message: string;
};

export type ActionResponse<T extends FieldValues> =
  | { success: true }
  | {
      success: false;
      errors: FormError<T>[];
    };
