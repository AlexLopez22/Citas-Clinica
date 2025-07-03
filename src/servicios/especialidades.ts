import api from './api';

export const obtenerEspecialidades = async () => {
  const res = await api.get('/especialidades');
  return res.data;
};
