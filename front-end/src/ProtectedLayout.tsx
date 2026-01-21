import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "./hooks/auth.tsx";

interface ProtectedLayoutProps {
  needAuth?: boolean;
}

const ProtectedLayout = ({ needAuth = true }: ProtectedLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!needAuth && isAuthenticated) {
    const state = location.state as { from?: Location } | undefined;
    const from = state?.from?.pathname || "/";

    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
