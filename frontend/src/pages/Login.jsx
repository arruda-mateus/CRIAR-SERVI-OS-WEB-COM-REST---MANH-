import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const dados = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      entrar(dados);
      navigate(dados.usuario.tipo === "advogado" ? "/advogado" : "/cliente");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <p>Acesse sua conta como cliente ou advogado.</p>

      <form className="form" onSubmit={enviarFormulario}>
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={alterarCampo} required />
        </label>

        <label>
          Senha
          <input name="senha" type="password" value={form.senha} onChange={alterarCampo} required minLength="8" />
        </label>

        {erro && <div className="alert error">{erro}</div>}

        <button className="button full" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="auth-footer">
        Ainda não tem conta? <Link to="/registro">Criar cadastro</Link>
      </p>
    </section>
  );
}
