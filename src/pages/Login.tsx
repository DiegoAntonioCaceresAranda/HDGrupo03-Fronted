import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLogin from '../assets/login.png'; 
import logoCortina from '../assets/cafe.png'; 

const Login = () => {
  const [showCurtain, setShowCurtain] = useState(true);
  const [curtainClosing, setCurtainClosing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timerStart = setTimeout(() => {
      setCurtainClosing(true);
    }, 1800);

    const timerEnd = setTimeout(() => {
      setShowCurtain(false);
    }, 2700);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerEnd);
    };
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit presionado con:", email, password);
    setError('');
    setLoading(true);

    setTimeout(() => {
      const correoFalso = "admin@collinscafe.com";
      const passwordFalsa = "123456";

      if (email.trim() === correoFalso && password === passwordFalsa) {
        localStorage.setItem('user', JSON.stringify({ email: email, rol: 'admin' }));
        navigate('/admin'); // Te redirige al dashboard temporal que creaste en App.jsx
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
        .cafe-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #d7ccc8; 
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.9s ease;
        }

        .cafe-loader.closing {
          transform: translateY(-100%);
          opacity: 0.9;
        }

        @keyframes floatAndSteam {
          0% { opacity: 0; transform: scale(0.7) translateY(10px); }
          50% { transform: scale(1.03) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes steamWave {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }

        .cafe-loader-content {
          animation: floatAndSteam 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          text-align: center;
        }

        .logo-steam-effect {
          animation: steamWave 3s ease-in-out infinite;
        }

        @keyframes fadeInLogin {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .login-container-anim {
          animation: fadeInLogin 0.8s ease-out forwards;
        }
      `}</style>

      {/* --- EFECTO CORTINA: LOGO ORIGINAL (cafe.png) + MOVIMIENTO DE HUMO --- */}
      {showCurtain && (
        <div className={`cafe-loader ${curtainClosing ? 'closing' : ''}`}>
          <div className="cafe-loader-content">
            <img
              src={logoCortina}
              alt="Collins Café Logo Cortina"
              className="img-fluid logo-steam-effect"
              style={{ width: '150px', height: '150px', objectFit: 'contain', background: 'transparent' }}
            />
          </div>
        </div>
      )}

      {/* --- INTERFAZ DE LOGIN --- */}
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center p-3 login-container-anim"
        style={{ backgroundColor: '#f7f3ee' }}
      >
        <div
          className="card shadow-lg border-0 rounded-4 overflow-hidden"
          style={{ maxWidth: '440px', width: '100%', backgroundColor: '#ffffff' }}
        >
          <div
            className="text-white text-center p-4"
            style={{ backgroundColor: '#8d6e63' }}
          >
            <img
              src={logoLogin}
              alt="Collins Café Logo Login"
              className="img-fluid rounded-circle bg-white p-2 mb-3 shadow"
              style={{ width: '85px', height: '85px', objectFit: 'contain' }}
            />
            <h1 className="h5 fw-bold mb-1" style={{ letterSpacing: '1px' }}>
              COLLINS CAFÉ
            </h1>
            <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
              Accede a tu cuenta de administración
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            {error && (
              <div className="alert alert-danger py-2 mb-4" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Correo */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0 bg-light">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 bg-light py-2"
                    placeholder="admin@collinscafe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    Contraseña
                  </label>
                  <a href="#forgot" className="text-decoration-none fw-semibold" style={{ fontSize: '0.85rem', color: '#8d6e63' }}>
                    ¿Olvidaste tu clave?
                  </a>
                </div>
                <div className="input-group">
                  <span className="input-group-text border-end-0 bg-light">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0 border-end-0 bg-light py-2"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0 bg-light"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                  </button>
                </div>
              </div>

              {/* Botón Iniciar Sesión */}
              <button
                type="submit"
                className="btn w-100 fw-bold shadow-sm text-white py-2 mt-2"
                disabled={loading}
                style={{
                  backgroundColor: '#8d6e63',
                  borderColor: '#8d6e63',
                  fontSize: '1rem'
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