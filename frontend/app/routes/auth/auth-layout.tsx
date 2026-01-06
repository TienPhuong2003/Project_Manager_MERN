import { Outlet } from "react-router";
import { useAuth } from "@/provider/auth-context";
import { Loader } from "@/components/ui/loader";

const AuthLayout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <Outlet />;
};

export default AuthLayout;
