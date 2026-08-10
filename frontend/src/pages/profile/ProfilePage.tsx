import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";

import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ProfileForm = {
  full_name: string;
  district: string;
  province: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      full_name: "",
      district: "",
      province: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name ?? "",
        district: user.district ?? "",
        province: user.province ?? "",
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileForm) {
    setStatus(null);

    try {
      await api.patch("/accounts/profile/", {
        full_name: data.full_name,
        district: data.district,
        province: data.province,
      });

      await refreshProfile();

      setStatus({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Could not update profile. Please try again.",
      });
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Back to Home */}
      <div className="mb-6">
        <Link to="/">
          <Button
            variant="outline"
            className="rounded-full shimmer-color-gray-400"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Profile header card */}
      <div className="mb-6 flex items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {user.full_name ? (
            initials(user.full_name)
          ) : (
            <UserIcon className="size-6" />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">
            {user.full_name || "Your Profile"}
          </h1>

          <p className="truncate text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>

      {/* Status banner */}
      {status && (
        <div
          className={cn(
            "mb-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium",
            status.type === "success"
              ? "bg-secondary/10 text-secondary"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}

          {status.message}
        </div>
      )}

      {/* Edit form card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Email
          </label>

          <input
            value={user.email}
            disabled
            className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Full Name
          </label>

          <input
            {...register("full_name")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            placeholder="Enter your full name"
          />
        </div>

        {/* Location */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Location
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* District */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                District
              </label>

              <input
                {...register("district")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                placeholder="e.g. Kathmandu"
              />
            </div>

            {/* Province */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Province
              </label>

              <input
                {...register("province")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                placeholder="e.g. Bagmati"
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Your location helps us understand where you are travelling from.
          </p>
        </div>

        {/* Save Changes */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full font-semibold"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>

        {/* Change Password */}
        <div className="border-t border-border pt-5 text-center">
          <Link
            to="/profile/change-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Change Password
          </Link>
        </div>
      </form>
    </div>
  );
}