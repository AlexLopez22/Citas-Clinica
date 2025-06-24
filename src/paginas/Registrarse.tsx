import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicios/api';

export default function Registrarse() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verifica si el correo ya está registrado
      const usuariosExistentes = await api.get('/usuarios', {
        params: { correo },
      });

      if (usuariosExistentes.data.length > 0) {
        setError('⚠️ El correo ya está registrado.');
        return;
      }

      // Crea el nuevo usuario
      const respuesta = await api.post('/usuarios', {
        nombre,
        correo,
        contrasena,
      });

      // Guarda el ID en localStorage y redirige
      localStorage.setItem('idUsuario', String(respuesta.data.id));
      navegar('/citas');
    } catch (err) {
      console.error('❌ Error al registrar usuario:', err);
      setError('❌ No se pudo completar el registro.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrarse</h2>
      <form onSubmit={manejarRegistro} className="space-y-4">
        <div>
          <label className="block">Nombre completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
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
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
