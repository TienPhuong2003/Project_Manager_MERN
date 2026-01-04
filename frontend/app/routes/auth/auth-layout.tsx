import { Outlet } from "react-router";
import { useAuth } from "@/provider/auth-context";

const AuthLayout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default AuthLayout;
