import React, { useState, useEffect } from 'react';
import logoLogin from '../assets/login.png'; // Imagen para la tarjeta de login
import logoCortina from '../assets/cafe.png'; // Imagen para la pantalla de cortina

const Login = () => {
  const [showCurtain, setShowCurtain] = useState(true);

  // Mantiene la cortina visible durante 1.8s antes de ocultarse
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Cargar Bootstrap y Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      {/* Animación Keyframes */}
      <style>{`
        @keyframes slideUpCurtain {
          0% { transform: translateY(0%); opacity: 1; }
          80% { transform: translateY(0%); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes fadeInLogo {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .curtain-overlay {
          animation: slideUpCurtain 1.8s ease-in-out forwards;
        }
        .curtain-logo-anim {
          animation: fadeInLogo 1.2s ease-out forwards;
        }
      `}</style>

      {/* --- EFECTO CORTINA (Usa cafe.png) --- */}
      {showCurtain && (
        <div
          className="curtain-overlay position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#f7f3ee', zIndex: 9999 }}
        >
          <div className="text-center curtain-logo-anim">
            <img
              src={logoCortina} /* <--- AQUÍ SE USA CAFE.PNG */
              alt="Collins Café Logo Cortina"
              className="img-fluid rounded-circle bg-white p-3 shadow-lg mb-3"
              style={{ width: '110px', height: '110px', objectFit: 'contain' }}
            />
            <h2 className="h5 fw-bold" style={{ color: '#4a2c11', letterSpacing: '1px' }}>
              COLLINS CAFÉ
            </h2>
          </div>
        </div>
      )}

      {/* --- INTERFAZ DE LOGIN (Usa login.png) --- */}
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center p-3"
        style={{ backgroundColor: '#f7f3ee' }}
      >
        <div
          className="card shadow border-0 rounded-4 overflow-hidden"
          style={{ maxWidth: '360px', width: '100%', backgroundColor: '#ffffff' }}
        >
          {/* Encabezado: Café oscuro (#4a2c11) */}
          <div
            className="text-white text-center p-3"
            style={{ backgroundColor: '#4a2c11' }}
          >
            <img
              src={logoLogin} /* <--- AQUÍ SE USA LOGIN.PNG */
              alt="Collins Café Logo Login"
              className="img-fluid rounded-circle bg-white p-2 mb-2 shadow-sm"
              style={{ width: '70px', height: '70px', objectFit: 'contain' }}
            />
            <h1 className="h6 fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>
              COLLINS CAFÉ
            </h1>
            <p className="text-white-50 mb-0" style={{ fontSize: '0.8rem' }}>
              Accede a tu cuenta de administración
            </p>
          </div>

          {/* Formulario */}
          <div className="card-body p-4">
            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* Correo */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold text-muted mb-1"
                  style={{ fontSize: '0.82rem' }}
                >
                  Correo Electrónico
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#fcfaf8' }}>
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="tucorreo@ejemplo.com"
                    style={{ backgroundColor: '#fcfaf8', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label
                    className="form-label fw-semibold text-muted mb-0"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Contraseña
                  </label>
                  <a
                    href="#forgot"
                    className="text-decoration-none fw-semibold"
                    style={{ fontSize: '0.78rem', color: '#8c5a2b' }}
                  >
                    ¿Olvidaste tu clave?
                  </a>
                </div>
                <div className="input-group input-group-sm">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#fcfaf8' }}>
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 border-end-0"
                    placeholder="••••••••"
                    style={{ backgroundColor: '#fcfaf8', fontSize: '0.85rem' }}
                    required
                  />
                  <span
                    className="input-group-text border-start-0"
                    style={{ backgroundColor: '#fcfaf8', cursor: 'pointer' }}
                  >
                    <i className="bi bi-eye text-muted"></i>
                  </span>
                </div>
              </div>

              {/* Botón Caramelo */}
              <button
                type="submit"
                className="btn w-100 fw-bold shadow-sm text-white"
                style={{
                  backgroundColor: '#d97706',
                  borderColor: '#d97706',
                  fontSize: '0.88rem',
                  padding: '8px'
                }}
              >
                Iniciar Sesión
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;