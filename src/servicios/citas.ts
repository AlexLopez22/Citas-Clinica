import api from './api';

export const obtenerCitas = async () => {
  const respuesta = await api.get('/citas');
  return respuesta.data;
};

export const eliminarCita = async (id: number) => {
  const respuesta = await api.delete(`/citas/${id}`);
  return respuesta.data;
};

export const registrarCita = async (cita: {
  idUsuario: number;
  fecha: string;
  hora: string;
  motivo: string;
}) => {
  const respuesta = await api.post('/citas', cita);
  return respuesta.data;
};