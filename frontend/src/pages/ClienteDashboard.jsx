import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { indicarAreaJuridica } from "../utils/recomendacao.js";

export default function ClienteDashboard() {
  const { usuario } = useAuth();
  const [advogados, setAdvogados] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [areaFiltro, setAreaFiltro] = useState("Todos");
  const [descricao, setDescricao] = useState("");
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const areaIndicada = useMemo(() => {
    if (descricao.trim().length < 10) return "";
    return indicarAreaJuridica(descricao);
  }, [descricao]);

  async function carregarDados() {
    const dadosAdvogados = await api("/advogados");
    const dadosSolicitacoes = await api("/solicitacoes/minhas");
    setAdvogados(dadosAdvogados.advogados);
    setSolicitacoes(dadosSolicitacoes.solicitacoes);
  }

  useEffect(() => {
    carregarDados().catch((error) => setErro(error.message));
  }, []);

  const advogadosFiltrados = advogados.filter((advogado) => {
    if (areaFiltro === "Todos") return true;
    return advogado.areaAtuacao === areaFiltro;
  });

  async function criarSolicitacao(evento) {
    evento.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const area = areaIndicada || areaFiltro;

      if (!advogadoSelecionado) {
        setErro("Escolha um advogado para enviar a solicitação.");
        return;
      }

      await api("/solicitacoes", {
        method: "POST",
        body: JSON.stringify({
          advogadoId: advogadoSelecionado,
          area,
          descricao
        })
      });

      setMensagem("Solicitação enviada com sucesso.");
      setDescricao("");
      setAdvogadoSelecionado("");
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <span className="tag">Área do cliente</span>
        <h1>Bem-vindo, {usuario?.nome}</h1>
        <p>Encontre advogados verificados e envie solicitações de atendimento pela plataforma.</p>
      </div>

      <div className="grid two-columns dashboard-grid">
        <section className="panel">
          <h2>Encontrar advogado</h2>
          <label>
            Filtrar por área
            <select value={areaFiltro} onChange={(evento) => setAreaFiltro(evento.target.value)}>
              <option>Todos</option>
              <option>Direito Trabalhista</option>
              <option>Direito de Família</option>
              <option>Direito do Consumidor</option>
              <option>Direito Criminal</option>
              <option>Direito Previdenciário</option>
              <option>Direito Civil</option>
            </select>
          </label>

          <div className="card-list">
            {advogadosFiltrados.length === 0 && (
              <p className="muted">Nenhum advogado encontrado. Cadastre uma conta de advogado para aparecer aqui.</p>
            )}

            {advogadosFiltrados.map((advogado) => (
              <article className="card compact" key={advogado._id}>
                <div>
                  <h3>{advogado.nome}</h3>
                  <p>{advogado.areaAtuacao || "Área não informada"}</p>
                  <p className="muted">OAB: {advogado.oab || "não informada"}</p>
                  <p className="muted">{advogado.cidade} {advogado.estado}</p>
                </div>
                <button className="button button-small" onClick={() => setAdvogadoSelecionado(advogado._id)}>
                  Escolher
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Solicitar atendimento</h2>
          <form className="form" onSubmit={criarSolicitacao}>
            <label>
              Descreva seu problema jurídico
              <textarea
                value={descricao}
                onChange={(evento) => setDescricao(evento.target.value)}
                minLength="10"
                rows="5"
                required
                placeholder="Ex: fui demitido e não recebi minha rescisão..."
              />
            </label>

            {areaIndicada && (
              <div className="alert info">Área indicada pelo sistema: <strong>{areaIndicada}</strong></div>
            )}

            <label>
              Advogado escolhido
              <select value={advogadoSelecionado} onChange={(evento) => setAdvogadoSelecionado(evento.target.value)} required>
                <option value="">Selecione um advogado</option>
                {advogadosFiltrados.map((advogado) => (
                  <option key={advogado._id} value={advogado._id}>{advogado.nome} - {advogado.areaAtuacao}</option>
                ))}
              </select>
            </label>

            {erro && <div className="alert error">{erro}</div>}
            {mensagem && <div className="alert success">{mensagem}</div>}

            <button className="button full">Enviar solicitação</button>
          </form>
        </section>
      </div>

      <section className="panel">
        <h2>Minhas solicitações</h2>
        <div className="card-list">
          {solicitacoes.length === 0 && <p className="muted">Nenhuma solicitação enviada ainda.</p>}
          {solicitacoes.map((solicitacao) => (
            <article className="card compact" key={solicitacao._id}>
              <div>
                <h3>{solicitacao.advogado?.nome}</h3>
                <p>{solicitacao.area}</p>
                <p className="muted">{solicitacao.descricao}</p>
              </div>
              <span className="badge">{solicitacao.status}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
