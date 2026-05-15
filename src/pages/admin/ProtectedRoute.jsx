import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <Loader2 size={28} className="animate-spin text-[#0a96f4]" />
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
