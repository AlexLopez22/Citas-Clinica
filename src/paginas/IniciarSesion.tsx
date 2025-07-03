import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../servicios/api';

export default function IniciarSesion() {
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  // ✅ Si el usuario ya inició sesión, lo redirigimos a la página de inicio
  useEffect(() => {
    const id = localStorage.getItem('idUsuario');
    if (id) {
      navegar('/');
    }
  }, []);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await api.get('/usuarios');
      const usuario = respuesta.data.find(
        (u: any) => u.correo === correo && u.contrasena === contrasena
      );

      if (usuario) {
        localStorage.setItem('idUsuario', usuario.id);
        localStorage.setItem('rol', usuario.rol); // ✅ Guardamos el rol

        navegar('/');
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={manejarSubmit} className="space-y-4">
        <div>
          <label className="block">Correo electrónico:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
