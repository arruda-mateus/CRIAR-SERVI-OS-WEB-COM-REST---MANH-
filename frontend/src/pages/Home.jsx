import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="tag">Segurança jurídica digital</span>
        <h1>Evite golpes de falsos advogados.</h1>
        <p>
          O Vigia Jurídico centraliza o contato entre cliente e advogado em uma plataforma segura,
          com cadastro, verificação de OAB, solicitações de atendimento e comunicação protegida.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/registro">Criar conta</Link>
          <Link className="button button-outline" to="/login">Entrar</Link>
        </div>
      </div>

      <div className="grid three-columns">
        <article className="card">
          <h3>Advogados verificados</h3>
          <p>Profissionais cadastrados com OAB e área de atuação para passar mais confiança ao cliente.</p>
        </article>

        <article className="card">
          <h3>Comunicação centralizada</h3>
          <p>O cliente evita contatos suspeitos por telefone e usa a plataforma para iniciar atendimento.</p>
        </article>

        <article className="card">
          <h3>Indicação por perfil</h3>
          <p>O cliente descreve o caso e o sistema sugere uma área jurídica adequada.</p>
        </article>
      </div>

      <section className="panel warning-panel">
        <h2>Central Antigolpe</h2>
        <ul>
          <li>Desconfie de mensagens com urgência exagerada.</li>
          <li>Confirme se o advogado possui OAB cadastrada.</li>
          <li>Não envie dinheiro para contatos desconhecidos.</li>
          <li>Prefira iniciar atendimento dentro da plataforma.</li>
        </ul>
      </section>
    </section>
  );
}
