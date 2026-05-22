import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function NavBar() {
  const { usuario, sair } = useAuth();

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-icon">⚖</span>
        VIGIA JURÍDICO
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Início</NavLink>
        {usuario?.tipo === "cliente" && <NavLink to="/cliente">Área do Cliente</NavLink>}
        {usuario?.tipo === "advogado" && <NavLink to="/advogado">Área do Advogado</NavLink>}
        {!usuario && <NavLink to="/registro">Cadastro</NavLink>}
        {!usuario && <NavLink to="/login">Login</NavLink>}
        {usuario && (
          <button className="button button-small button-outline" onClick={sair}>
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}
