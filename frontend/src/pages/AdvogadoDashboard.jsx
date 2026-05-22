import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function AdvogadoDashboard() {
  const { usuario, atualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState({
    nome: usuario?.nome || "",
    telefone: usuario?.telefone || "",
    oab: usuario?.oab || "",
    areaAtuacao: usuario?.areaAtuacao || "",
    cidade: usuario?.cidade || "",
    estado: usuario?.estado || "",
    descricao: usuario?.descricao || ""
  });
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarSolicitacoes() {
    const dados = await api("/solicitacoes/minhas");
    setSolicitacoes(dados.solicitacoes);
  }

  useEffect(() => {
    carregarSolicitacoes().catch((error) => setErro(error.message));
  }, []);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setPerfil((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarPerfil(evento) {
    evento.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const dados = await api("/perfil", {
        method: "PUT",
        body: JSON.stringify(perfil)
      });
      atualizarUsuario(dados.usuario);
      setMensagem("Perfil atualizado com sucesso.");
    } catch (error) {
      setErro(error.message);
    }
  }

  async function atualizarStatus(id, status) {
    try {
      await api(`/solicitacoes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <span className="tag">Área do advogado</span>
        <h1>Bem-vindo, {usuario?.nome}</h1>
        <p>Gerencie seu perfil profissional e acompanhe solicitações de clientes.</p>
      </div>

      <div className="grid two-columns dashboard-grid">
        <section className="panel">
          <h2>Meu perfil</h2>
          <form className="form" onSubmit={salvarPerfil}>
            <label>
              Nome
              <input name="nome" value={perfil.nome} onChange={alterarCampo} required />
            </label>

            <label>
              Telefone
              <input name="telefone" value={perfil.telefone} onChange={alterarCampo} required />
            </label>

            <label>
              OAB
              <input name="oab" value={perfil.oab} onChange={alterarCampo} required />
            </label>

            <label>
              Área de atuação
              <select name="areaAtuacao" value={perfil.areaAtuacao} onChange={alterarCampo} required>
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
              <input name="cidade" value={perfil.cidade} onChange={alterarCampo} />
            </label>

            <label>
              Estado
              <input name="estado" value={perfil.estado} onChange={alterarCampo} maxLength="2" />
            </label>

            <label>
              Descrição
              <textarea name="descricao" value={perfil.descricao} onChange={alterarCampo} rows="4" />
            </label>

            {erro && <div className="alert error">{erro}</div>}
            {mensagem && <div className="alert success">{mensagem}</div>}

            <button className="button full">Salvar perfil</button>
          </form>
        </section>

        <section className="panel">
          <h2>Solicitações recebidas</h2>
          <div className="card-list">
            {solicitacoes.length === 0 && <p className="muted">Nenhuma solicitação recebida ainda.</p>}

            {solicitacoes.map((solicitacao) => (
              <article className="card" key={solicitacao._id}>
                <h3>{solicitacao.cliente?.nome}</h3>
                <p><strong>Área:</strong> {solicitacao.area}</p>
                <p>{solicitacao.descricao}</p>
                <span className="badge">{solicitacao.status}</span>

                <div className="status-actions">
                  <button className="button button-small" onClick={() => atualizarStatus(solicitacao._id, "em andamento")}>Em andamento</button>
                  <button className="button button-small" onClick={() => atualizarStatus(solicitacao._id, "finalizada")}>Finalizar</button>
                  <button className="button button-small button-outline" onClick={() => atualizarStatus(solicitacao._id, "recusada")}>Recusar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
