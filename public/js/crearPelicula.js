const pathImages = '../images/';

const actorSelect = document.getElementById("actorSelect");
const listaActores = document.getElementById("listaActores");

let actoresPredefinidos = [];

async function fetchActores() {
    try {
        const response = await fetch('/admin/actores');
        if (!response.ok) throw new Error('Error al cargar actores');
        const data = await response.json();
        return data.actores;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function cargarActores() {
    const actores = await fetchActores();
    actoresPredefinidos = actores.map(actor => ({ nombre: actor.nombre, id_actor: actor.id_actor, foto: pathImages + "actores/" + actor.imagen }));
    actorSelect.innerHTML = '<option value="">-- Selecciona un actor existente --</option>';
    console.log("Actores cargados:", actores);
    actores.forEach(actor => {
        const option = document.createElement("option");
        option.value = actor.id_actor;
        option.textContent = actor.nombre;
        actorSelect.appendChild(option);
    });
}

function actorYaExiste(nombre) {
    const items = listaActores.querySelectorAll("li");
    for (let item of items) {
        if (item.dataset.nombre?.toLowerCase() === nombre.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function actorYaEsPredefinido(nombre) {
    return actoresPredefinidos.some(actor => actor.nombre.toLowerCase() === nombre.toLowerCase());
}

function eliminarDelSelectPorNombre(nombre) {
    const options = actorSelect.querySelectorAll("option");
    options.forEach(option => {
        if (option.textContent.toLowerCase() === nombre.toLowerCase()) {
            option.remove();
        }
    });
}

function agregarAlSelect(nombre, id = "") {
    const yaExiste = Array.from(actorSelect.options).some(
        opt => opt.textContent.toLowerCase() === nombre.toLowerCase()
    );
    if (yaExiste) return;

    const option = document.createElement("option");
    option.value = id || nombre;
    option.textContent = nombre;
    actorSelect.appendChild(option);
}

function agregarActorExistente() {
    const id_actor = actorSelect.value;
    const nombre = actorSelect.options[actorSelect.selectedIndex]?.textContent;
    const rol = document.getElementById("rolExistente").value.trim();
    let foto = null;

    console.log("Actor seleccionado:", nombre, "ID:", id_actor, "Rol:", rol);

    if (id_actor) {
        const actor = actoresPredefinidos.find(a => a.id_actor == id_actor);
        console.log("Actor encontrado:", actor);
        if (actor) {
            foto = actor.foto;
        }
    }

    if (!id_actor || !rol) {
        alert("Selecciona un actor y asigna un rol.");
        return;
    }

    if (actorYaExiste(nombre)) {
        alert("Este actor ya está agregado a esta película y no se puede duplicar.");
        return;
    }

    eliminarDelSelectPorNombre(nombre);
    agregarActorALista({ nombre, rol, id_actor, foto });
    actorSelect.value = "";
    document.getElementById("rolExistente").value = "";
}

function mostrarFormularioNuevo(force = false) {
    const form = document.getElementById("formNuevoActor");
    form.style.display = force ? "block" : (form.style.display === "none" ? "block" : "none");
}

async function agregarActorNuevo() {
    const nombre = document.getElementById("nuevoNombre").value.trim();
    const rol = document.getElementById("nuevoRol").value.trim();
    const fotoInput = document.getElementById("nuevaFoto");

    if (!nombre || !rol) {
        alert("Escribe nombre y rol del nuevo actor.");
        return;
    }

    if (actorYaExiste(nombre)) {
        alert("Este actor ya está agregado a esta película y no se puede duplicar.");
        return;
    }

    if (actorYaEsPredefinido(nombre)) {
        alert("Este actor ya existe en la lista de actores y debe seleccionarse desde ahí.");
        return;
    }

    const archivo = fotoInput.files[0];
    if (!archivo) {
        alert("Selecciona una imagen para el actor.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("tipo", "actor"); // si lo usas para enrutar la carpeta
    formData.append("archivo", archivo);


    console.log("Enviando datos:", nombre, rol, archivo);

    try {
        const res = await fetch("/admin/actores/registrar", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (!data.ok) {
            throw new Error(data.mensaje || "Error al registrar actor");
        }

        alert("Actor registrado con éxito");

        console.log("Actor registrado:", data.actor);

        // Agregar al listado visible
        const fotoURL = pathImages + "actores/" + data.actor.imagen;
        agregarActorALista({ nombre, rol, foto: fotoURL, id_actor: data.actor.id_actor });

        // Agrega a la lista interna
        actoresPredefinidos.push({ nombre });
        eliminarDelSelectPorNombre(nombre);
        cargarActores();

        // Limpiar formulario
        document.getElementById("nuevoNombre").value = "";
        document.getElementById("nuevoRol").value = "";
        fotoInput.value = "";
        document.getElementById("formNuevoActor").style.display = "none";

    } catch (error) {
        console.error(error);
        alert("Error al registrar actor: " + error.message);
    }
}


function agregarActorALista({ nombre, rol, foto, id_actor }) {
    const li = document.createElement("li");
    li.style.marginBottom = "12px";
    li.style.borderBottom = "1px solid #333";
    li.style.paddingBottom = "10px";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    li.dataset.nombre = nombre;
    li.dataset.rol = rol;
    if (id_actor) li.dataset.idActor = id_actor;


    if (foto) {
        const img = document.createElement("img");
        img.src = foto;
        img.alt = nombre;
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "50%";
        li.appendChild(img);
    }

    const span = document.createElement("span");
    span.innerHTML = `<strong>${nombre}</strong> como <em>${rol}</em>`;
    li.appendChild(span);

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "✕";
    eliminarBtn.style.marginLeft = "auto";
    eliminarBtn.style.background = "transparent";
    eliminarBtn.style.border = "none";
    eliminarBtn.style.color = "#f44336";
    eliminarBtn.style.cursor = "pointer";
    eliminarBtn.style.fontWeight = "bold";

    eliminarBtn.onclick = () => {
        li.remove();
        agregarAlSelect(nombre, id_actor || "");
    };

    li.appendChild(eliminarBtn);
    listaActores.appendChild(li);
}

function cancelarNuevoActor() {
    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoRol").value = "";
    document.getElementById("nuevaFoto").value = "";
    document.getElementById("formNuevoActor").style.display = "none";
}

// Inicializa al cargar
cargarActores();

const formCrearPelicula = document.getElementById("formCrearPelicula");

formCrearPelicula.addEventListener("submit", async (e) => {
    e.preventDefault();

    const personajes = Array.from(listaActores.querySelectorAll("li")).map(li => ({
        id_actor: parseInt(li.dataset.idActor),
        personaje: li.dataset.rol
    }));

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const clasificacion = document.getElementById("clasificacion").value;
    const imagen = document.getElementById("imagen").files[0];
    const duracion = document.getElementById("duracion").value.trim();
    const director = document.getElementById("director").value.trim();
    const trailer = document.getElementById("trailer").files[0];

    console.log("Datos a enviar:", {
        titulo,
        descripcion,
        genero,
        clasificacion,
        imagen,
        duracion,
        director,
        trailer,
        personajes
    });

    // Validación básica
    if (!titulo || !descripcion || !genero || !clasificacion || !imagen || !duracion || !director) {
        alert("Faltan campos obligatorios");
        return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("genero", genero);
    formData.append("clasificacion", clasificacion);
    formData.append("duracion", duracion);
    formData.append("director", director);
    formData.append("poster", imagen); // ⚠️ debe coincidir con `upload.fields([{ name: 'poster' }, ...])`
    if (trailer) formData.append("trailer", trailer);
    formData.append("actoresJSON", JSON.stringify(personajes));

    try {
        const res = await fetch("/admin/peliculas/registrar", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (data.ok) {
            alert("Película registrada correctamente.");
            window.location.href = "/admin/index";
        } else {
            alert("Error: " + data.mensaje);
        }
    } catch (err) {
        console.error(err);
        alert("Error al registrar la película.");
    }
});
