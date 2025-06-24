import { Link } from 'react-router-dom';

export default function Encabezado() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Clínica Virtual</h1>
      <div className="space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/agendar">Agendar</Link>
        <Link to="/citas">Mis Citas</Link>
        <Link to="/iniciar-sesion">Iniciar sesión</Link>
        <Link to="/registrarse">Registrarse</Link>

      </div>
    </nav>
  );
}
