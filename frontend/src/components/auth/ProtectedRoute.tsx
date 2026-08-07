import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Wait until auth state is initialized
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  return <Outlet />;
}