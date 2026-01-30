"use server";

import {
  CreateAccount,
  createAccountSchema,
  Login,
  loginSchema,
} from "@/types/auth-types";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth/auth";
import { ActionResponse } from "./action-types";
import { getErrors } from "./action-utils";

export async function createAccount(
  formData: unknown
): Promise<ActionResponse<CreateAccount>> {
  const result = createAccountSchema.safeParse(formData);

  if (!result.success) {
    const errors = getErrors<CreateAccount>(result.error.issues);
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

export async function logIn(formData: unknown): Promise<ActionResponse<Login>> {
  const result = loginSchema.safeParse(formData);
  const badResult: ActionResponse<Login> = {
    success: false,
    errors: [{ path: "root", message: "Incorrect username or password" }],
  };

  if (!result.success) {
    return badResult;
  }

  const { email, password } = result.data;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
      headers: await headers(),
    });

    if (response.ok) {
      return { success: true };
    }
  } catch {
    return {
      success: false,
      errors: [{ path: "root", message: "Something went wrong" }],
    };
  }

  return badResult;
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}
