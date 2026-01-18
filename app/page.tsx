import { signIn } from "@/lib/actions/auth-actions";

import dbConnect from "@/lib/db/mongodb";
import { getSession } from "@/lib/auth/auth-utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  await dbConnect();

  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <main>
        <h1 className="flex justify-center">Net worth tracker</h1>
        <p>Hello</p>
        <form action={signIn}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required className="border-2" />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            required
            className="border-2"
          />
          <button type="submit">Sign in</button>
        </form>
        <Link href={"/create-account"}>Create an account</Link>
      </main>
    </div>
  );
}
