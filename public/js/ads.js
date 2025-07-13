const ads = [
  { img: '../images/popups/popup1.gif', link: 'https://deltarune.com' },
  { img: '../images/popups/chivaColaAnuncio.webp', link: 'https://na-portal.omnilife.com/productos/chiva-cola-4310406' },
  { img: '../images/popups/megaAnuncio.webp', link: 'https://www.instagram.com/mega_mexico/?hl=es' },
  { img: '../images/popups/timHortons.webp', link: 'https://timhortonsmx.com/es/index.html' },
  { img: '../images/popups/popup2.gif', link: 'https://store.steampowered.com/app/2701030/MINDWAVE/' },
  { img: '../images/popups/caliente.gif', link: 'https://www.caliente.mx' },
];

function createAd() {
  const ad = ads[Math.floor(Math.random() * ads.length)];
  const popup = document.createElement('div');
  popup.className = 'ad-banner';

  const close = document.createElement('span');
  close.className = 'ad-close';
  close.innerHTML = '&times;';
  close.onclick = () => {
  const chance = Math.random();
  if (chance < 0.3) {
    // 30% de probabilidad: se mueve en vez de cerrarse
    popup.classList.add('moving');

    const popupWidth = popup.offsetWidth || 160;
    const popupHeight = popup.offsetHeight || 160;
    const maxLeft = window.innerWidth - popupWidth - 10;
    const maxTop = window.innerHeight - popupHeight - 10;

    const newLeft = Math.floor(Math.random() * maxLeft);
    const newTop = Math.floor(Math.random() * maxTop);

    popup.style.left = `${newLeft}px`;
    popup.style.top = `${newTop}px`;

    // Quita clase "moving" después de que termine
    setTimeout(() => {
      popup.classList.remove('moving');
    }, 500);
  } else {
    // Cierre normal con animación
    popup.classList.add('closing');
    setTimeout(() => {
      popup.remove();
    }, 400);
  }
};



  const link = document.createElement('a');
  link.href = ad.link;
  link.target = '_blank';

  const img = document.createElement('img');
  img.src = ad.img;
  img.loading = 'lazy';
  link.appendChild(img);

  popup.appendChild(close);
  popup.appendChild(link);

  // Posición aleatoria dentro de la ventana
  positionPopup(popup);

  document.getElementById('adsbygoogle').appendChild(popup);
}

function positionPopup(popup) {
  const popupWidth = popup.offsetWidth || 150;
  const popupHeight = popup.offsetHeight || 150;

  const maxLeft = window.innerWidth - popupWidth - 10;
  const maxTop = window.innerHeight - popupHeight - 10;

  popup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
  popup.style.top = Math.floor(Math.random() * maxTop) + 'px';
}

// Reajustar popups al redimensionar
function repositionAllPopups() {
  const popups = document.querySelectorAll('.ad-banner');

  popups.forEach(popup => {
    const popupWidth = popup.offsetWidth || 150;
    const popupHeight = popup.offsetHeight || 150;

    const left = parseInt(popup.style.left || 0);
    const top = parseInt(popup.style.top || 0);

    let newLeft = left;
    let newTop = top;

    const maxLeft = window.innerWidth - popupWidth - 10;
    const maxTop = window.innerHeight - popupHeight - 10;

    if (left > maxLeft) newLeft = maxLeft;
    if (top > maxTop) newTop = maxTop;

    popup.style.left = newLeft + 'px';
    popup.style.top = newTop + 'px';
  });
}

window.addEventListener('resize', repositionAllPopups);

// Genera popups cada 4 segundos con 50% de probabilidad
setInterval(() => {
  if (Math.random() < 0.15) createAd();
}, 30000);
