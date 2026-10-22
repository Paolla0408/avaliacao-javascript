// Cardápio local: lê produtos.json, sem API externa nem Postman.
function textoSeguro(valor = '') {
  return String(valor).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function nomeProduto(produto) {
  return produto.produto || produto.nome || 'Prato do Takumi';
}

function imagemProduto(produto) {
  return produto.imagem || 'combo-2.jpg';
}

function criarCard(produto) {
  const nome = nomeProduto(produto);
  const descricao = produto.descricao || 'Uma escolha especial da culinária japonesa.';
  const preco = produto.preco ? `R$ ${textoSeguro(String(produto.preco).replace(/^R\$\s*/, ''))}` : 'Feito com cuidado';
  const id = produto.id || nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');

  const artigo = document.createElement('article');
  artigo.className = 'card';
  artigo.dataset.pesquisa = `${nome} ${descricao} ${produto.restaurante || ''}`.toLocaleLowerCase('pt-BR');

  const img = document.createElement('img');
  img.src = imagemProduto(produto);
  img.alt = nome;
  img.loading = 'lazy';
  img.onerror = () => {
    img.onerror = null;
    img.src = 'combo-2.jpg';
  };

  const corpo = document.createElement('div');
  corpo.className = 'card-body';
  corpo.innerHTML = `
    <span class="card-tag">TAKUMI SELECTION</span>
    <h3>${textoSeguro(nome)}</h3>
    <p>${textoSeguro(descricao)}</p>
    <div class="price-row"><span class="price">${preco}</span></div>
    <a class="btn btn-primary" href="detalhes.html?id=${encodeURIComponent(id)}">Ver detalhes <span aria-hidden="true">↗</span></a>
  `;
  artigo.append(img, corpo);
  return artigo;
}

function configurarPesquisa() {
  const campo = document.getElementById('pesquisa-cardapio');
  const limpar = document.getElementById('limpar-pesquisa');
  const lista = document.getElementById('lista-produtos');
  const status = document.getElementById('status-api');
  if (!campo || !lista) return;

  function filtrar() {
    const termo = campo.value.trim().toLocaleLowerCase('pt-BR');
    const cards = [...lista.querySelectorAll('.card')];
    let encontrados = 0;
    cards.forEach(card => {
      const corresponde = (card.dataset.pesquisa || card.textContent).toLocaleLowerCase('pt-BR').includes(termo);
      card.hidden = !corresponde;
      if (corresponde) encontrados++;
    });
    let vazio = lista.querySelector('.empty-state');
    if (encontrados === 0 && cards.length > 0) {
      if (!vazio) {
        vazio = document.createElement('p');
        vazio.className = 'empty-state';
        vazio.textContent = 'Nenhum prato encontrado. Tente pesquisar por outro nome ou ingrediente.';
        lista.append(vazio);
      }
      vazio.hidden = false;
    } else if (vazio) {
      vazio.hidden = true;
    }
    if (status) status.textContent = termo
      ? `${encontrados} ${encontrados === 1 ? 'prato encontrado' : 'pratos encontrados'}.`
      : `Cardápio carregado: ${cards.length} pratos.`;
  }

  campo.addEventListener('input', filtrar);
  limpar?.addEventListener('click', () => {
    campo.value = '';
    filtrar();
    campo.focus();
  });
}

async function carregarCardapio() {
  const lista = document.getElementById('lista-produtos');
  const status = document.getElementById('status-api');
  if (!lista) return;
  try {
    const resposta = await fetch('produtos.json');
    if (!resposta.ok) throw new Error('Não foi possível abrir produtos.json');
    const produtos = await resposta.json();
    if (!Array.isArray(produtos) || produtos.length === 0) throw new Error('O cardápio está vazio.');
    lista.replaceChildren(...produtos.map(criarCard));
    if (status) status.textContent = `Cardápio carregado: ${produtos.length} pratos.`;
    configurarPesquisa();
  } catch (erro) {
    console.error(erro);
    if (status) status.textContent = 'Não foi possível carregar o cardápio. Abra o projeto com o Live Server no VS Code.';
  }
}

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  const botao = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!botao || !links) return;
  const aberto = links.classList.toggle('open');
  botao.setAttribute('aria-expanded', String(aberto));
  botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

carregarCardapio();
