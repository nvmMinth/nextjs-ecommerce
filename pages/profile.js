import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Profile = () => {
  // useSession
  const { data: session } = useSession();
  console.log(session);
  // router
  const router = useRouter();
  // useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  // useEffect
  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [setValue, session.user]);
  // handle Submit
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/profile", { name, email, password });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
    router.push("/");
  };
  return (
    <Layout title="Profile">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-xl mb-4">Update Profile</h1>
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
                message: "Password must be 6 chars at least",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500">Password doest not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Submit</button>
        </div>
      </form>
    </Layout>
  );
};

export default Profile;
Profile.auth = true