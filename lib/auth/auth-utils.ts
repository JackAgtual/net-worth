import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import dbConnect from "../db/mongodb";

export async function getSession() {
  await dbConnect();
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getValidSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Invalid session");
  }
  return session;
}

export async function checkSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
