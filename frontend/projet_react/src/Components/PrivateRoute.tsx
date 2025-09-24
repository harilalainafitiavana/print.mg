import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // rôles autorisés, ex: ['ADMIN']
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  if (!token) {
    // pas connecté, redirige vers login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    // connecté mais rôle non autorisé
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
