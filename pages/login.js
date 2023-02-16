import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { signIn, useSession } from "next-auth/react"
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";

export default function Login() {
  // useSession
  const { data: session } = useSession()
  console.log(session);
  // Router
  const router = useRouter()
  const { redirect } = router.query
  // useEffect
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/")
    }
  }, [router, session, redirect])
  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // handle onSubmit
  const onSubmit = async ({ email, password }) => {

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error(getError(error))
    }
  };
  return (
    <Layout title="Login">
      <form className="max-w-screen-md" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl mb-4">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full"
            autoFocus
            {...register("email", {
              required: "Email address required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: "Email address must be valid",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full"
            autoFocus
            {...register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 chars",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div>
          <p className="text-sm">
            Do not have an account? &nbsp;
            <Link href="/register" className="underline underline-offset-2">
              Register now
            </Link>
          </p>
        </div>
      </form>
    </Layout>
  );
}
