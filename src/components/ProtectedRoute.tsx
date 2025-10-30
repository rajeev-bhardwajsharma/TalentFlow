import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("hr" | "candidate")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["hr", "candidate"],
}) => {
  const { role } = useUser();

  // If no role is set, redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // If role is set but not allowed for this route, redirect appropriately
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "hr" ? "/dashboard" : "/jobs"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
