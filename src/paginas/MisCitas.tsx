import { useEffect, useState } from 'react';
import { obtenerCitas, eliminarCita } from '../servicios/citas';
import jsPDF from 'jspdf';
import ModalReprogramarCita from '../componentes/ModalReprogramarCita';

type Cita = {
  id: number;
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
  especialidad: string;
  confirmada: boolean;
};

export default function MisCitas() {
  const [citasFuturas, setCitasFuturas] = useState<Cita[]>([]);
  const [citasPasadas, setCitasPasadas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [citaAEditar, setCitaAEditar] = useState<Cita | null>(null);
  const [actualizar, setActualizar] = useState(false); 


  const cargarCitas = async () => {
    try {
      const idUsuario = parseInt(localStorage.getItem('idUsuario') || '0');
      const todas = await obtenerCitas();
      const delUsuario = todas.filter((c: Cita) => c.idUsuario === idUsuario);
  
      const hoy = new Date();
      const futuras: Cita[] = [];
      const pasadas: Cita[] = [];
  
      delUsuario.forEach((cita) => {
        const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
        if (fechaCita >= hoy) {
          futuras.push(cita);
        } else {
          pasadas.push(cita);
        }
      });
  
      // 👇 Forzar nuevas referencias con spread operator
      setCitasFuturas([...futuras.sort((a, b) => a.fecha.localeCompare(b.fecha))]);
      setCitasPasadas([...pasadas.sort((a, b) => b.fecha.localeCompare(a.fecha))]);
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
      setCitasFuturas((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
    }
  };

  const guardarReprogramacion = async (nuevaFecha: string, nuevaHora: string) => {
    if (!citaAEditar) return;
  
    const citaOcupada = citasFuturas.find(
      (c) =>
        c.id !== citaAEditar.id &&
        c.fecha === nuevaFecha &&
        c.hora === nuevaHora &&
        c.especialidad === citaAEditar.especialidad
    );
  
    if (citaOcupada) {
      alert('❌ Ya hay una cita en ese horario para esa especialidad.');
      return;
    }
  
    try {
      const respuesta = await fetch(`http://localhost:3001/citas/${citaAEditar.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: nuevaFecha,
          hora: nuevaHora,
          confirmada: false // volver a marcar como pendiente tras reprogramar
        }),
      });
  
      if (!respuesta.ok) {
        throw new Error('Error en el servidor al actualizar la cita');
      }
  
      await cargarCitas(); // 👈 refresca la lista de citas en pantalla
      setCitaAEditar(null); // 👈 cierra el modal
      setActualizar((prev) => !prev);
      
  
      alert('✅ Cita reprogramada con éxito.');
    } catch (error) {
      console.error('❌ Error al reprogramar cita:', error);
      alert('❌ Ocurrió un error al reprogramar la cita.');
    }
  };
  

  const generarPDF = (cita: Cita) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('🧾 Comprobante de Cita Médica', 20, 20);

    doc.setFontSize(12);
    doc.text(`🆔 ID de la cita: ${cita.id}`, 20, 40);
    doc.text(`👤 Usuario: ${cita.idUsuario}`, 20, 50);
    doc.text(`📅 Fecha: ${cita.fecha}`, 20, 60);
    doc.text(`⏰ Hora: ${cita.hora}`, 20, 70);
    doc.text(`📌 Motivo: ${cita.motivo}`, 20, 80);
    doc.text(`📋 Estado: ${cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}`, 20, 90);

    doc.save(`cita_${cita.id}.pdf`);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📆 Mis citas médicas</h2>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">🟢 Citas futuras</h3>
          {citasFuturas.length === 0 ? (
            <p className="mb-6">No tienes citas próximas.</p>
          ) : (
            <ul className="space-y-4 mb-8" key={actualizar ? '1' : '0'}>

              {citasFuturas.map((cita) => (
                <li key={cita.id} className="border p-4 rounded shadow">
                  <p><strong>Fecha:</strong> {cita.fecha}</p>
                  <p><strong>Hora:</strong> {cita.hora}</p>
                  <p><strong>Motivo:</strong> {cita.motivo}</p>
                  <p><strong>Estado:</strong> {cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}</p>

                  <button
                    onClick={() => borrarCita(cita.id)}
                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Eliminar
                  </button>

                  <button
                    onClick={() => generarPDF(cita)}
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded ml-2"
                  >
                    Descargar PDF
                  </button>

                  {!cita.confirmada && (
                    <button
                      onClick={() => window.location.href = `/editar-cita/${cita.id}`}
                      className="mt-2 bg-yellow-600 text-white px-4 py-1 rounded ml-2"
                    >
                      Editar
                    </button>
                  )}

                  <button
                    onClick={() => setCitaAEditar(cita)}
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded ml-2"
                  >
                    Reprogramar
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-xl font-semibold mb-2">📜 Historial de citas pasadas</h3>
          {citasPasadas.length === 0 ? (
            <p>No tienes citas anteriores registradas.</p>
          ) : (
            <ul className="space-y-4">
              {citasPasadas.map((cita) => (
                <li key={cita.id} className="border p-4 rounded shadow bg-gray-100">
                  <p><strong>Fecha:</strong> {cita.fecha}</p>
                  <p><strong>Hora:</strong> {cita.hora}</p>
                  <p><strong>Motivo:</strong> {cita.motivo}</p>
                  <p><strong>Estado:</strong> {cita.confirmada ? '✅ Confirmada' : '⏳ Pendiente'}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Modal de Reprogramación */}
          {citaAEditar && (
            <ModalReprogramarCita
              cita={citaAEditar}
              onClose={() => setCitaAEditar(null)}
              onSave={guardarReprogramacion}
            />
          )}
        </>
      )}
    </div>
  );
}
