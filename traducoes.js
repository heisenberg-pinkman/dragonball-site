// ===== Dicionários de tradução =====
// Se um termo não estiver aqui, o site mostra o original (nada quebra).

const RACAS = {
  "Saiyan": "Saiyajin",
  "Human": "Humano",
  "Namekian": "Namekuseijin",
  "Frieza Race": "Raça de Freeza",
  "Android": "Andróide",
  "God": "Deus",
  "Angel": "Anjo",
  "Unknown": "Desconhecida"
};

const AFILIACOES = {
  "Z Fighter": "Guerreiro Z",
  "Army of Frieza": "Exército de Freeza",
  "Freelancer": "Independente",
  "Red Ribbon Army": "Exército da Fita Vermelha",
  "Pride Troopers": "Tropas do Orgulho",
  "Other": "Outros",
  "Villain": "Vilão"
};

const UNIDADES_KI = {
  "Million": "Milhão",
  "Billion": "Bilhão",
  "Trillion": "Trilhão",
  "Quadrillion": "Quadrilhão",
  "Quintillion": "Quintilhão",
  "Sextillion": "Sextilhão",
  "Septillion": "Septilhão",
  "Octillion": "Octilhão",
  "Nonillion": "Nonilhão"
};

// Descrições em português, usando o ID do personagem como chave
const DESCRICOES = {
  1: "Protagonista da série. Enviado à Terra ainda bebê, cresceu como um guerreiro de coração puro e se tornou o maior defensor do planeta e do Universo 7.",
  2: "Príncipe dos Saiyajins. Começou como vilão, mas se uniu aos Guerreiros Z e se tornou um grande aliado e rival de Goku.",
  3: "Namekuseijin criado por Kami-sama. Antes arqui-inimigo de Goku, tornou-se um aliado fiel e uma figura paterna para Gohan.",
  4: "Gênia da tecnologia e filha do Dr. Briefs. Começou a busca pelas Esferas do Dragão junto com Goku e é mãe de Trunks e Bra.",
  5: "Tirano espacial e principal vilão da Saga de Freeza, responsável pela destruição do planeta Vegeta.",
  6: "Um dos braços direitos de Freeza, um guerreiro elegante e poderoso do seu exército.",
  7: "Soldado de elite de Freeza, conhecido pela brutalidade.",
  8: "Líder das Forças Especiais Ginyu, o grupo de mercenários mais prestigiado do exército de Freeza.",
  9: "Bioandroide criado a partir das células dos maiores guerreiros. Vilão da Saga dos Androides e Cell, cujo objetivo é dominar o mundo.",
  10: "Filho de Goku e Chi-Chi. Meio saiyajin, meio humano, é um dos protagonistas dos maiores arcos da série."
};

// ===== Funções de tradução =====
function traduzir(dicionario, termo) {
  return dicionario[termo] || termo; // se não achar, devolve o original
}

function traduzirKi(texto) {
  let resultado = texto;
  for (const unidade in UNIDADES_KI) {
    resultado = resultado.replace(unidade, UNIDADES_KI[unidade]);
  }
  return resultado;
}

function descricaoPt(personagem) {
  return DESCRICOES[personagem.id] || personagem.description;
}