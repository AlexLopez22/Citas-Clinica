import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicios/api';

export default function IniciarSesion() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const manejarInicioSesion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const respuesta = await api.get('/usuarios', {
        params: {
          correo,
          contrasena,
        },
      });

      if (respuesta.data.length === 0) {
        setError('❌ Credenciales incorrectas');
      } else {
        const usuario = respuesta.data[0];
        localStorage.setItem('idUsuario', String(usuario.id));
        navegar('/citas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('❌ No se pudo iniciar sesión');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <form onSubmit={manejarInicioSesion} className="space-y-4">
        <div>
          <label className="block">Correo electrónico:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
}
