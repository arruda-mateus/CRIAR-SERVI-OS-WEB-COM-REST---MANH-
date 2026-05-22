export function indicarAreaJuridica(descricao) {
  const texto = descricao.toLowerCase();

  const areas = [
    {
      nome: "Direito Trabalhista",
      termos: ["demissão", "rescisão", "salário", "fgts", "empresa", "trabalho", "patrão"]
    },
    {
      nome: "Direito de Família",
      termos: ["divórcio", "pensão", "guarda", "filho", "casamento", "alimentos"]
    },
    {
      nome: "Direito do Consumidor",
      termos: ["produto", "compra", "loja", "garantia", "defeito", "cobrança"]
    },
    {
      nome: "Direito Criminal",
      termos: ["crime", "delegacia", "prisão", "ameaça", "acusação", "boletim"]
    },
    {
      nome: "Direito Previdenciário",
      termos: ["aposentadoria", "inss", "benefício", "auxílio", "perícia"]
    }
  ];

  let melhorArea = "Direito Civil";
  let maiorPontuacao = 0;

  areas.forEach((area) => {
    let pontuacao = 0;

    area.termos.forEach((termo) => {
      if (texto.includes(termo)) {
        pontuacao++;
      }
    });

    if (pontuacao > maiorPontuacao) {
      maiorPontuacao = pontuacao;
      melhorArea = area.nome;
    }
  });

  return melhorArea;
}
