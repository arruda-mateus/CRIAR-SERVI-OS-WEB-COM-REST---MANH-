import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "cliente",
    oab: "",
    areaAtuacao: "",
    cidade: "",
    estado: "",
    descricao: ""
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      await api("/auth/registro", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setSucesso("Cadastro realizado com sucesso. Você já pode fazer login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth-card wide">
      <h1>Registro</h1>
      <p>Crie uma conta como cliente ou advogado.</p>

      <form className="form two-columns" onSubmit={enviarFormulario}>
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={alterarCampo} required minLength="3" />
        </label>

        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={alterarCampo} required />
        </label>

        <label>
          Senha
          <input name="senha" type="password" value={form.senha} onChange={alterarCampo} required minLength="8" />
        </label>

        <label>
          Telefone
          <input name="telefone" value={form.telefone} onChange={alterarCampo} required minLength="10" />
        </label>

        <label>
          Tipo de usuário
          <select name="tipo" value={form.tipo} onChange={alterarCampo}>
            <option value="cliente">Cliente</option>
            <option value="advogado">Advogado</option>
          </select>
        </label>

        {form.tipo === "advogado" && (
          <>
            <label>
              OAB
              <input name="oab" value={form.oab} onChange={alterarCampo} placeholder="Ex: PB123456" required />
            </label>

            <label>
              Área de atuação
              <select name="areaAtuacao" value={form.areaAtuacao} onChange={alterarCampo} required>
                <option value="">Selecione</option>
                <option>Direito Trabalhista</option>
                <option>Direito de Família</option>
                <option>Direito do Consumidor</option>
                <option>Direito Criminal</option>
                <option>Direito Previdenciário</option>
                <option>Direito Civil</option>
              </select>
            </label>

            <label>
              Cidade
              <input name="cidade" value={form.cidade} onChange={alterarCampo} />
            </label>

            <label>
              Estado
              <input name="estado" value={form.estado} onChange={alterarCampo} maxLength="2" placeholder="PB" />
            </label>

            <label className="span-two">
              Descrição profissional
              <textarea name="descricao" value={form.descricao} onChange={alterarCampo} rows="4" />
            </label>
          </>
        )}

        {erro && <div className="alert error span-two">{erro}</div>}
        {sucesso && <div className="alert success span-two">{sucesso}</div>}

        <button className="button full span-two" disabled={carregando}>
          {carregando ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p className="auth-footer">
        Já possui conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}
