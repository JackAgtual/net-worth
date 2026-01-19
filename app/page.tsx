import { getSession } from "@/lib/auth/auth-utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <main>
        <h1 className="flex justify-center">Net worth tracker</h1>
        <p>Hello</p>
        <Link href={"/login"}>Log in</Link>
        <Link href={"/create-account"}>Create an account</Link>
      </main>
    </div>
  );
}
