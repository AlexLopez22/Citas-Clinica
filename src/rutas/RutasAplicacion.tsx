import { Routes, Route } from 'react-router-dom';
import Inicio from '../paginas/Inicio';
import IniciarSesion from '../paginas/IniciarSesion';
import Registrarse from '../paginas/Registrarse';
import AgendarCita from '../paginas/AgendarCita';
import MisCitas from '../paginas/MisCitas';
import RutaPrivada from '../componentes/RutaPrivada';
import EditarCita from '../paginas/EditarCita';
import PanelAdmin from '../paginas/PanelAdmin';
import RutaAdmin from '../componentes/RutaAdmin';
import HistorialCitas from '../paginas/HistorialCitas';



export default function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      <Route path="/agendar" element={<AgendarCita />} />
      <Route path="/historial" element={<HistorialCitas />} />
      <Route path="/citas" element={<MisCitas />} />
      <Route path="/editar-cita/:id" element={<EditarCita />} />
      {/* ✅ Ruta protegida del panel de administrador */}
      <Route path="/admin" element={
        <RutaAdmin>
          <PanelAdmin />
        </RutaAdmin>
      } />
      <Route
        path="/agendar"
        element={
          <RutaPrivada>
            <AgendarCita />
          </RutaPrivada>
        }
      />
      <Route
        path="/citas"
        element={
          <RutaPrivada>
            <MisCitas />
          </RutaPrivada>
        }
      />
      <Route
        path="/editar-cita/:id"
        element={
          <RutaPrivada>
            <EditarCita />
          </RutaPrivada>
        }
      />
    </Routes>

  );
}
