import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthorized, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    // When refreshing the page, verify cookie session with /api/v1/auth/me
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-medium text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not authorized, redirect to /admin/login
  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
