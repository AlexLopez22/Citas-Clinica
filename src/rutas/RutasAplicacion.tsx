import { Routes, Route } from 'react-router-dom';
import Inicio from '../paginas/Inicio';
import IniciarSesion from '../paginas/IniciarSesion';
import Registrarse from '../paginas/Registrarse';
import AgendarCita from '../paginas/AgendarCita';
import MisCitas from '../paginas/MisCitas';

export default function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      <Route path="/agendar" element={<AgendarCita />} />
      <Route path="/citas" element={<MisCitas />} />
    </Routes>
  );
}