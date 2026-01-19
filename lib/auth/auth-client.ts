import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export function checkSessionClient() {
  const { data: session } = authClient.useSession();
  if (!session) {
    console.log("invalid client session");
    redirect("/login");
  }
  return session;
}
