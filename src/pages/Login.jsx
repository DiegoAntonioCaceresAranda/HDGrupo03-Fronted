import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLogin from '../assets/login.png'; 
import logoCortina from '../assets/cafe.png'; 

const Login = () => {
  const [showCurtain, setShowCurtain] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1500); // Reducido a 1.5s para agilizar pruebas
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Submit presionado con:", email, password); // Revisa si esto sale en tu consola (F12)
    setError('');
    setLoading(true);

    setTimeout(() => {
      const correoFalso = "admin@collinscafe.com";
      const passwordFalsa = "123456";

      if (email.trim() === correoFalso && password === passwordFalsa) {
        localStorage.setItem('user', JSON.stringify({ email: email, rol: 'admin' }));
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Usa: admin@collinscafe.com / 123456');
      }
      
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      <style>{`
        @keyframes slideUpCurtain {
          0% { transform: translateY(0%); opacity: 1; }
          80% { transform: translateY(0%); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; pointer-events: none; }
        }
        @keyframes fadeInLogo {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .curtain-overlay {
          animation: slideUpCurtain 1.5s ease-in-out forwards;
        }
        .curtain-logo-anim {
          animation: fadeInLogo 1s ease-out forwards;
        }
      `}</style>

      {/* --- EFECTO CORTINA --- */}
      {showCurtain && (
        <div
          className="curtain-overlay position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#f7f3ee', zIndex: 9999 }}
        >
          <div className="text-center curtain-logo-anim">
            <img
              src={logoCortina}
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

      {/* --- INTERFAZ DE LOGIN --- */}
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center p-3"
        style={{ backgroundColor: '#f7f3ee' }}
      >
        <div
          className="card shadow border-0 rounded-4 overflow-hidden"
          style={{ maxWidth: '360px', width: '100%', backgroundColor: '#ffffff' }}
        >
          <div
            className="text-white text-center p-3"
            style={{ backgroundColor: '#4a2c11' }}
          >
            <img
              src={logoLogin}
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

          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.78rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Correo */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted mb-1" style={{ fontSize: '0.82rem' }}>
                  Correo Electrónico
                </label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#fcfaf8' }}>
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    placeholder="admin@collinscafe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ backgroundColor: '#fcfaf8', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              {/* Contraseña con Botón Independiente para el Ojito */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold text-muted mb-0" style={{ fontSize: '0.82rem' }}>
                    Contraseña
                  </label>
                  <a href="#forgot" className="text-decoration-none fw-semibold" style={{ fontSize: '0.78rem', color: '#8c5a2b' }}>
                    ¿Olvidaste tu clave?
                  </a>
                </div>
                <div className="input-group input-group-sm">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#fcfaf8' }}>
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0 border-end-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: '#fcfaf8', fontSize: '0.85rem' }}
                    required
                  />
                  {/* Botón nativo separado para garantizar que el clic responda siempre */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    style={{ backgroundColor: '#fcfaf8', borderColor: '#dee2e6' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                  </button>
                </div>
              </div>

              {/* Botón Iniciar Sesión */}
              <button
                type="submit"
                className="btn w-100 fw-bold shadow-sm text-white"
                disabled={loading}
                style={{
                  backgroundColor: '#d97706',
                  borderColor: '#d97706',
                  fontSize: '0.88rem',
                  padding: '8px'
                }}
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;