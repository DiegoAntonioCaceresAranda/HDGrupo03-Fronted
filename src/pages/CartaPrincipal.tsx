import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import logoCortina from '../assets/Cafe.png';
import { ProductoService } from '../services/ProductoService';
import { catergoriaService } from '../services/CategoriaService';
import type { Producto } from '../data/Producto';

const CartaPrincipal: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriasBD, setCategoriasBD] = useState<string[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todo');
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarCarta = async () => {
      try {
        setCargando(true);
        const [listaProductos, listaCategorias] = await Promise.all([
          ProductoService.obtenerProductosAPI(),
          catergoriaService.listarCategorias(),
        ]);

        setProductos(Array.isArray(listaProductos) ? listaProductos : []);
        
        const nombresCat = (Array.isArray(listaCategorias) ? listaCategorias : [])
          .map((c) => c.nombre?.trim())
          .filter((nombre): nombre is string => Boolean(nombre));

        setCategoriasBD(nombresCat);
      } catch (error) {
        console.error('Error al cargar la carta desde el backend:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCarta();
  }, []);

  // Unimos las categorías de la BD con las que tengan los productos activos
  const categoriasDisponibles = useMemo(() => {
    const setCats = new Set<string>(categoriasBD);
    productos.forEach((p) => {
      if (p.categoria && p.categoria.trim() !== '') {
        setCats.add(p.categoria.trim());
      }
    });
    return ['Todo', ...Array.from(setCats)];
  }, [categoriasBD, productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todo') return productos;
    return productos.filter((prod) => prod.categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

  const categoriasAMostrar = useMemo(() => {
    if (categoriaActiva === 'Todo') {
      return categoriasDisponibles.filter((c) => c !== 'Todo');
    }
    return [categoriaActiva];
  }, [categoriaActiva, categoriasDisponibles]);

  return (
    <div style={{ backgroundColor: '#fcfbfa', color: '#4a403b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      <style>{`
        .pill-filter {
          background-color: #f2eae3;
          border: 1px solid #e8dfd8;
          color: #5c4033;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pill-filter.active {
          background-color: #211c18;
          color: #ffffff;
          border-color: #211c18;
        }
        .pill-filter:hover:not(.active) {
          background-color: #e5d8cc;
        }
        .circular-card {
          border: 1px solid #e8dfd8;
          border-radius: 12px;
          background: #ffffff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .circular-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.06);
        }
        .img-circle-container {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #f2eae3;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #e8dfd8;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-3" style={{ backgroundColor: '#211c18', borderBottom: '1px solid #3a322b' }}>
        <div className="container-fluid px-4">
          <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between align-items-center w-100" id="navbarContent">
            <ul className="navbar-nav gap-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white-50 fw-semibold tracking-wider text-uppercase small" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white-50 fw-semibold tracking-wider text-uppercase small" to="/#nosotros">Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold tracking-wider text-uppercase small" to="/carta-principal">Carta</Link>
              </li>
            </ul>

            <div className="navbar-brand text-center m-0 d-flex align-items-center gap-2 position-absolute start-50 translate-middle-x">
              <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
                <img 
                  src={logoCortina} 
                  alt="Collins Café Logo" 
                  style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
                <span className="fw-bold tracking-widest text-white" style={{ letterSpacing: '2.5px', fontSize: '1.1rem' }}>COLLINS CAFÉ</span>
              </Link>
            </div>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <span className="text-white-50 small fw-semibold px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', letterSpacing: '1px' }}>
                  ¡Disfruta tu visita!
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO DE LA CARTA CONECTADO A SUPABASE Y CLOUDINARY --- */}
      <div className="container py-5">
        <h1 className="fw-bold fs-2 mb-4" style={{ color: '#211c18' }}>Menú</h1>

        {/* Píldoras de Categorías existentes en la Base de Datos */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5 border-bottom">
          {categoriasDisponibles.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`btn rounded-pill px-4 py-2 small fw-semibold pill-filter ${categoriaActiva === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <p className="text-muted">Cargando productos de la carta...</p>
          </div>
        ) : (
          <>
            {categoriasAMostrar.map((catName) => {
              const itemsDeEstaCategoria = productosFiltrados.filter((p) => p.categoria === catName);

              if (itemsDeEstaCategoria.length === 0) return null;

              return (
                <div key={catName} className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h3 className="fw-bold h4 m-0" style={{ color: '#211c18' }}>{catName}</h3>
                    <i className="bi bi-chevron-down text-muted"></i>
                  </div>

                  <div className="row g-4">
                    {itemsDeEstaCategoria.map((prod) => (
                      <div key={prod.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="circular-card p-4 text-center h-100 d-flex flex-column justify-content-between">
                          <div>
                            {/* Contenedor Circular con imagen de Cloudinary o icono de respaldo */}
                            <div className="img-circle-container mb-3 shadow-sm">
                              {prod.image_url ? (
                                <img 
                                  src={prod.image_url} 
                                  alt={prod.nombre} 
                                  className="w-100 h-100 object-fit-cover" 
                                />
                              ) : (
                                <Coffee size={36} color="#5c4033" />
                              )}
                            </div>
                            <h5 className="fw-bold small mb-2 text-uppercase" style={{ color: '#211c18', minHeight: '38px' }}>
                              {prod.nombre}
                            </h5>
                            <p className="text-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                              {prod.categoria}
                            </p>
                          </div>

                          <div className="pt-2 border-top mt-auto">
                            <span className="fw-bold small" style={{ color: '#006241' }}>
                              S/ {Number(prod.precioVenta).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {productosFiltrados.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No hay productos disponibles en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartaPrincipal;