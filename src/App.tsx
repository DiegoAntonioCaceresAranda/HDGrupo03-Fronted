import type { FC, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaReportes from "./pages/PaginaReportes";

const App: FC = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PaginaDashboard />} />
      <Route path="/admin/reports" element={<PaginaReportes />} />
    </Routes>
  </BrowserRouter>
);

export default App;
