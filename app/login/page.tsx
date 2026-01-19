import { signIn } from "@/lib/actions/auth-actions";

export default function Page() {
  return (
    <form action={signIn}>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" required className="border-2" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" required className="border-2" />
      <button type="submit">Log in</button>
    </form>
  );
}
