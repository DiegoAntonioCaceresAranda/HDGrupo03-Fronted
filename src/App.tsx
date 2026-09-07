import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

const DashboardTemporal = () => (
  <div className="container mt-5 text-center">
    <h1 className="text-success">¡Bienvenido al Dashboard!</h1>
    <p className="text-muted">Has iniciado sesión correctamente. Aquí irá la vista de tu compañero.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardTemporal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;