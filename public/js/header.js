const userIcon = document.getElementById("userIcon");
const userMenu = document.getElementById("userMenu");

let userLoggedIn = false;
let userName = "";

const renderUserMenu = () => {
    if (userLoggedIn) {
        userMenu.innerHTML = `
            <div><strong>${userName}</strong></div>
            <a href="/cliente/boletos">Mis funciones</a>
            <a href="/cliente/perfil">Mi cuenta</a>
            <a href="/cliente/salir">Cerrar sesión</a>
        `;
    } else {
        userMenu.innerHTML = `<a href="/cliente/menu">Ingresar</a>`;
    }
};

const checkUserLogin = async () => {
    try {
        const response = await fetch("/cliente/info_usuario");
        const data = await response.json();
        if (data.ok) {
            userLoggedIn = true;
            userName = data.data.nombre || "Usuario";
        }
    } catch {
        userLoggedIn = false;
    } finally {
        renderUserMenu();
    }
};

userIcon.addEventListener("click", () => {
    const visible = userMenu.classList.contains("show");
    if (!visible) {
        checkUserLogin();
    }
    userMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove("show");
    }
});

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.classList.toggle("scrolled", window.scrollY > 20);
});

let lastScrollTop = 0;
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const header = document.querySelector("header");
      const currentScroll = window.scrollY;
      const scrollDiff = currentScroll - lastScrollTop;

      // Sombra al hacer scroll
      header.classList.toggle("scrolled", currentScroll > 20);

      // Contraer
      if (scrollDiff > 10 && currentScroll > 100) {
        header.classList.add("compact");
      } else if (scrollDiff < -10) {
        header.classList.remove("compact");
      }

      // Ocultar al bajar, mostrar al subir
      if (scrollDiff > 10 && currentScroll > 100) {
        header.classList.add("hidden");
      } else if (scrollDiff < -10) {
        header.classList.remove("hidden");
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      ticking = false;
    });

    ticking = true;
  }
});

