import { useEffect, useState } from 'react';
import { registrarCita, obtenerCitas } from '../servicios/citas';
import { useNavigate } from 'react-router-dom';

const horariosDisponibles = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
];

const especialidades = ['Odontología', 'Cardiología', 'Pediatría', 'Psicología'];

export default function AgendarCita() {
  const navegar = useNavigate();

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [error, setError] = useState('');
  const [ocupados, setOcupados] = useState<string[]>([]);

  const idUsuario = localStorage.getItem('idUsuario');

  // Cargar citas existentes para esa fecha y especialidad
  useEffect(() => {
    const cargarDisponibilidad = async () => {
      if (!fecha || !especialidad) return;

      try {
        const todas = await obtenerCitas();
        const yaOcupadas = todas
          .filter((cita: any) => cita.fecha === fecha && cita.especialidad === especialidad)
          .map((cita: any) => cita.hora);
        setOcupados(yaOcupadas);
      } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
      }
    };

    cargarDisponibilidad();
  }, [fecha, especialidad]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idUsuario) {
      alert('Debes iniciar sesión para agendar una cita.');
      return;
    }

    const fechaActual = new Date();
    const fechaIngresada = new Date(`${fecha}T${hora}`);
    if (fechaIngresada < fechaActual) {
      setError('No puedes agendar una cita en el pasado.');
      return;
    }

    //Validacion para que cuando el usuario intenta repetir fecha y especialidad, se le muestra un mensaje y no se agenda.
    try {
      const todas = await obtenerCitas();
      const yaTieneCita = todas.some((cita: any) =>
        cita.idUsuario === parseInt(idUsuario) &&
        cita.fecha === fecha &&
        cita.especialidad === especialidad
      );
    
      if (yaTieneCita) {
        setError('❌ Ya tienes una cita en esta especialidad para ese día.');
        return;
      }
    
      await registrarCita({
        idUsuario: parseInt(idUsuario),
        fecha,
        hora,
        motivo,
        especialidad,
        confirmada: false,
      });
    
      navegar('/citas');
    } catch (err: any) {
      console.error('❌ Error real al agendar cita:', err?.response || err?.message || err);
      setError('❌ Error al agendar la cita.');
    }
    
  };

  const horariosFiltrados = horariosDisponibles.filter((h) => !ocupados.includes(h));

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Agendar nueva cita</h2>
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block">Especialidad:</label>
          <select
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Selecciona una --</option>
            {especialidades.map((esp) => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {fecha && especialidad && (
          <div>
            <label className="block">Hora disponible:</label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Selecciona una hora --</option>
              {horariosFiltrados.length > 0 ? (
                horariosFiltrados.map((h) => <option key={h} value={h}>{h}</option>)
              ) : (
                <option disabled>No hay horarios disponibles</option>
              )}
            </select>
          </div>
        )}

        <div>
          <label className="block">Motivo:</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirmar cita
        </button>
      </form>
    </div>
  );
}
