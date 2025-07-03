import { useEffect, useState } from 'react';
import api from '../servicios/api';

type Cita = {
  id: number;
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
  especialidad: string;
  confirmada: boolean;
};

export default function Inicio() {
  const [citasProximas, setCitasProximas] = useState<Cita[]>([]);
  const idUsuario = parseInt(localStorage.getItem('idUsuario') || '0');

  useEffect(() => {
    const buscarCitasProximas = async () => {
      try {
        const res = await api.get('/citas');
        const hoy = new Date();

        const citasUsuario: Cita[] = res.data.filter(
          (c: Cita) => c.idUsuario === idUsuario
        );

        const futuras = citasUsuario
          .filter((c) => new Date(c.fecha + 'T' + c.hora) >= hoy)
          .sort((a, b) =>
            new Date(a.fecha + 'T' + a.hora).getTime() -
            new Date(b.fecha + 'T' + b.hora).getTime()
          )
          .slice(0, 3); // mostrar hasta 3 próximas

        setCitasProximas(futuras);
      } catch (error) {
        console.error('Error al buscar citas próximas:', error);
      }
    };

    if (idUsuario) {
      buscarCitasProximas();
    }
  }, [idUsuario]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al sistema de citas</h1>

      {citasProximas.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6 shadow">
          <p className="font-semibold mb-2">📅 Tus próximas citas:</p>
          <ul className="space-y-3">
            {citasProximas.map((cita) => (
              <li key={cita.id} className="border-b pb-2">
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Motivo:</strong> {cita.motivo}</p>
                <p><strong>Especialidad:</strong> {cita.especialidad}</p>
                <p><strong>Estado:</strong> {cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-gray-700">Desde aquí puedes agendar, ver o gestionar tus citas médicas.</p>
    </div>
  );
}
