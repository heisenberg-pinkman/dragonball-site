// ===== 1. Endereço da API e elementos da página =====
const URL_API = "https://dragonball-api.com/api/characters?limit=58";
const URL_DETALHE = "https://dragonball-api.com/api/characters/";

const listaCards = document.getElementById("lista-cards");
const mensagem = document.getElementById("mensagem");
const campoBusca = document.getElementById("busca");

const modal = document.getElementById("modal");
const modalCorpo = document.getElementById("modal-corpo");
const botaoFechar = document.getElementById("modal-fechar");

// Guarda TODOS os personagens que vieram da API (a busca filtra essa lista)
let todosPersonagens = [];


// ===== 2. Favoritos (guardados no localStorage) =====
function carregarFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  } catch (erro) {
    return [];
  }
}

let favoritos = carregarFavoritos(); // lista com os ids dos favoritos

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function alternarFavorito(id, botao) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(function (favId) {
      return favId !== id;
    });
    botao.textContent = "♡";
  } else {
    favoritos.push(id);
    botao.textContent = "♥";
  }
  salvarFavoritos();
}


// ===== 3. Função auxiliar: cria um elemento com classe e texto =====
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.classList.add(classe);
  if (texto) elemento.textContent = texto;
  return elemento;
}


// ===== 4. Cria UM card a partir de UM personagem =====
function criarCard(personagem) {
  const card = document.createElement("article");
  card.classList.add("card");

  // Coração: começa cheio (♥) se o personagem já for favorito
  const coracao = document.createElement("button");
  coracao.classList.add("coracao");
  coracao.setAttribute("aria-label", "Favoritar " + personagem.name);
  coracao.textContent = favoritos.includes(personagem.id) ? "♥" : "♡";
  coracao.addEventListener("click", function (evento) {
    evento.stopPropagation(); // impede que o clique abra a janela de detalhes
    alternarFavorito(personagem.id, coracao);
  });

  const nome = document.createElement("h3");
  nome.classList.add("card-nome");
  nome.textContent = personagem.name;

  const imagem = document.createElement("img");
  imagem.classList.add("card-img");
  imagem.src = personagem.image;
  imagem.alt = personagem.name;

  const ki = document.createElement("p");
  ki.classList.add("card-ki");
  ki.textContent = "Ki: " + traduzirKi(personagem.ki);

  const kiMax = document.createElement("p");
  kiMax.classList.add("card-info");
  kiMax.textContent = "Ki máximo: " + traduzirKi(personagem.maxKi);

  const info = document.createElement("p");
  info.classList.add("card-info");
  info.textContent =
    traduzir(RACAS, personagem.race) + " · " + traduzir(AFILIACOES, personagem.affiliation);

  const descricao = document.createElement("p");
  descricao.classList.add("card-desc");
  descricao.textContent = descricaoPt(personagem);

  // Encaixa tudo dentro do card, na ordem em que devem aparecer
  card.appendChild(coracao);
  card.appendChild(nome);
  card.appendChild(imagem);
  card.appendChild(ki);
  card.appendChild(kiMax);
  card.appendChild(info);
  card.appendChild(descricao);

  // Clicar em qualquer parte do card abre os detalhes
  card.addEventListener("click", function () {
    abrirDetalhes(personagem.id);
  });

  return card;
}


// ===== 5. Cria os cards de uma lista de personagens =====
function mostrarCards(lista) {
  listaCards.textContent = "";

  lista.forEach(function (personagem) {
    listaCards.appendChild(criarCard(personagem));
  });
}


// ===== 6. Busca por nome =====
campoBusca.addEventListener("input", function () {
  const termo = campoBusca.value.toLowerCase().trim();

  const filtrados = todosPersonagens.filter(function (personagem) {
    return personagem.name.toLowerCase().includes(termo);
  });

  mensagem.textContent =
    filtrados.length === 0 ? "Nenhum personagem encontrado." : "";

  mostrarCards(filtrados);
});


// ===== 7. Janela de detalhes (segundo fetch) =====
function abrirDetalhes(id) {
  modal.hidden = false;
  modalCorpo.textContent = "Carregando detalhes...";

  fetch(URL_DETALHE + id)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (personagem) {
      mostrarDetalhes(personagem);
    })
    .catch(function (erro) {
      console.log("Deu erro:", erro);
      modalCorpo.textContent = "Não foi possível carregar os detalhes.";
    });
}

function mostrarDetalhes(personagem) {
  modalCorpo.textContent = ""; // limpa o "Carregando..."

  modalCorpo.appendChild(criarElemento("h2", "modal-corpo-titulo", personagem.name));
  modalCorpo.appendChild(
    criarElemento("p", "modal-ki", "Ki máximo: " + traduzirKi(personagem.maxKi))
  );

  // --- Planeta de origem (pode não existir para todos) ---
  modalCorpo.appendChild(criarElemento("h3", "modal-secao", "Planeta de origem"));

  if (personagem.originPlanet) {
    const planeta = criarElemento("div", "planeta");

    const imagemPlaneta = document.createElement("img");
    imagemPlaneta.src = personagem.originPlanet.image;
    imagemPlaneta.alt = personagem.originPlanet.name;

    const textoPlaneta = document.createElement("div");
    textoPlaneta.appendChild(criarElemento("strong", null, personagem.originPlanet.name));
    textoPlaneta.appendChild(
      criarElemento(
        "p",
        null,
        personagem.originPlanet.isDestroyed ? "Planeta destruído" : "Planeta intacto"
      )
    );

    planeta.appendChild(imagemPlaneta);
    planeta.appendChild(textoPlaneta);
    modalCorpo.appendChild(planeta);
  } else {
    modalCorpo.appendChild(criarElemento("p", null, "Informação não disponível."));
  }

  // --- Transformações (algumas vezes a lista vem vazia) ---
  modalCorpo.appendChild(criarElemento("h3", "modal-secao", "Transformações"));

  if (personagem.transformations && personagem.transformations.length > 0) {
    const grade = criarElemento("div", "grade-transformacoes");

    personagem.transformations.forEach(function (transf) {
      const item = criarElemento("div", "transformacao");

      const imagem = document.createElement("img");
      imagem.src = transf.image;
      imagem.alt = transf.name;

      item.appendChild(imagem);
      item.appendChild(criarElemento("strong", null, transf.name));
      item.appendChild(criarElemento("span", null, "Ki: " + traduzirKi(transf.ki)));

      grade.appendChild(item);
    });

    modalCorpo.appendChild(grade);
  } else {
    modalCorpo.appendChild(
      criarElemento("p", null, "Este personagem não possui transformações.")
    );
  }
}

// ===== 8. Fechar a janela =====
function fecharModal() {
  modal.hidden = true;
}

botaoFechar.addEventListener("click", fecharModal);

// Clicar no fundo escuro (fora da janela branca) também fecha
modal.addEventListener("click", function (evento) {
  if (evento.target === modal) fecharModal();
});

// Tecla ESC fecha
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") fecharModal();
});


// ===== 9. Busca a lista na API e mostra os cards =====
fetch(URL_API)
  .then(function (resposta) {
    return resposta.json();
  })
  .then(function (dados) {
    todosPersonagens = dados.items; // guarda a lista completa
    mensagem.textContent = "";
    mostrarCards(todosPersonagens);
  })
  .catch(function (erro) {
    console.log("Deu erro:", erro);
    mensagem.textContent = "Não foi possível carregar os personagens. Tente novamente.";
  });