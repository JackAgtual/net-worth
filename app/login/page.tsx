"use client";

import { logIn } from "@/lib/actions/auth-actions";
import { Login, loginSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Login>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: Login) => {
    const response = await logIn(data);

    if (response.success) {
      redirect("/dashboard");
    }

    setError("root", { message: response.error });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Email</label>
      <input {...register("email")} type="email" className="border-2" />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="password">Password</label>
      <input
        {...register("password")}
        type="password"
        name="password"
        className="border-2"
      />
      {errors.password && <p>{errors.password.message}</p>}
      {errors.root && <p>{errors.root.message}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}
