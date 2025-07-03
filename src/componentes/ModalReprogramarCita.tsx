import React, { useState, useEffect } from 'react';

interface ModalReprogramarCitaProps {
  cita: any;
  onClose: () => void;
  onSave: (nuevaFecha: string, nuevaHora: string) => void;
}

const ModalReprogramarCita: React.FC<ModalReprogramarCitaProps> = ({ cita, onClose, onSave }) => {
  const [nuevaFecha, setNuevaFecha] = useState(cita.fecha);
  const [nuevaHora, setNuevaHora] = useState(cita.hora);

  useEffect(() => {
    setNuevaFecha(cita.fecha);
    setNuevaHora(cita.hora);
  }, [cita]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reprogramar Cita</h2>

        <label className="block mb-2 text-sm font-medium">Nueva Fecha:</label>
        <input
          type="date"
          value={nuevaFecha}
          onChange={(e) => setNuevaFecha(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Nueva Hora:</label>
        <input
          type="time"
          value={nuevaHora}
          onChange={(e) => setNuevaHora(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <div className="flex justify-end space-x-4 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button
            onClick={() => onSave(nuevaFecha, nuevaHora)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReprogramarCita;
