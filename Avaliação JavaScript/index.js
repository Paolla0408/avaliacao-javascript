// Contagem regressiva da oferta até a próxima meia-noite local.
(() => {
  const contador = document.getElementById('contador');
  const ano = document.getElementById('ano');

  if (ano) ano.textContent = new Date().getFullYear();
  if (!contador) return;

  function atualizarContador() {
    const agora = new Date();
    const fimDoDia = new Date(agora);
    fimDoDia.setHours(24, 0, 0, 0);
    const totalSegundos = Math.max(0, Math.floor((fimDoDia.getTime() - agora.getTime()) / 1000));
    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
    const segundos = String(totalSegundos % 60).padStart(2, '0');
    contador.textContent = `${horas}:${minutos}:${segundos}`;
  }

  atualizarContador();
  window.setInterval(atualizarContador, 1000);
})();
// Menu compacto para telas pequenas.
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  const botao = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const aberto = links.classList.toggle('open');
  botao.setAttribute('aria-expanded', String(aberto));
  botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
