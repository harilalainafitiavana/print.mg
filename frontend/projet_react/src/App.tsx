import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Detaille from "./Components/Detaille";
import Login from "./Components/Login";
import Register from "./Components/Register";

export default function App() {
  return (
    <BrowserRouter>
      {/* Le contenu change selon la route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detaille" element={<Detaille />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
