import { FieldPath, FieldValues } from "react-hook-form";
import { z } from "zod";
import { $ZodIssue } from "zod/v4/core";
import { mongoIdSchema } from "../types/mongo-types";

export function getErrors<T extends FieldValues>(issues: $ZodIssue[]) {
  return issues.map((issue) => {
    return {
      path: issue.path.join(".") as FieldPath<T>,
      message: issue.message,
    };
  });
}

export function validateId(id: unknown) {
  const idParseResult = mongoIdSchema.safeParse(id);
  if (!idParseResult.success) {
    throw new Error("Invalid ID");
  }
  return idParseResult;
}

export function validatePath(path: unknown) {
  const pathParseResult = z.string().safeParse(path);
  if (!pathParseResult.success) {
    throw new Error("Invalid path");
  }
  return pathParseResult;
}
