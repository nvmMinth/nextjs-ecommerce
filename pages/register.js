import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  // useSession
  const { data: session } = useSession();
  console.log(session);
  // Router
  const router = useRouter();
  const { redirect } = router.query;
  // useEffect
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);
  // useForm
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  // handle onSubmit
  const onSubmit = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", { name, email, password });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="Register">
      <form className="max-w-screen-md" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl mb-4">Create an account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="w-full"
            autoFocus
            {...register("name", {
              required: "Name required",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full"
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
          <label htmlFor="password">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Password does not match!",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Submit</button>
        </div>
      </form>
    </Layout>
  );
}
