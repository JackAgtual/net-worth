import { FieldPath, FieldValues } from "react-hook-form";
import { $ZodIssue } from "zod/v4/core";

export function getErrors<T extends FieldValues>(issues: $ZodIssue[]) {
  return issues.map((issue) => {
    return {
      path: issue.path.join(".") as FieldPath<T>,
      message: issue.message,
    };
  });
}
