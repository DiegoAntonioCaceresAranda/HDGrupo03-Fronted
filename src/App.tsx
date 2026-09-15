import type { FC, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaReportes from "./pages/PaginaReportes";
import { CategoriasPage } from "./pages/CategoriaPage";
import { ProductosPage } from "./pages/ProductosPage";
import ClienteHome from "./pages/ClienteHome";
import CartaPrincipal from "./pages/CartaPrincipal";
import { UsuarioPage } from "./pages/UsuarioPage";
import RolesPage from "./pages/RolPage";
import PaginaVentas from "./pages/PaginaVentas";
import AdminLayout from "./components/AdminLayout";

const App: FC = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Cliente */}
      <Route path="/principal" element={<ClienteHome />} />
      <Route path="/carta-principal" element={<CartaPrincipal />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PaginaDashboard />} />
        <Route path="ventas" element={<PaginaVentas />} />
        <Route path="products" element={<ProductosPage />} />
        <Route path="categories" element={<CategoriasPage />} />
        <Route path="reports" element={<PaginaReportes />} />
        <Route path="usuarios" element={<UsuarioPage />} />
        <Route path="roles" element={<RolesPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
