import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Detaille from "./Components/Detaille";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserDashboard from "./pages/User/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      {/* Le contenu change selon la route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detaille" element={<Detaille />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
