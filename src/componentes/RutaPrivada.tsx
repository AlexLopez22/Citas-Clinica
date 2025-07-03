import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function RutaPrivada({ children }: Props) {
  const idUsuario = localStorage.getItem('idUsuario');

  if (!idUsuario) {
    alert('Debes iniciar sesión para continuar.');
    return <Navigate to="/iniciar-sesion" />;
  }

  return <>{children}</>;
}
