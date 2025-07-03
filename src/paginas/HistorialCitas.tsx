import { useEffect, useState } from 'react';
import { obtenerCitas } from '../servicios/citas';

type Cita = {
    id: number;
    idUsuario: number;
    fecha: string;
    hora: string;
    motivo: string;
    especialidad: string; // ✅ Nuevo campo agregado
    confirmada: boolean; // ✅ Si no lo tienes aún, agrégalo también
  };

export default function HistorialCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitasPasadas = async () => {
    const idUsuario = parseInt(localStorage.getItem('idUsuario') || '0');
    const hoy = new Date().toISOString().split('T')[0];

    try {
      const todas = await obtenerCitas();
      const anteriores = todas.filter(
        (cita: Cita) =>
          cita.idUsuario === idUsuario && cita.fecha < hoy
      );
      setCitas(anteriores);
    } catch (error) {
      console.error('❌ Error al obtener citas pasadas:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitasPasadas();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Historial de citas</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas anteriores registradas.</p>
      ) : (
        <ul className="space-y-4">
          {citas.map((cita) => (
            <li key={cita.id} className="border p-4 rounded shadow">
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Hora:</strong> {cita.hora}</p>
              <p><strong>Motivo:</strong> {cita.motivo}</p>
              <p><strong>Estado:</strong> {cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
