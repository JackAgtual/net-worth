import { FieldPath, FieldValues } from "react-hook-form";

export type ActionResponse<T extends FieldValues> =
  | { success: true }
  | {
      success: false;
      errors: { path: FieldPath<T> | "root"; message: string }[];
    };
