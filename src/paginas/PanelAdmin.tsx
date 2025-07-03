import { useEffect, useState } from 'react';
import api from '../servicios/api';

type Cita = {
  id: number;
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
  especialidad: string; // ✅ Nuevo campo agregado
  confirmada: boolean; // ✅ Si no lo tienes aún, agrégalo también
};

type Usuario = {
  id: number;
  nombre: string;
};

export default function PanelAdmin() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resCitas = await api.get('/citas');
        const resUsuarios = await api.get('/usuarios');
        setCitas(resCitas.data);
        setUsuarios(resUsuarios.data);
      } catch (error) {
        console.error('Error cargando citas o usuarios:', error);
      }
    };
    cargarDatos();
  }, []);

  const obtenerNombreUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  };

  const confirmarCita = async (id: number) => {
    try {
      await api.patch(`/citas/${id}`, { confirmada: true });
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === id ? { ...cita, confirmada: true } : cita
        )
      );
    } catch (error) {
      console.error('Error confirmando cita:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📋 Panel del Administrador</h2>

      {citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {citas.map((cita) => (
            <li key={cita.id} className="border p-4 rounded shadow">
              <p><strong>Usuario:</strong> {obtenerNombreUsuario(cita.idUsuario)}</p>
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Hora:</strong> {cita.hora}</p>
              <p><strong>Motivo:</strong> {cita.motivo}</p>
              <p>
                <strong>Estado:</strong>{' '}
                {cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}
              </p>

              {!cita.confirmada && (
                <button
                  onClick={() => confirmarCita(cita.id)}
                  className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Confirmar cita
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
