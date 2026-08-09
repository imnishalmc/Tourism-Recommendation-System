import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/services/api";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/auth";

export default function ChangePassword() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(
    data: ChangePasswordFormData
  ) {
    try {
      setServerError("");
      setSuccess("");

      await api.post("/accounts/changepw/", {
        old_password: data.old_password,
        new_password: data.new_password,
      });

      setSuccess("Password changed successfully.");

      reset();
    } catch (error: any) {
      if (error.response?.data?.error) {
        setServerError(error.response.data.error);
      } else {
        setServerError(
          "Unable to change password."
        );
      }
    }
  }

  return (
    <div className="mx-4 mt-8 max-w-md rounded-xl border bg-white p-5 shadow sm:mx-auto sm:mt-12 sm:p-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Change Password
      </h1>

      {serverError && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {serverError}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-1 block font-medium">
            Current Password
          </label>

          <div className="relative">
            <input
              type={
                showOld ? "text" : "password"
              }
              {...register("old_password")}
              className="w-full rounded border px-3 py-2 pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowOld(!showOld)
              }
              className="absolute right-3 top-3"
            >
              {showOld ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p className="mt-1 text-sm text-red-500">
            {errors.old_password?.message}
          </p>
        </div>

        <div>
          <label className="mb-1 block font-medium">
            New Password
          </label>

          <div className="relative">
            <input
              type={
                showNew ? "text" : "password"
              }
              {...register("new_password")}
              className="w-full rounded border px-3 py-2 pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="absolute right-3 top-3"
            >
              {showNew ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p className="mt-1 text-sm text-red-500">
            {errors.new_password?.message}
          </p>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          {isSubmitting
            ? "Changing..."
            : "Change Password"}
        </button>
      </form>
    </div>
  );
}
