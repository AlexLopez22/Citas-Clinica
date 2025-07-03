import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../servicios/api';


export default function Encabezado() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const navegar = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('idUsuario');
    if (id) {
      api.get(`/usuarios/${id}`)
        .then((respuesta) => setNombreUsuario(respuesta.data.nombre))
        .catch(() => setNombreUsuario(''));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');
    navegar('/'); // ✅ Redirige al inicio después de cerrar sesión
  };

  const usuarioActivo = !!localStorage.getItem('idUsuario');
  const rol = localStorage.getItem('rol');

  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Clínica Salud</h1>
        {usuarioActivo && <p className="text-sm">Bienvenido, {nombreUsuario}</p>}
      </div>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Inicio</Link>
        {usuarioActivo ? (
          <>
            <Link to="/agendar" className="hover:underline">Agendar cita</Link>
            <Link to="/citas" className="hover:underline">Mis citas</Link>
            <Link to="/historial" className="hover:underline">Historial</Link>

            {rol === 'admin' && (
              <Link to="/admin" className="hover:underline">Panel admin</Link>
            )}

            <button
              onClick={cerrarSesion}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/iniciar-sesion" className="hover:underline">Iniciar sesión</Link>
            <Link to="/registrarse" className="hover:underline">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}
