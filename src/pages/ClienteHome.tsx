import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoCortina from '../assets/Cafe.png';

const ClienteHome: React.FC = () => {
  // Banners dinámicos principales
  const banners = [
    {
      titulo: "LA VIDA COMIENZA DESPUÉS DE UN CAFÉ",
      subtitulo: "Un café para despertar y disfrutar cada momento.",
      badge: "Café de Especialidad",
      imagen: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80"
    },
    {
      titulo: "MOMENTOS ÚNICOS EN CADA TAZA",
      subtitulo: "Repostería artesanal y aromas que abrazan tus sentidos.",
      badge: "Repostería Fresca",
      imagen: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1920&q=80"
    },
    {
      titulo: "TU REFUGIO IDEAL EN LA CIUDAD",
      subtitulo: "Un espacio cálido y diseñado para tu pausa perfecta.",
      badge: "Ambiente Acogedor",
      imagen: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);


  const productos = [
    {
      nombre: "CAPPUCCINO ARTESANAL",
      desc: "Café expreso de altura con leche texturizada al vapor y fina espuma.",
      precio: "S/ 12.00",
      imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "BATIDO PROTEICO DE PLÁTANO Y MANÍ",
      desc: "Ideal para ganar masa muscular: plátano, mantequilla de maní natural y leche.",
      precio: "S/ 15.00",
      imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "CAFÉ LATTE VAINILLA",
      desc: "Suave combinación de espresso, leche cremosa y un toque de vainilla.",
      precio: "S/ 13.50",
      imagen: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "SMOOTHIE PROTEICO DE AVENA",
      desc: "Energético con hojuelas de avena, leche descremada, frutos secos y plátano.",
      precio: "S/ 16.00",
      imagen: "https://images.unsplash.com/photo-1628556270448-4d6934c43cb5?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "BOMBÓN DE LÚCUMA",
      desc: "Postre artesanal a base de lúcuma peruana con suave cobertura de chocolate.",
      precio: "S/ 14.00",
      imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "ESPRESSO DOBLE DE ALTURA",
      desc: "Grano seleccionado 100% peruano con notas intensas y cuerpo robusto.",
      precio: "S/ 9.00",
      imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "CHEESECAKE DE FRUTOS ROJOS",
      desc: "Base crujiente de galleta, crema de queso suave y coulis artesanal.",
      precio: "S/ 16.00",
      imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
    },
    {
      nombre: "CROISSANT DE POLLO Y PALTA",
      desc: "Croissant de mantequilla recién horneado con pollo y láminas de palta.",
      precio: "S/ 19.00",
      imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#fcfbfa', color: '#4a403b', fontFamily: 'sans-serif', minHeight: '100vh' }}>

      {/* --- IMPORTACIÓN DE BOOTSTRAP Y BOOTSTRAP ICONS --- */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .banner-anim {
          animation: fadeInOut 0.8s ease-in-out forwards;
        }
        .hero-section {
          background-size: cover;
          background-position: center;
          position: relative;
          transition: background-image 1s ease-in-out;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.55);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
        }
        /* Ocultar barra de scroll pero mantener funcionalidad corrediza */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .product-card {
          min-width: 280px;
          max-width: 280px;
          flex: 0 0 auto;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        /* Estilos para las tarjetas con imagen de fondo (mini banners de información) */
        .feature-banner-card {
          background-size: cover;
          background-position: center;
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .feature-banner-card:hover {
          transform: translateY(-4px);
        }
        .feature-banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75));
          z-index: 1;
        }
        .feature-banner-content {
          position: relative;
          z-index: 2;
          color: #ffffff;
        }

        /* Estilos para los banners con fondo café clarito */
        .promo-banner-container {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
          background-color: #d8c3b6;
        }
      `}</style>


      <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-3" style={{ backgroundColor: '#211c18', borderBottom: '1px solid #3a322b' }}>
        <div className="container-fluid px-4">

          <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between align-items-center w-100" id="navbarContent">

            {/* 1. IZQUIERDA: Enlaces de navegación */}
            <ul className="navbar-nav gap-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-white fw-semibold tracking-wider text-uppercase small" href="#inicio">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50 fw-semibold tracking-wider text-uppercase small" href="#nosotros">Nosotros</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white-50 fw-semibold tracking-wider text-uppercase small" to="/carta-principal">
                  Carta
                </Link>              
              </li>
            </ul>


            <div className="navbar-brand text-center m-0 d-flex align-items-center gap-2 position-absolute start-50 translate-middle-x">
              <a href="#" className="text-decoration-none d-flex align-items-center gap-2">
                <img
                  src={logoCortina}
                  alt="Collins Café Logo"
                  style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
                <span className="fw-bold tracking-widest text-white" style={{ letterSpacing: '2.5px', fontSize: '1.1rem' }}>COLLINS CAFÉ</span>
              </a>
            </div>


            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <span className="text-white-50 small fw-semibold px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', letterSpacing: '1px' }}>
                  ¡Bienvenido!
                </span>
              </li>
            </ul>

          </div>
        </div>
      </nav>

      {/* --- BANNER DINÁMICO CON MOVIMIENTO E IMÁGENES REALES --- */}
      <header
        id="inicio"
        className="hero-section text-white text-center py-7 d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${banners[currentBanner].imagen})`, minHeight: '580px' }}
      >
        <div className="hero-overlay"></div>
        <div className="container hero-content py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9 banner-anim" key={currentBanner}>
              <span className="badge px-3 py-2 rounded-pill mb-3 fw-semibold shadow" style={{ backgroundColor: '#b08968', color: '#fff', letterSpacing: '1px' }}>
                {banners[currentBanner].badge}
              </span>
              <h1 className="display-4 fw-bold mb-3 text-uppercase" style={{ letterSpacing: '1px', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
                {banners[currentBanner].titulo}
              </h1>
              <p className="lead text-light mb-4 mx-auto" style={{ fontSize: '1.2rem', maxWidth: '700px', textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
                {banners[currentBanner].subtitulo}
              </p>

              <div className="d-flex justify-content-center gap-2 mt-4">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className="border-0 rounded-circle p-0"
                    style={{
                      width: currentBanner === index ? '28px' : '9px',
                      height: '9px',
                      backgroundColor: currentBanner === index ? '#b08968' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.4s ease',
                      cursor: 'pointer'
                    }}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- SECCIÓN DE MINI BANNERS --- */}
      <section className="py-5 container">
        <div className="row g-4">

          {/* Tarjeta 1: Comida Saludable */}
          <div className="col-md-4">
            <div
              className="feature-banner-card shadow-sm text-center p-4"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80')` }}
            >
              <div className="feature-banner-overlay"></div>
              <div className="feature-banner-content">
                <h3 className="h5 fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Comida Saludable</h3>
                <p className="small mb-0 text-light px-2" style={{ lineHeight: '1.5' }}>
                  Opciones frescas y balanceadas en nuestra carta, para cuidarte sin renunciar al sabor.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Amplio Horario de Atención */}
          <div className="col-md-4">
            <div
              className="feature-banner-card shadow-sm text-center p-4"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80')` }}
            >
              <div className="feature-banner-overlay"></div>
              <div className="feature-banner-content">
                <h3 className="h5 fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Amplio Horario de Atención</h3>
                <p className="small mb-0 text-light px-2" style={{ lineHeight: '1.5' }}>
                  Todos los días, para acompañarte en cualquier momento.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Varios Espacios */}
          <div className="col-md-4">
            <div
              className="feature-banner-card shadow-sm text-center p-4"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80')` }}
            >
              <div className="feature-banner-overlay"></div>
              <div className="feature-banner-content">
                <h3 className="h5 fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Varios Espacios</h3>
                <p className="small mb-0 text-light px-2" style={{ lineHeight: '1.5' }}>
                  Ambientes pensados para cada ocasión: desayunos, reuniones y celebraciones.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECCIÓN CARTA PRINCIPAL  --- */}
      <section id="carta" className="py-5 container-fluid px-lg-5">
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small tracking-wider" style={{ color: '#b08968' }}>Nuestra Selección</span>
          <h2 className="fw-bold display-6 mt-1" style={{ color: '#5c4033' }}>Especialidades y Bebidas Proteicas</h2>
          <div className="mx-auto mt-2 rounded" style={{ width: '60px', height: '3px', backgroundColor: '#b08968' }}></div>
        </div>

        {/* CONTENEDOR CORREDIZO CON FLECHAS */}
        <div className="position-relative px-md-4">

          {/* Botón Izquierda */}
          <button
            onClick={scrollLeft}
            className="btn position-absolute start-0 top-50 translate-middle-y shadow rounded-circle d-none d-md-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px', backgroundColor: '#fff', color: '#5c4033', zIndex: 10, border: '1px solid #e8dfd8' }}
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left fs-5"></i>
          </button>

          {/* Carrusel Desplazable de Tarjetas */}
          <div
            ref={scrollRef}
            className="d-flex gap-4 overflow-x-auto no-scrollbar py-4 px-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {productos.map((prod, index) => (
              <div key={index} className="product-card card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f2eae3' }}>
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between" style={{ minHeight: '180px' }}>
                  <div>
                    <h5 className="fw-bold h6 mb-2" style={{ color: '#5c4033' }}>{prod.nombre}</h5>
                    <p className="text-muted small mb-3" style={{ fontSize: '0.85rem' }}>{prod.desc}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                    <span className="fw-bold fs-6" style={{ color: '#b08968' }}>{prod.precio}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Derecha */}
          <button
            onClick={scrollRight}
            className="btn position-absolute end-0 top-50 translate-middle-y shadow rounded-circle d-none d-md-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px', backgroundColor: '#fff', color: '#5c4033', zIndex: 10, border: '1px solid #e8dfd8' }}
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right fs-5"></i>
          </button>

        </div>
      </section>

      {/* --- BANNERS PROMOCIONALES CON CABECERA DE NOVEDADES --- */}
      <section className="py-5 container">

        {/* Cabecera de Novedades */}
        <div className="text-center mb-4">
          <span className="text-uppercase fw-bold small tracking-wider" style={{ color: '#b08968' }}>Lo más reciente</span>
          <h3 className="fw-bold fs-2 mt-1" style={{ color: '#5c4033' }}>Novedades que te encantarán</h3>
          <p className="text-muted small mx-auto" style={{ maxWidth: '500px' }}>
            Descubre las creaciones de temporada preparadas especialmente para hacer tu visita inolvidable.
          </p>
          <div className="mx-auto mt-2 rounded" style={{ width: '50px', height: '3px', backgroundColor: '#b08968' }}></div>
        </div>

        <div className="row g-4">

          {/* Banner Promocional 1 */}
          <div className="col-lg-12">
            <div className="promo-banner-container row g-0 align-items-center">
              <div className="col-md-6 order-md-2" style={{ minHeight: '320px', overflow: 'hidden' }}>
                <img
                  src="https://res.cloudinary.com/a7viibbv/image/upload/v1790261838/kurt_angle_meme.jpg"
                  alt="Pumpkin Spice & Otoño"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="col-md-6 order-md-1 p-5 text-dark text-center text-md-start">
                <span className="badge px-3 py-2 rounded-pill mb-3 fw-semibold shadow-sm" style={{ backgroundColor: '#b08968', color: '#fff' }}> Temporada Especial</span>
                <h3 className="display-6 fw-bold mb-3" style={{ color: '#3e2b21' }}>Vuelve Pumpkin Spice</h3>
                <p className="mb-0" style={{ color: '#5c4033', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Disfruta la perfecta armonía de especias otoñales y nuestro café de especialidad. Una experiencia única disponible por tiempo limitado.
                </p>
              </div>
            </div>
          </div>

          {/* Banner Promocional 2 */}
          <div className="col-lg-12">
            <div className="promo-banner-container row g-0 align-items-center">
              <div className="col-md-6" style={{ minHeight: '320px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80"
                  alt="Pecan Crunch"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="col-md-6 p-5 text-dark text-center text-md-start">
                <span className="badge px-3 py-2 rounded-pill mb-3 fw-semibold shadow-sm" style={{ backgroundColor: '#b08968', color: '#fff' }}> Nuevo Sabor</span>
                <h3 className="display-6 fw-bold mb-3" style={{ color: '#3e2b21' }}>Siente el Crunch</h3>
                <p className="mb-0" style={{ color: '#5c4033', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Sé el primero en probar el nuevo Pecan Crunch en sus dos irresistibles versiones. Texturas y notas crujientes hechas para consentirte.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECCIÓN NOSOTROS / INFORMACIÓN DE LA EMPRESA --- */}
      <section id="nosotros" className="py-5" style={{ backgroundColor: '#f7f3ee' }}>
        <div className="container py-4">

          {/* Cabecera de Nosotros */}
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small tracking-wider" style={{ color: '#b08968' }}>Quiénes Somos</span>
            <h3 className="fw-bold fs-2 mt-1" style={{ color: '#5c4033' }}>Conoce Nuestra Esencia</h3>
            <p className="text-muted small mx-auto" style={{ maxWidth: '500px' }}>
              Más que una cafetería, somos un refugio cálido creado para compartir momentos entrañables.
            </p>
            <div className="mx-auto mt-2 rounded" style={{ width: '50px', height: '3px', backgroundColor: '#b08968' }}></div>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="rounded-4 p-5 text-white shadow-sm" style={{ backgroundColor: '#b08968' }}>
                <h3 className="fw-bold mb-3">Un espacio pensado para ti</h3>
                <p className="mb-4" style={{ opacity: '0.9' }}>
                  En Collins Café combinamos la pasión por el buen café de grano y bebidas nutritivas con un diseño acogedor y cálido. Cada rincón está ideado para que disfrutes de una charla amena de forma presencial.
                </p>
                <div className="d-flex gap-4">
                  <div>
                    <h4 className="fw-bold mb-0">100%</h4>
                    <small style={{ opacity: '0.8' }}>Café Peruano</small>
                  </div>
                  <div className="border-start ps-4">
                    <h4 className="fw-bold mb-0">Artesanal</h4>
                    <small style={{ opacity: '0.8' }}>Repostería Diaria</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-uppercase fw-bold small" style={{ color: '#b08968' }}>Tradición y Calidez</span>
              <h2 className="fw-bold display-6 mt-1 mb-3" style={{ color: '#5c4033' }}>Sabor y Calidez en Cada Taza</h2>
              <p className="text-muted mb-4">
                Nos enfocamos puramente en la experiencia física y presencial en local. Desde la selección minuciosa de nuestros granos hasta la preparación de batidos proteicos y cafés de especialidad.
              </p>
              <ul className="list-unstyled text-secondary d-flex flex-column gap-2">
                <li><i className="bi bi-check-circle-fill me-2" style={{ color: '#b08968' }}></i> Granos seleccionados de altura.</li>
                <li><i className="bi bi-check-circle-fill me-2" style={{ color: '#b08968' }}></i> Bebidas proteicas y opciones nutritivas.</li>
                <li><i className="bi bi-check-circle-fill me-2" style={{ color: '#b08968' }}></i> Ambientes diseñados para tu máximo confort en local.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contacto" className="text-white py-5" style={{ backgroundColor: '#211c18' }}>
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <img
                  src={logoCortina}
                  alt="Silueta Footer"
                  style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
                <h5 className="fw-bold m-0" style={{ letterSpacing: '1px' }}>COLLINS CAFÉ</h5>
              </div>
              <p className="text-white-50 small mb-3">
                Un espacio acogedor para disfrutar de los mejores aromas, postres y momentos especiales de forma presencial.
              </p>
              <div className="d-flex gap-3 fs-5">
                <a href="#" className="text-white-50"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-tiktok"></i></a>
              </div>
            </div>

            <div className="col-lg-3">
              <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#d3b59d' }}>Horarios de Atención</h6>
              <p className="text-white-50 small mb-1">Lunes a Sábado: 7:30 am – 10:00 pm</p>
              <p className="text-white-50 small">Domingos: 8:00 am – 9:00 pm</p>
            </div>

            <div className="col-lg-3">
              <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#d3b59d' }}>Contacto</h6>
              <p className="text-white-50 small mb-1"><i className="bi bi-geo-alt me-2"></i> Lima, Perú</p>
              <p className="text-white-50 small mb-1"><i className="bi bi-telephone me-2"></i> +51 900 000 000</p>
              <p className="text-white-50 small"><i className="bi bi-envelope me-2"></i> contacto@collinscafe.com</p>
            </div>
          </div>

          <hr className="my-4 border-secondary opacity-25" />

          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-white-50 small mb-0">&copy; {new Date().getFullYear()} Collins Café. Todos los derechos reservados.</p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <a href="/admin" className="text-white-50 small text-decoration-none">Acceso Administrativo</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ClienteHome;