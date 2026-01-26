import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});
