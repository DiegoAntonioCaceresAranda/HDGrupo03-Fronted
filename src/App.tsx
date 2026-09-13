import type { FC, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaReportes from "./pages/PaginaReportes";
import { CategoriasPage } from "./pages/CategoriaPage";
import { ProductosPage } from "./pages/ProductosPage";
import { UsuarioPage } from "./pages/UsuarioPage";

const App: FC = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<PaginaDashboard/>} />
      <Route path="/admin/products" element={<ProductosPage/>}/>
      <Route path="/admin/categories" element={<CategoriasPage/>}/>
      <Route path="/admin/reports" element={<PaginaReportes/>} />
      <Route path="/admin/users" element={<UsuarioPage/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
