import { signOut } from "@/lib/actions/auth-actions";
import { getSession } from "@/lib/auth/auth-utils";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    return <div>invalid session</div>;
  }
  return (
    <>
      <div>welcome {session.user.name}</div>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}
