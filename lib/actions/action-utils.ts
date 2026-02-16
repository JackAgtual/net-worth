import { FieldPath, FieldValues } from "react-hook-form";
import { z, ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";
import {
  ActionInputs,
  FormError,
  FormValidationResponse,
  InputValidationResponse,
  ValidatedShape,
} from "../types/action-types";
import { mongoIdSchema } from "../types/mongo-types";

function getErrors<T extends FieldValues>(issues: $ZodIssue[]): FormError<T>[] {
  return issues.map((issue) => {
    return {
      path: issue.path.join(".") as FieldPath<T>,
      message: issue.message,
    };
  });
}

function safeParseId(id: unknown) {
  return mongoIdSchema.safeParse(id);
}

function safeParsePath(path: unknown) {
  return z.string().safeParse(path);
}

export function parseFormData<T extends ZodObject>(
  data: unknown,
  schema: T
): FormValidationResponse<z.infer<T>> {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      errors: getErrors<z.infer<T>>(parseResult.error.issues),
    };
  }
  return { success: true, data: parseResult.data };
}

export function validateActionInputs<U extends ActionInputs>({
  entryId,
  statementId,
  path,
}: U): InputValidationResponse<U> {
  const data = {} as ValidatedShape<U>;
  const errors: FormError<never>[] = [];

  if (entryId !== undefined) {
    const parseResult = safeParseId(entryId);
    if (parseResult.success) {
      data.entryId = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid entryId" });
    }
  }

  if (statementId !== undefined) {
    const parseResult = safeParseId(statementId);
    if (parseResult.success) {
      data.statementId = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid statementId" });
    }
  }

  if (path !== undefined) {
    const parseResult = safeParsePath(path);
    if (parseResult.success) {
      data.path = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid path" });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
}
