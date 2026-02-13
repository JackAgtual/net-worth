import { FieldPath, FieldValues } from "react-hook-form";
import { z, ZodBoolean, ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";
import {
  ActionInputs,
  FormError,
  InputValidationResponse,
  ValidatedShape,
} from "../types/action-types";
import { mongoIdSchema } from "../types/mongo-types";
import { LiabilityForm, liabilityFormSchema } from "../types/liability-types";
import { assetFormSchema } from "../types/asset-types";
import { statementFormSchema } from "../types/statement-types";

export function getErrors<T extends FieldValues>(
  issues: $ZodIssue[]
): FormError<T>[] {
  return issues.map((issue) => {
    return {
      path: issue.path.join(".") as FieldPath<T>,
      message: issue.message,
    };
  });
}

// TODO: Delete
export function validateId(id: unknown) {
  const idParseResult = mongoIdSchema.safeParse(id);
  if (!idParseResult.success) {
    throw new Error("Invalid ID");
  }
  return idParseResult;
}

// TODO: Delete
export function validatePath(path: unknown) {
  const pathParseResult = z.string().safeParse(path);
  if (!pathParseResult.success) {
    throw new Error("Invalid path");
  }
  return pathParseResult;
}

function safeParseId(id: unknown) {
  return mongoIdSchema.safeParse(id);
}

function safeParsePath(path: unknown) {
  return z.string().safeParse(path);
}

function parseFormData<T>(data: unknown, schema: ZodObject) {
  const parseResult = schema.safeParse(data);
}

export function validateActionInputs<
  T extends FieldValues,
  U extends ActionInputs = ActionInputs
>({
  entryId,
  statementId,
  path,
  liabilityFormData,
  assetFormData,
  statementFormData,
}: U): InputValidationResponse<T, U> {
  const data = {} as ValidatedShape<U>;
  const errors: FormError<T>[] = [];

  if (entryId) {
    const parseResult = safeParseId(entryId);
    if (parseResult.success) {
      data.entryId = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid entryId" });
    }
  }

  if (statementId) {
    const parseResult = safeParseId(statementId);
    if (parseResult.success) {
      data.statementId = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid statementId" });
    }
  }

  if (path) {
    const parseResult = safeParsePath(path);
    if (parseResult.success) {
      data.path = parseResult.data;
    } else {
      errors.push({ path: "root", message: "Invalid path" });
    }
  }

  if (liabilityFormData) {
    const parseResult = liabilityFormSchema.safeParse(liabilityFormData);
    if (parseResult.success) {
      data.liabilityFormData = parseResult.data;
    } else {
      errors.push(...getErrors<T>(parseResult.error.issues));
    }
  }

  if (assetFormData) {
    const parseResult = assetFormSchema.safeParse(assetFormData);
    if (parseResult.success) {
      data.assetFormData = parseResult.data;
    } else {
      errors.push(...getErrors<T>(parseResult.error.issues));
    }
  }

  if (statementFormData) {
    const parseResult = statementFormSchema.safeParse(statementFormData);
    if (parseResult.success) {
      data.statementFormData = parseResult.data;
    } else {
      errors.push(...getErrors<T>(parseResult.error.issues));
    }
  }

  if (errors.length) {
    return {
      success: false,
      errors,
    };
  }
  return { success: true, data };
}
