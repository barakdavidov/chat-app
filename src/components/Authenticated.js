import { useAuthState } from "../util/firebase.config";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthenticatedRoute() {
  const { isAuthenticated } = useAuthState();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
}
