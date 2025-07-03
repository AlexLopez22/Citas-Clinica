import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../servicios/api';

export default function EditarCita() {
  const { id } = useParams(); // Obtener el ID desde la URL
  const navegar = useNavigate();

  // Estados para el formulario
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [confirmada, setConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCita = async () => {
      try {
        const res = await api.get(`/citas/${id}`);
        const cita = res.data;

        const idUsuarioActual = parseInt(localStorage.getItem('idUsuario') || '0');

        // Validar que la cita sea del usuario que ha iniciado sesión
        if (cita.idUsuario !== idUsuarioActual) {
          alert('❌ No tienes permiso para editar esta cita.');
          return navegar('/');
        }

        // Validar si la cita está confirmada
        if (cita.confirmada) {
          alert('⚠️ Esta cita ya fue confirmada por la clínica y no se puede modificar.');
          return navegar('/citas');
        }

        // Establecer los valores de la cita
        setFecha(cita.fecha);
        setHora(cita.hora);
        setMotivo(cita.motivo);
        setConfirmada(cita.confirmada);
      } catch (error) {
        alert('❌ Error al cargar la cita.');
        console.error(error);
        navegar('/citas');
      } finally {
        setCargando(false);
      }
    };

    cargarCita();
  }, [id, navegar]);

  // Guardar los cambios de la cita
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/citas/${id}`, {
        id: id,
        idUsuario: parseInt(localStorage.getItem('idUsuario') || '0'),
        fecha,
        hora,
        motivo,
        confirmada: false, // ← Al editar, se vuelve a estado pendiente
      });

      alert('✅ Cita actualizada.');
      navegar('/citas');
    } catch (error) {
      alert('❌ Error al guardar los cambios.');
      console.error(error);
    }
  };

  if (cargando) return <p className="text-center mt-6">Cargando cita...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Editar cita médica</h2>
      <form onSubmit={guardarCambios} className="space-y-4">
        <div>
          <label className="block font-medium">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Hora:</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Motivo:</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
