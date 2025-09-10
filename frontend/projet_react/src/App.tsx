import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";

export default function App() {
  return (
    <BrowserRouter>
      {/* Le contenu change selon la route */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
