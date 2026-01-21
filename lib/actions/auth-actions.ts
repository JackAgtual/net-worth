"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth/auth";
import { headers } from "next/headers";
import { CreateAccountResponse, createAccountSchema } from "../types";
import { APIError } from "better-auth";

export async function createAccount(
  formData: unknown
): Promise<CreateAccountResponse> {
  const result = createAccountSchema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return {
        path: issue.path[0].toString(),
        message: issue.message,
      };
    });
    return { success: false, errors };
  }

  const { name, email, password } = result.data;

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof APIError) {
      console.log(err);
      return {
        success: false,
        errors: [{ path: "email", message: err.message }], // assuming email error
      };
    }
  }

  return {
    success: false,
    errors: [{ path: "root", message: "Unknown error" }],
  };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid form data");
  }
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
    headers: await headers(),
  });

  if (!response.ok) {
    return;
  }

  redirect("/dashboard");
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}
