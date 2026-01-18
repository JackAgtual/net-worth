import { createAccount } from "@/lib/actions/auth-actions";

export default function Page() {
  return (
    <>
      <h1>Create account</h1>
      <form action={createAccount}>
        <label htmlFor="name">Name</label>
        <input type="string" name="name" required className="border-2" />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" required className="border-2" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required className="border-2" />
        <button type="submit">Create account</button>
      </form>
    </>
  );
}
