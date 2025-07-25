const userIcon = document.getElementById("userIcon");
const userMenu = document.getElementById("userMenu");
const header = document.querySelector("header");

let userLoggedIn = false;
let userName = "";
let checkingUser = false;

let lastScrollTop = 0;
let ticking = false;
let initialLoadDone = false;

// Desactivar comportamiento dinámico de header durante carga
document.body.classList.add("init-loading");

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
    if (checkingUser) return;
    checkingUser = true;

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
        checkingUser = false;
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

document.addEventListener("DOMContentLoaded", () => {
    lastScrollTop = window.scrollY;
    header.classList.toggle("scrolled", window.scrollY > 20);

    // Esperar un poco para dejar que se cargue contenido dinámico (como de fetchs, etc.)
    setTimeout(() => {
        initialLoadDone = true;
        document.body.classList.remove("init-loading");
    }, 600); // puedes ajustar este tiempo si tu contenido tarda más
});

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            const scrollDiff = currentScroll - lastScrollTop;

            header.classList.toggle("scrolled", currentScroll > 20);

            if (initialLoadDone) {
                if (scrollDiff > 10 && currentScroll > 100) {
                    header.classList.add("compact", "hidden");
                } else if (scrollDiff < -10) {
                    header.classList.remove("compact", "hidden");
                }
            }

            lastScrollTop = Math.max(currentScroll, 0);
            ticking = false;
        });

        ticking = true;
    }
});
