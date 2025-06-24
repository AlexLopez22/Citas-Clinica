import { useEffect, useState } from 'react';
import { obtenerCitas, eliminarCita } from '../servicios/citas';

type Cita = {
  id: number;
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
};

export default function MisCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitas = async () => {
    try {
      const idUsuarioGuardado = localStorage.getItem('idUsuario');
      if (!idUsuarioGuardado) {
        alert('⚠️ No has iniciado sesión.');
        return;
      }

      const idUsuario = parseInt(idUsuarioGuardado, 10);
      const todas = await obtenerCitas();
      const filtradas = todas.filter((c: Cita) => c.idUsuario === idUsuario);
      setCitas(filtradas);
    } catch (error) {
      console.error('❌ Error al obtener citas:', error);
    } finally {
      setCargando(false);
    }
  };

  const borrarCita = async (id: number) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await eliminarCita(id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mis citas médicas</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {citas.map((cita) => (
            <li key={cita.id} className="border p-4 rounded shadow">
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Hora:</strong> {cita.hora}</p>
              <p><strong>Motivo:</strong> {cita.motivo}</p>
              <button
                onClick={() => borrarCita(cita.id)}
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}