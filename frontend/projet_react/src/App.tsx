import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './Components/PrivateRoute';
import Home from "./Components/Home";
import Detaille from "./Components/Detaille";
import Login from "./Components/Login";
import Register from "./Components/Register";
import DashboardAdmin from "./pages/admin/AdminDashboard";
import DashboardUser from "./pages/User/UserDashboard"
import ForgotPassword from "./Components/Forgotpassword";
import ResetPassword from "./Components/ResetPassword";


export default function App() {
  return (
    <BrowserRouter>
      {/* Le contenu change selon la route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detaille" element={<Detaille />} />
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
  );
}
