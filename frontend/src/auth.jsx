import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });

  function entrar(dados) {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
    setUsuario(dados.usuario);
  }

  function atualizarUsuario(novoUsuario) {
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    setUsuario(novoUsuario);
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  const valor = useMemo(
    () => ({ usuario, entrar, sair, atualizarUsuario }),
    [usuario]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
