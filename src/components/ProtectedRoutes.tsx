
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/AuthServices";

export default function ProtectedRoute() {
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let activo = true;

    const verificarSesion = async () => {
      const token = localStorage.getItem("collins_token");

      if (!token) {
        if (activo) {
          setAutorizado(false);
          setVerificando(false);
        }
        return;
      }

      try {
        // Comprueba el token contra FastAPI
        await authService.obtenerUsuarioActual();

        if (activo) {
          setAutorizado(true);
        }
      } catch {
        // Token inválido o vencido
        authService.cerrarSesion();

        if (activo) {
          setAutorizado(false);
        }
      } finally {
        if (activo) {
          setVerificando(false);
        }
      }
    };

    verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  if (verificando) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        Verificando sesión...
      </div>
    );
  }

  if (!autorizado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
