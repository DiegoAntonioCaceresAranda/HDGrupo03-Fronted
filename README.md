# ☕ Collins Café - Sistema de Gestión de Inventario y Ventas

El presente proyecto es una página web realizada en base a una tienda de cafetería "Collins Café". Está enfocado en los usuarios que suelen consumir en este tipo de locales, basando su desarrollo en la implementación de diversas herramientas tecnológicas.

<p align="center">
<img src="src/assets/Login.png" alt="Logo Cafeteria">
</p>

---

## 📋 Tabla de Contenidos
- [Acerca de](#-acerca-de)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Metodología del Equipo](#-metodología-del-equipo)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Autores](#-autores)
- [Enlaces del Proyecto](#-enlaces-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## 🎯 Acerca de

### Objetivo General
Desarrollar un sistema web para la gestión integral para la cafetería "Collins Café", que permita administrar ventas, productos, categorías, usuarios y roles desde un panel administrativo. Además, busca ofrecer una interfaz pública para que los clientes visualicen el menú y las promociones.

### Problema que Resuelve
Los negocios de cafeterías de pequeña y mediana escala suelen gestionar sus operaciones de manera manual o con herramientas dispersas. Este sistema resuelve:
* Falta de control en tiempo real sobre las ventas y el stock de productos.
* Dificultad para generar reportes que apoyen la toma de decisiones.
* Ausencia de un canal digital para que los clientes conozcan el menú.
* Gestión desorganizada de roles y usuarios del personal.
* Procesos de venta lentos en el punto de atención (POS).

---

## 🏆 Características

* 🔐 **Módulo de Autenticación** - Inicio y cierre de sesión seguro para el administrador.
* 📦 **Gestión de Productos y Categorías** - Permite registrar, listar, modificar y eliminar el catálogo del menú.
* 🛒 **Punto de Venta (Ventas)** - Interfaz para registrar órdenes, agregar productos y calcular el total automáticamente.
* 👥 **Administración de Personal** - Creación y gestión de usuarios y roles del sistema.
* 📊 **Dashboard y Reportes** - Visualización de ventas diarias, ingresos totales, ticket promedio y alertas de stock bajo.

---

## 🛠️ Tecnologías Implementadas

| Categoría | Tecnología | Versión |
| :--- | :--- | :--- |
| **Frontend Core** | React + Vite | 19 |
| **Lenguaje** | TypeScript | - |
| **Enrutamiento** | React Router DOM | - |
| **Peticiones HTTP** | Axios | - |
| **Estilos e Interfaz** | Bootstrap 5 | 5 |
| **Íconos** | Lucide React | - |
| **Persistencia** | Local Storage | - |
| **Gestión de Proyectos** | Jira | - |
| **Control de Versiones** | GitHub | - |

---

## ⚙️ Metodología del Equipo

* **Commits Atómicos:** Mantenemos un historial limpio guardando características individuales por archivo (Data, Services, View).
* **Estándar de Código:** Todos los módulos heredan el mismo ADN arquitectónico utilizando interfaces con TypeScript, uso de Hooks y Servicios abstraídos.
* **UI Consistente:** Reutilización del componente AdminLayout y clases de Bootstrap para garantizar que todo el sistema parezca desarrollado por todo el equipo.
* **Flujo de Ramas:** Uso de `Main`, `Develop` y ramas individuales como `feature/Diego`, `feature/Wilmer`, `feature/Christopher` y `feature/Zarabia`.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* Node.js y npm (Gestor de paquetes).
* Git.

---

## 🚀 Instalación

1. **Clonar el repositorio**
```bash 
git clone [https://github.com/adilsoncarden/nubix_market_frontend.git](https://github.com/adilsoncarden/nubix_market_frontend.git)
```

2. **Instalar las dependencias** 
```bash 
"npm install"
```

3. **Levantar el servidor local: **
```bash  
"npm run dev"
```

---

## 📁 Estructura del Proyecto
El código está organizado modularmente para facilitar la mantenibilidad:

```text
src/
├── assets/         # Recursos estáticos e imágenes
├── components/     # Componentes UI reutilizables (Modales, Formularios)
├── data/           # Interfaces TypeScript y datos simulados (Mocks)
├── layouts/        # Estructuras maestras (AdminLayout, Sidebar)
├── pages/          # Vistas principales integradas con el enrutador
└── services/       # Lógica de negocio y operaciones CRUD
```

---

## 👥 Autores

* **Caceres Aranda Diego**

* **Ramirez Taboada Christopher**

* **Tinoco Guerrero Wilmer**

* **Zarabia Gamboa Armando**

---

## 🔗 Enlaces del Proyecto

* **Repositorio en GitHub:** https://github.com/DiegoAntonioCaceresAranda/HDGrupo03-Fronted.git

* **Despliegue en Vercel:** https://hd-grupo03-fronted.vercel.app/

---

## Módulos Principales
* **Dashboard:** Vista general con métricas en tiempo real (Ventas del día, pedidos, clientes nuevos y alertas de stock bajo).
* **Punto de Venta:** Interfaz ágil para cajeros, permitiendo registrar órdenes (En local / Para llevar), aplicar descuentos y calcular subtotales.
* **Inventario y Categorías:** Gestión del catálogo de productos (CRUD), control de stock, precios y filtrado dinámico.
* **Reportes:** Visualización de ingresos totales, ticket promedio y listado de transacciones diarias.
* **Usuarios y Roles:** Módulo de seguridad para la gestión del personal, validación estricta de dominios de correo corporativo (@collinscafe.com) y asignación de permisos operativos.

---

## Credenciales de Prueba
Para acceder al sistema administrativo con privilegios completos:
* **Correo:** admin@collinscafe.com
* **Contraseña:** 123456


