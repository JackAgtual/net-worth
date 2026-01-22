import { setPassword } from "better-auth/api";
import z from "zod";

export type UserItem = {
  userId: string;
};

export type Entry = UserItem & {
  title: string;
  amount: number;
  notes?: string;
};

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}

export const createAccountSchema = z
  .object({
    name: z.string().trim().nonempty("Name is required"),
    email: z.email().toLowerCase().trim().nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
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

export const loginSchema = z.object({
  email: z.email().toLowerCase().trim().nonempty("Eamail required"),
  password: z.string().nonempty("Password required"),
});

export type Login = z.infer<typeof loginSchema>;

export type LoginResponse =
  | { success: true }
  | { success: false; error: string };
