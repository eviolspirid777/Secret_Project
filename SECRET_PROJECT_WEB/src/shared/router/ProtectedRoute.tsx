import { Outlet, Navigate } from "react-router";
import { useAuth } from "../hooks/autorization/useAuth";

export const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return <div>Загрузка...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/autorize" />;
  }

  return <Outlet />;
};
