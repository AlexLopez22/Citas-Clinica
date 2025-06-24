import { useForm } from 'react-hook-form';
import { registrarCita } from '../servicios/citas';

type DatosCita = {
  fecha: string;
  hora: string;
  motivo: string;
};

export default function AgendarCita() {
  const { register, handleSubmit, reset } = useForm<DatosCita>();

  const alEnviar = async (datos: DatosCita) => {
    try {
      // Aquí colocamos un ID fijo (usuario 1) por ahora
      const nuevaCita = {
        ...datos,
        idUsuario: 1
      };

      await registrarCita(nuevaCita);
      alert('✅ Cita agendada con éxito');
      reset(); // limpia el formulario
    } catch (error) {
      alert('❌ Error al agendar la cita');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Agendar una cita</h2>

      <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
        <div>
          <label className="block mb-1">Fecha:</label>
          <input type="date" {...register('fecha')} className="border p-2 w-full" required />
        </div>

        <div>
          <label className="block mb-1">Hora:</label>
          <input type="time" {...register('hora')} className="border p-2 w-full" required />
        </div>

        <div>
          <label className="block mb-1">Motivo de la cita:</label>
          <input type="text" {...register('motivo')} className="border p-2 w-full" required />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Confirmar cita
        </button>
      </form>
    </div>
  );
}
