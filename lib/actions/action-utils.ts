import { FieldPath, FieldValues } from "react-hook-form";
import { z, ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";
import {
  ActionInputs,
  FailedActionResponse,
  FormError,
  InputValidationResponse,
  ValidatedShape,
} from "../types/action-types";
import { mongoIdSchema } from "../types/mongo-types";

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
