"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createAccount } from "@/lib/actions/auth-actions";
import { CreateAccount, createAccountSchema } from "@/types/auth-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function Page() {
  const {
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<CreateAccount>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { email: "", name: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

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
    <Card>
      <CardHeader>Create account</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirm password</FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Create account</Button>
            </Field>
            {errors.root && (
              <FieldError errors={[{ message: "Something went wrong" }]} />
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
