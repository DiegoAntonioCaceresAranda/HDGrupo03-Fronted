import { useState } from "react";
import logo from "../assets/logo.jpeg";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { FC, ReactElement } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Grid3x3,
  ChevronDown,
  User,
  Users,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import "../styles/admin.css";

interface NavLink {
  label: string;
  icon: LucideIcon;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "Tablero de Control", icon: LayoutDashboard, path: "/admin" },
  { label: "Punto de Venta", icon: ShoppingCart, path: "/admin/ventas" },
  { label: "Categorias", icon: ShoppingBag, path: "/admin/categories" },
  { label: "Inventario", icon: Package, path: "/admin/products" },
  { label: "Reportes", icon: BarChart3, path: "/admin/reports" },
];

const footerLinks: NavLink[] = [
  { label: "Configuración", icon: Settings, path: "/admin/settings" },
  { label: "Ayuda", icon: HelpCircle, path: "/admin/help" },
];

const AdminLayout: FC = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersOpen, setUsersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell d-flex min-vh-100 w-100">
      <nav className="d-none d-md-flex flex-column admin-sidebar vh-100 p-4 position-fixed top-0 start-0 border-end">
        <div className="d-flex align-items-center gap-3 mb-5 px-1">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle flex-shrink-0"
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
          <div>
            <h1
              className="fw-bold lh-1 mb-0"
              style={{
                fontFamily: "var(--admin-font-display)",
                color: "var(--admin-primary)",
                fontSize: 20,
              }}
            >
              Mi Tienda
            </h1>
            <p
              className="mb-0 mt-1"
              style={{ color: "var(--admin-on-surface-variant)", fontSize: 12 }}
            >
              Admin Dashboard
            </p>
          </div>
        </div>

        <div className="d-flex flex-column gap-2 flex-grow-1">
          {navLinks.map(({ label, icon: Icon, path }) => (
            <Link
              key={label}
              to={path}
              className={`admin-nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
                location.pathname === path ? "active" : ""
              }`}
            >
              <Icon size={20} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
            </Link>
          ))}

          <div>
            <button
              type="button"
              onClick={() => setUsersOpen(!usersOpen)}
              className="admin-nav-link w-100 d-flex align-items-center gap-3 px-3 py-2 rounded border-0"
              style={{
                background: "transparent",
                textAlign: "left",
              }}
            >
              <Users size={20} />

              <span style={{ fontSize: 14, fontWeight: 600 }}>
                Usuarios y Roles
              </span>

              <ChevronDown
                size={18}
                className="ms-auto"
                style={{
                  transform: usersOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {usersOpen && (
              <div className="d-flex flex-column mt-1 ms-4 gap-1">
                <Link
                  to="/admin/usuarios"
                  className={`admin-nav-link px-3 py-2 rounded text-decoration-none ${
                    location.pathname === "/admin/usuarios" ? "active" : ""
                  }`}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    Usuarios
                  </span>
                </Link>

                <Link
                  to="/admin/roles"
                  className={`admin-nav-link px-3 py-2 rounded text-decoration-none ${
                    location.pathname === "/admin/roles" ? "active" : ""
                  }`}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Roles</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div
          className="d-flex flex-column gap-2 mt-auto pt-3 border-top"
          style={{ borderColor: "var(--admin-surface-container-low)" }}
        >
          {footerLinks.map(({ label, icon: Icon, path }) => (
            <Link
              key={label}
              to={path}
              className="admin-nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
            >
              <Icon size={20} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="admin-main d-flex flex-column w-100 min-vh-100">
        <header
          className="d-none d-md-flex justify-content-between align-items-center px-3 border-bottom shadow-sm sticky-top"
          style={{
            backgroundColor: "var(--admin-surface)",
            height: 64,
            zIndex: 10,
          }}
        >
          <div className="flex-grow-1 d-flex align-items-center">
            <div className="position-relative w-100">
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: "var(--admin-on-surface-variant)" }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="form-control rounded-pill ps-5"
                style={{
                  backgroundColor: "var(--admin-surface-container-low)",
                  border: "1px solid transparent",
                  fontSize: 14,
                  height: 40,
                }}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              aria-label="Notifications"
              className="btn admin-icon-btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              <Bell size={20} />
            </button>
            <button
              aria-label="Apps"
              className="btn admin-icon-btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              <Grid3x3 size={20} />
            </button>

            <div className="position-relative ms-2">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="btn admin-profile-btn d-flex align-items-center gap-2 p-1 rounded-pill"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "var(--admin-secondary-container)",
                  }}
                >
                  <User size={18} color="var(--admin-secondary)" />
                </div>
                <ChevronDown
                  size={18}
                  style={{
                    color: "var(--admin-on-surface-variant)",
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {profileOpen && (
                <div
                  className="position-absolute end-0 mt-2 p-2 rounded-3 shadow border"
                  style={{
                    backgroundColor: "var(--admin-surface, #ffffff)",
                    minWidth: 180,
                    zIndex: 1050,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn w-100 d-flex align-items-center gap-2 text-start px-3 py-2 rounded-2 border-0"
                    style={{ color: "#b3261e", fontSize: 14, fontWeight: 600 }}
                  >
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main
          className="flex-grow-1 p-4 w-100"
          style={{ maxWidth: 1440, marginInline: "auto" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;