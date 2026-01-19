"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/auth-utils";

export async function createStatement(
  numAssets: number,
  numLiabilities: number,
  formData: FormData
) {
  console.log({ numAssets, numLiabilities });
  console.log(formData);
}
