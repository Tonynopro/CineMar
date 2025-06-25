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
        userMenu.innerHTML = `
            <a href="/cliente/menu">Ingresar</a>
        `;
    }
};

const checkUserLogin = async () => {
    try {
        const response = await fetch("/cliente/info_usuario");
        const data = await response.json();
        if (data.ok) {
            console.log(data);
            userLoggedIn = true;
            userName = data.data.nombre || "Usuario";
        }
    } catch (error) {
        userLoggedIn = false;
    } finally {
        renderUserMenu();
    }
};

userIcon.addEventListener("click", () => {
    const isVisible = userMenu.style.display === "flex";
    userMenu.style.display = isVisible ? "none" : "flex";

    if (!isVisible) {
        checkUserLogin();
    }
});

document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = "none";
    }
});
