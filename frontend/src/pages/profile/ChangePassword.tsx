import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/services/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/auth";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordFormData) {
    setServerError("");
    try {
      await api.post("/accounts/changepw/", {
        old_password: data.old_password,
        new_password: data.new_password,
      });

      // Redirect home immediately, carrying the toast message with us —
      // no need to show a success state on this page first, since the
      // homepage toast is the confirmation the user sees.
      navigate("/", { state: { toast: "Password changed successfully." } });
    } catch (error: any) {
      setServerError(
        error.response?.data?.error || "Unable to change password. Please try again."
      );
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10 md:py-16">
      <Link to="/profile">
        <Button variant="outline" className="mb-6 rounded-full font-medium">
          <ArrowLeft className="size-4" />
          Back to Profile
        </Button>
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h1 className="mb-1 text-2xl font-bold tracking-tight">Change Password</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Choose a strong password you haven't used before.
        </p>

        {serverError && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                {...register("old_password")}
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                  errors.old_password ? "border-destructive" : "border-border focus:border-primary"
                )}
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.old_password && (
              <p className="mt-1.5 text-sm text-destructive">{errors.old_password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                {...register("new_password")}
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                  errors.new_password ? "border-destructive" : "border-border focus:border-primary"
                )}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-1.5 text-sm text-destructive">{errors.new_password.message}</p>
            )}
          </div>

          {/* THIS FIELD WAS MISSING — the actual bug */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirm_password")}
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-colors",
                  errors.confirm_password ? "border-destructive" : "border-border focus:border-primary"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-1.5 text-sm text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full rounded-full font-semibold">
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}