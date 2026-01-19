import { redirect } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";
import { authClient } from "./auth-client";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function checkSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
