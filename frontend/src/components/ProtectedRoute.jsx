import { Navigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function ProtectedRoute({ tipos, children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!tipos.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
