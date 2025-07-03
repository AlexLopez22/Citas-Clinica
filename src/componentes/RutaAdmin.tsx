import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
};

export default function RutaAdmin({ children }: Props) {
  const rol = localStorage.getItem('rol');

  if (rol !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}
