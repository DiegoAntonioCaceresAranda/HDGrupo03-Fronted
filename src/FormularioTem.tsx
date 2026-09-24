import React, { useState } from 'react';
import { cld } from './Cloudinary'; // Asegúrate de que la ruta apunte bien a tu archivo cloudinary.tsx
import { AdvancedImage } from '@cloudinary/react';

interface Producto {
  id: string;
  nombre: string;
  publicId: string;
}

export default function FormularioAdminTemporal() {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Lista temporal en memoria para ver cómo se cargan las imágenes
  const [productos, setProductos] = useState<Producto[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) return alert('Selecciona una imagen');

    setLoading(true);

    const formData = new FormData();
    formData.append('file', imagen);
    formData.append('upload_preset', 'Collins_Cafe'); // 👈 Aquí va el nombre exacto de tu Upload Preset que creaste en Cloudinary

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/a7viibbv/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await res.json();
      
      if (data.public_id) {
        const nuevoProducto: Producto = {
          id: Date.now().toString(),
          nombre: nombre,
          publicId: data.public_id,
        };

        setProductos([...productos, nuevoProducto]);
        setNombre('');
        setImagen(null);
        alert('¡Imagen subida y producto agregado con éxito!');
      } else {
        alert('Error al subir a Cloudinary');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow space-y-4 border">
        <h2 className="text-xl font-bold">Admin (Temporal): Nuevo Producto</h2>
        
        <div>
          <label className="block text-sm font-medium">Nombre del Producto:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full border p-2 rounded"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Imagen:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => e.target.files && setImagen(e.target.files[0])} 
            className="w-full border p-2 rounded"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Subiendo imagen a Cloudinary...' : 'Subir y Mostrar'}
        </button>
      </form>

      {/* Vista previa donde se verán reflejadas las imágenes */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4">Interfaz del Cliente (Vista Previa)</h3>
        <div className="grid grid-cols-3 gap-4">
          {productos.map((prod) => {
            const imagenCloudinary = cld.image(prod.publicId);

            return (
              <div key={prod.id} className="bg-white border p-4 rounded shadow">
                <AdvancedImage cldImg={imagenCloudinary} className="w-full h-48 object-cover rounded mb-2" />
                <h4 className="font-bold text-lg">{prod.nombre}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}