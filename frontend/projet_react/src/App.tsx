import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import PrivateRoute from './Components/PrivateRoute';
import Home from "./Components/Home";
import Detaille from "./Components/Detaille";
import Login from "./Components/Login";
import Register from "./Components/Register";
import DashboardAdmin from "./pages/admin/AdminDashboard";
import DashboardUser from "./pages/User/UserDashboard"
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import FeaturesDetailPage from "./Components/FeaturesDetailPage";

export default function App() {
  // Récupère le Client ID depuis .env
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detaille" element={<Detaille />} />
          <Route path="/features" element={<FeaturesDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

          <Route
            path="/dashboard-admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard-user"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <DashboardUser />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
