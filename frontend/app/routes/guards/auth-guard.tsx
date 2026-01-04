import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/provider/auth-context";
import { Loader } from "@/components/ui/loader";

const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
