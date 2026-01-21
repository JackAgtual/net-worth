import z from "zod";

export interface UserItem {
  userId: string;
}

export interface Entry extends UserItem {
  title: string;
  amount: number;
  notes?: string;
}

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

export const createAccountSchema = z
  .object({
    name: z.string().trim(),
    email: z.email().toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type CreateAccount = z.infer<typeof createAccountSchema>;

export type CreateAccountResponse =
  | { success: true }
  | {
      success: false;
      errors: { path: string; message: string }[];
    };
