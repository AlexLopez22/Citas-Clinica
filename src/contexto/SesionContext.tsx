import { createContext, useContext, useState, useEffect } from 'react';
import api from '../servicios/api';

type Usuario = {
  id: number;
  nombre: string;
};

type SesionContextType = {
  usuario: Usuario | null;
  cargarUsuario: () => void;
  cerrarSesion: () => void;
};

const SesionContext = createContext<SesionContextType | undefined>(undefined);

export const SesionProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const cargarUsuario = async () => {
    const id = localStorage.getItem('idUsuario');
    if (!id) return;
    try {
      const respuesta = await api.get(`/usuarios/${id}`);
      setUsuario(respuesta.data);
    } catch {
      setUsuario(null);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('idUsuario');
    setUsuario(null);
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  return (
    <SesionContext.Provider value={{ usuario, cargarUsuario, cerrarSesion }}>
      {children}
    </SesionContext.Provider>
  );
};

export const useSesion = () => {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de SesionProvider');
  return contexto;
};
