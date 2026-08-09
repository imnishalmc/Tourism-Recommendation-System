import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

type ProfileForm = {
  full_name: string;
  trip_duration: number | "";
};

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        trip_duration: user.trip_duration ?? "",
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileForm) {
    try {
      await api.patch("/accounts/profile/", {
        full_name: data.full_name,
        trip_duration:
          data.trip_duration === ""
            ? null
            : Number(data.trip_duration),
      });

      await refreshProfile();

      alert("Profile updated successfully.");
    } catch {
      alert("Failed to update profile.");
    }
  }

  if (!user) return null;

  return (
    <div className="mx-4 mt-8 max-w-xl rounded-xl border bg-white p-5 shadow sm:mx-auto sm:mt-12 sm:p-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        My Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-1 block font-medium">
            Email
          </label>

          <input
            value={user.email}
            disabled
            className="w-full rounded border bg-gray-100 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Full Name
          </label>

          <input
            {...register("full_name")}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Trip Duration (Days)
          </label>

          <input
            type="number"
            {...register("trip_duration")}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Changes"}
        </button>

        <Link
          to="/profile/change-password"
          className="block text-center font-medium text-blue-600 hover:underline"
        >
          Change Password
        </Link>
      </form>
    </div>
  );
}
