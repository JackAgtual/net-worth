"use client";

import { createAccount } from "@/lib/actions/auth-actions";
import { CreateAccount, createAccountSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateAccount>({ resolver: zodResolver(createAccountSchema) });

  const onSubmit = async (data: CreateAccount) => {
    const response = await createAccount(data);

    if (response.success) {
      redirect("/dashboard");
    }

    response.errors.forEach((error) => {
      const { path, message } = error;
      if (
        path === "root" ||
        path === "name" ||
        path === "email" ||
        path === "password" ||
        path === "confirmPassword"
      ) {
        setError(path, { message });
      }
    });
  };

  return (
    <>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input {...register("name")} type="string" className="border-2" />
        <label htmlFor="email">Email</label>
        <input {...register("email")} type="email" className="border-2" />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="password">Password</label>
        <input {...register("password")} type="password" className="border-2" />
        {errors.password && <p>{errors.password.message}</p>}

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="border-2"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        {errors.root && <p>{errors.root.message}</p>}
        <button type="submit">Create account</button>
      </form>
    </>
  );
}
