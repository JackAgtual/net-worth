import { FieldPath, FieldValues } from "react-hook-form";

export type FormError<T extends FieldValues> = {
  path: FieldPath<T> | "root";
  message: string;
};

type FailedActionResponse<T extends FieldValues> = {
  success: false;
  errors: FormError<T>[];
};

export type ActionResponse<T extends FieldValues> =
  | { success: true }
  | FailedActionResponse<T>;

export type ActionInputs = {
  entryId?: unknown;
  statementId?: unknown;
  path?: unknown;
};

type ValidatedActionInputs = {
  entryId: string;
  statementId: string;
  path: string;
};

export type ValidatedShape<T> = {
  [K in keyof T]-?: K extends keyof ValidatedActionInputs
    ? ValidatedActionInputs[K]
    : never;
};

export type InputValidationResponse<
  T extends FieldValues,
  U extends ActionInputs
> =
  | {
      success: true;
      data: ValidatedShape<U>;
    }
  | FailedActionResponse<T>;
