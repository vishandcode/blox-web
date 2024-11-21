"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
type FormType = "sign-in" | "sign-up";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { useState } from "react";

import { AuthOTPModal } from "./auth-otp-modal";
import { Spinner } from "./ui/spinner";
import { PublicAxiosInstance } from "@/utils/Instance";

export default function AuthForm({ type }: { type: FormType }) {
  const [Loading, SetLoading] = useState<boolean>(false);
  const [ErrorMessage, SetErrorMessage] = useState<string>("");
  const [account_id, set_account_id] = useState<boolean>(false);

  const formSchema = z.object({
    email: z.string().email(),
    name:
      type === "sign-up"
        ? z
            .string()
            .min(2, {
              message: "Username must be at least 2 characters.",
            })
            .max(50)
        : z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    SetLoading(true);
    SetErrorMessage("");
    try {
      if (type === "sign-up") {
        const response = await PublicAxiosInstance.post("/users/sign-up", {
          email: values.email,
          name: values.name,
        });
        set_account_id(true);
      }
      if (type === "sign-in") {
        const response = await PublicAxiosInstance.post("/users/sign-in", {
          email: values.email,
        });
        set_account_id(true);
      }
    } catch (error: any) {
      SetErrorMessage(error.response.data.message);
    } finally {
      SetLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 center w-11/12 mx-auto lg:w-3/12 xl:2/12 "
        >
          <h1 className="text-center text-2xl font-bold text-primary">
            {type === "sign-up" ? "Sign Up" : "Sign In"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you Name"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email "
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {ErrorMessage && (
            <p className="text-sm text-center text-destructive">
              {ErrorMessage}
            </p>
          )}
          <Button type="submit" disabled={Loading}>
            {type === "sign-up" ? "Sign up" : "Sign in"}

            <Spinner color={"secondary"} show={Loading} />
          </Button>
          <span className="flex text-sm justify-center">
            <p className="font-bold">
              {type === "sign-up"
                ? "Already have an account ?"
                : "Don't have an account ?"}
            </p>
            <Link
              href={type === "sign-up" ? "/sign-in" : "/sign-up"}
              className="ml-2 "
            >
              {type === "sign-up" ? "Sign in" : "Sign up"}
            </Link>
          </span>
        </form>
      </Form>
      {account_id && (
        <AuthOTPModal email={form.getValues("email")} account_id={account_id} />
      )}
    </>
  );
}
