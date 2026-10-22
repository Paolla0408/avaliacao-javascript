// Página de detalhes totalmente local: consulta somente produtos.json.
function seguro(valor = '') {
  return String(valor).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function nomeDo(produto) {
  return produto.produto || produto.nome || 'Prato do Takumi';
}

async function carregarDetalhe() {
  const status = document.getElementById('status-detalhe');
  const area = document.getElementById('detalhe-produto');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  try {
    const resposta = await fetch('produtos.json');
    if (!resposta.ok) throw new Error('Não foi possível ler produtos.json');
    const produtos = await resposta.json();
    const produto = produtos.find(p => String(p.id) === id);

    if (!produto) {
      if (status) status.textContent = 'Não encontramos esse prato. Volte ao cardápio e escolha outro.';
      return;
    }

    const nome = nomeDo(produto);
    const preco = produto.preco ? `R$ ${seguro(String(produto.preco).replace(/^R\$\s*/, ''))}` : '';
    const imagem = produto.imagem || 'combo-2.jpg';

    area.innerHTML = `
      <article class="detail-product">
        <img id="imagem-detalhe" src="${seguro(imagem)}" alt="${seguro(nome)}">
        <div class="detail-copy">
          <span class="eyebrow">TAKUMI SELECTION</span>
          <h2>${seguro(nome)}</h2>
          <p>${seguro(produto.descricao || 'Um prato preparado com cuidado para valorizar cada sabor.')}</p>
          ${preco ? `<span class="price">${preco}</span>` : ''}
          <p><strong>Restaurante:</strong> Takumi Sushi</p>
          <a class="btn btn-primary" href="cardapio.html">Voltar aos pratos <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    `;

    const img = document.getElementById('imagem-detalhe');
    img.onerror = () => {
      img.onerror = null;
      img.src = 'combo-2.jpg';
    };
    if (status) status.textContent = '';
  } catch (erro) {
    console.error(erro);
    if (status) status.textContent = 'Não foi possível carregar os detalhes. Abra o projeto usando o Live Server.';
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

carregarDetalhe();
