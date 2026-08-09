import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";

import api from "@/services/api";

import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      setServerError("");
      setSuccessMessage("");

      await api.post("/accounts/register/", {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });

      reset();

      setSuccessMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response?.data) {
        const response = error.response.data;

        if (response.error) {
          setServerError(response.error);
        } else if (typeof response === "object") {
          const firstError = Object.values(response)[0];

          if (Array.isArray(firstError)) {
            setServerError(firstError[0]);
          } else {
            setServerError(String(firstError));
          }
        } else {
          setServerError("Registration failed.");
        }
      } else {
        setServerError(
          "Unable to register. Please try again."
        );
      }
    }
  }

  return (
    <div className="mx-4 mt-8 max-w-md rounded-xl border bg-white p-5 shadow-lg sm:mx-auto sm:mt-20 sm:p-8">
      <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
        Create Account
      </h1>

      <p className="mb-6 text-center text-gray-500">
        Join SajiloYatra and start planning your trips.
      </p>

      {serverError && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Full Name */}

        <div>
          <label className="mb-1 block font-medium">
            Full Name
          </label>

          <input
            {...register("full_name")}
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />

          {errors.full_name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label className="mb-1 block font-medium">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <label className="mb-1 block font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none"
              placeholder="Create a password"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}

        <div>
          <label className="mb-1 block font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              {...register("confirm_password")}
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none"
              placeholder="Confirm your password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating Account..."
            : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
