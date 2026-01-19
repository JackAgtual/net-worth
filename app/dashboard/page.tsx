import { signOut } from "@/lib/actions/auth-actions";
import { checkSession } from "@/lib/auth/auth-utils";
import Link from "next/link";

export default async function Home() {
  const session = await checkSession();

  return (
    <>
      <div>welcome {session.user.name}</div>
      <Link href={"/statements/create"}>New statement</Link>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}
