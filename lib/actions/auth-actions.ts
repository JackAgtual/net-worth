"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth/auth";
import { headers } from "next/headers";

export async function createAccount(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  await auth.api.signUpEmail({
    body: { name, email, password },
  });

  redirect("/dashboard");
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
