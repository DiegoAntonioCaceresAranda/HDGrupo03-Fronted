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

const App: FC = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<PaginaDashboard/>} />
      <Route path="/admin/ventas" element={<PaginaVentas/>} />
      <Route path="/admin/products" element={<ProductosPage/>}/>
      <Route path="/admin/categories" element={<CategoriasPage/>}/>
      <Route path="/admin/reports" element={<PaginaReportes/>} />
      <Route path="/principal" element={<ClienteHome/>}/>
      <Route path="/carta-principal" element={<CartaPrincipal/>}/>
      <Route path="/admin/usuarios" element={<UsuarioPage/>}/>
      <Route path="/admin/roles" element={<RolesPage/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;
