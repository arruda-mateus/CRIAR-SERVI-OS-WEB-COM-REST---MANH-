const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function api(caminho, opcoes = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(opcoes.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Erro na comunicação com o servidor.");
  }

  return dados;
}
