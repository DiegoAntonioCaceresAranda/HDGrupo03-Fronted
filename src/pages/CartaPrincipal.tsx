import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoCortina from '../assets/cafe.png';

const CartaPrincipal: React.FC = () => {
  // Pestañas principales superiores
  const [seccionActiva, setSeccionActiva] = useState('Bebidas');

  // Subfiltro activo (Todo o una categoría específica)
  const [subFiltroActivo, setSubFiltroActivo] = useState('Todo');

  const seccionesPrincipales = ["Bebidas", "Alimentos", "Repostería"];

  // Subcategorías según la sección principal seleccionada
  const subCategoriasPorSeccion: Record<string, string[]> = {
    "Bebidas": ["Todo", "Bebidas Proteicas", "Frappuccinos", "Café Caliente", "Café Frío"],
    "Alimentos": ["Todo", "Saladitos y Snacks", "Croissants"],
    "Repostería": ["Todo", "Postres y Chessecakes", "Bombones"]
  };

  // Listado completo de productos adaptado a la estructura de la imagen
  const catalogoProductos = [
    // Bebidas Proteicas
    {
      seccion: "Bebidas",
      subcategoria: "Bebidas Proteicas",
      nombre: "BATIDO PROTEICO DE PLÁTANO Y MANÍ",
      desc: "Ideal para ganar masa muscular: plátano, mantequilla de maní natural y leche.",
      precio: "Desde S/ 15.00",
      imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80"
    },
    {
      seccion: "Bebidas",
      subcategoria: "Bebidas Proteicas",
      nombre: "SMOOTHIE PROTEICO DE AVENA",
      desc: "Energético con hojuelas de avena, leche descremada, frutos secos y plátano.",
      precio: "Desde S/ 16.00",
      imagen: "https://images.unsplash.com/photo-1628556270448-4d6934c43cb5?auto=format&fit=crop&w=600&q=80"
    },
    // Frappuccinos
    {
      seccion: "Bebidas",
      subcategoria: "Frappuccinos",
      nombre: "FRAPPUCCINO CAFÉ CLÁSICO",
      desc: "Exquisita mezcla de café espresso, hielofrappé y leche cremosa con topping.",
      precio: "Desde S/ 15.50",
      imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"
    },
    // Café Caliente
    {
      seccion: "Bebidas",
      subcategoria: "Café Caliente",
      nombre: "CAPPUCCINO ARTESANAL",
      desc: "Café expreso de altura con leche texturizada al vapor y fina espuma.",
      precio: "Desde S/ 12.00",
      imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"
    },
    {
      seccion: "Bebidas",
      subcategoria: "Café Caliente",
      nombre: "CAFÉ LATTE VAINILLA",
      desc: "Suave combinación de espresso, leche cremosa y un toque de vainilla.",
      precio: "Desde S/ 13.50",
      imagen: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80"
    },
    {
      seccion: "Bebidas",
      subcategoria: "Café Caliente",
      nombre: "ESPRESSO DOBLE DE ALTURA",
      desc: "Grano seleccionado 100% peruano con notas intensas y cuerpo robusto.",
      precio: "Desde S/ 9.00",
      imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80"
    },
    // Café Frío
    {
      seccion: "Bebidas",
      subcategoria: "Café Frío",
      nombre: "CAFÉ LATTE HELADO",
      desc: "Café espresso peruano sobre cubos de hielo con leche fría.",
      precio: "Desde S/ 13.00",
      imagen: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
    },
    // Alimentos / Croissants
    {
      seccion: "Alimentos",
      subcategoria: "Croissants",
      nombre: "CROISSANT DE POLLO Y PALTA",
      desc: "Croissant de mantequilla recién horneado con pollo y láminas de palta.",
      precio: "Desde S/ 19.00",
      imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    // Repostería
    {
      seccion: "Repostería",
      subcategoria: "Postres y Chessecakes",
      nombre: "CHEESECAKE DE FRUTOS ROJOS",
      desc: "Base crujiente de galleta, crema de queso suave y coulis artesanal.",
      precio: "Desde S/ 16.00",
      imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
    },
    {
      seccion: "Repostería",
      subcategoria: "Bombones",
      nombre: "BOMBÓN DE LÚCUMA",
      desc: "Postre artesanal a base de lúcuma peruana con suave cobertura de chocolate.",
      precio: "Desde S/ 14.00",
      imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Filtrar productos según la pestaña principal y el subfiltro seleccionado
  const productosFiltrados = catalogoProductos.filter(prod => {
    const coincideSeccion = prod.seccion === seccionActiva;
    const coincideSub = subFiltroActivo === 'Todo' || prod.subcategoria === subFiltroActivo;
    return coincideSeccion && coincideSub;
  });

  // Agrupar por subcategorías para mostrarlos en bloques ordenados si se selecciona "Todo"
  const subcategoriasDisponibles = subCategoriasPorSeccion[seccionActiva] || ["Todo"];
  const subcatsAMostrar = subFiltroActivo === 'Todo' 
    ? subcategoriasDisponibles.filter(sc => sc !== 'Todo') 
    : [subFiltroActivo];

  return (
    <div style={{ backgroundColor: '#fcfbfa', color: '#4a403b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

      <style>{`
        .nav-tab-custom {
          background: none;
          border: none;
          font-weight: 600;
          color: #7a6b63;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-tab-custom.active {
          color: #211c18;
        }
        .nav-tab-custom.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #211c18;
          border-radius: 2px;
        }
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
          background-color: #211c18;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #f2eae3;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- NAVBAR IDÉNTICO AL CLIENTE HOME --- */}
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-3" style={{ backgroundColor: '#211c18', borderBottom: '1px solid #3a322b' }}>
        <div className="container-fluid px-4">
          <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between align-items-center w-100" id="navbarContent">
            
            {/* 1. IZQUIERDA: Enlaces de navegación */}
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

            {/* 2. CENTRO: Logo y Marca */}
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

            {/* 3. DERECHA */}
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

      {/* --- CONTENIDO DE LA CARTA CON DISEÑO ESTILO STARBUCKS --- */}
      <div className="container py-5">
        
        {/* Título de la sección */}
        <h1 className="fw-bold fs-2 mb-4" style={{ color: '#211c18' }}>Menú</h1>

        {/* Pestañas Principales (Bebidas, Alimentos, Repostería) */}
        <div className="d-flex gap-4 border-bottom pb-2 mb-4 overflow-x-auto no-scrollbar">
          {seccionesPrincipales.map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setSeccionActiva(sec);
                setSubFiltroActivo('Todo'); // Reiniciar subfiltro al cambiar de sección
              }}
              className={`nav-tab-custom fs-5 ${seccionActiva === sec ? 'active' : ''}`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Subfiltros en Píldoras deslizables horizontalmente */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
          {subCategoriasPorSeccion[seccionActiva]?.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubFiltroActivo(sub)}
              className={`btn rounded-pill px-4 py-2 small fw-semibold pill-filter ${subFiltroActivo === sub ? 'active' : ''}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Listado de Productos Agrupados por Subcategorías */}
        {subcatsAMostrar.map((subcatName) => {
          const itemsDeEstaSub = productosFiltrados.filter(p => p.subcategoria === subcatName);
          
          if (itemsDeEstaSub.length === 0) return null;

          return (
            <div key={subcatName} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="fw-bold h4 m-0" style={{ color: '#211c18' }}>{subcatName}</h3>
                <i className="bi bi-chevron-down text-muted"></i>
              </div>

              <div className="row g-4">
                {itemsDeEstaSub.map((prod, index) => (
                  <div key={index} className="col-md-6 col-lg-4 col-xl-3">
                    <div className="circular-card p-4 text-center h-100 d-flex flex-column justify-content-between">
                      <div>
                        {/* Contenedor Circular de la Imagen */}
                        <div className="img-circle-container mb-3 shadow-sm">
                          <img 
                            src={prod.imagen} 
                            alt={prod.nombre} 
                            className="w-100 h-100 object-fit-cover" 
                          />
                        </div>
                        <h5 className="fw-bold small mb-2 text-uppercase" style={{ color: '#211c18', minHeight: '38px' }}>
                          {prod.nombre}
                        </h5>
                        <p className="text-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {prod.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-top mt-auto">
                        <span className="fw-bold small" style={{ color: '#006241' }}>{prod.precio}</span>
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

      </div>
    </div>
  );
};

export default CartaPrincipal;