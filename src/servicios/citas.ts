// servicios/citas.ts
import api from './api';

export type Cita = {
  id: number;
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
  especialidad: string;
  confirmada: boolean;
};

export type NuevaCita = Omit<Cita, 'id'>;

export const obtenerCitas = async (): Promise<Cita[]> => {
  const respuesta = await api.get('/citas');
  return respuesta.data;
};

export const eliminarCita = async (id: number): Promise<void> => {
  await api.delete(`/citas/${id}`);
};

export const registrarCita = async (cita: NuevaCita): Promise<Cita> => {
  // Forzar un id numérico autoincremental (según la cantidad de citas existentes)
  const todas = await obtenerCitas();
  const nuevoId = Math.max(0, ...todas.map((c: Cita) => Number(c.id))) + 1;

  const respuesta = await api.post('/citas', {
    id: nuevoId,
    ...cita,
  });

  return respuesta.data;
};

