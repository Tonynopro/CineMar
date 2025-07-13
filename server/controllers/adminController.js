const path = require('path');
const Admin = require('../models/adminModel');
const sharp = require('sharp');
const e = require('express');

exports.mostrarPanelAdmin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index-admin.html'));
}

exports.mostrarFormularioAcceso = (req, res) => {
    if (req.session.tipo === "admin") {
        return res.redirect('/admin/index');
    }
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
    });
    res.sendFile(path.join(__dirname, '../../public/views/iniciar-sesion-admin.html'));
}

exports.mostrarFormularioAsignarTrabajadores = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/asignar-turno.html'));
}

exports.mostrarFormularioAsignarFunciones = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/registrar-funcion.html'));
}

exports.mostrarFormularioCrearPelicula = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/crear-pelicula.html'));
}

exports.accesoAdmin = async (req, res) => {
    const { id, contraseña } = req.body;

    try {
        const results = await Admin.accesoAdmin(id, contraseña);
        const mensaje = results[0][0].mensaje;

        if (mensaje === "ACCESO") {
            let perfil = results[0][0];
            req.session.idAdmin = "admin";
            req.session.contraseña = "sasa";
            req.session.tipo = "admin";
            return res.json({ ok: true, redirectTo: '/' });
        } else {
            return res.json({ ok: false, mensaje });
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.asignarRol = async (req, res) => {
    const { fecha, trabajador, rol } = req.body;

    try {
        await Admin.asignarRol(fecha, trabajador, rol);
        return res.json({ ok: true, mensaje: "Trabajador asignado con éxito" });
    } catch (err) {
        console.error('Error al asignar rol:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.traerTodosTrabajadores = async (req, res) => {
    try {
        const results = await Admin.traerTodosTrabajadores();
        return res.json({ ok: true, trabajadores: results[0] });
    } catch (err) {
        console.error('Error al traer trabajadores:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.traerTodosRoles = async (req, res) => {
    try {
        const results = await Admin.traerTodosRoles();
        return res.json({ ok: true, roles: results[0] });
    } catch (err) {
        console.error('Error al traer roles:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.traerTodasSalas = async (req, res) => {
    try {
        const results = await Admin.traerTodasSalas();
        return res.json({ ok: true, salas: results[0] });
    } catch (err) {
        console.error('Error al traer salas:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.asignarSala = async (req, res) => {
    const { fecha, trabajador, rol, sala } = req.body;

    try {
        await Admin.asignarSala(fecha, trabajador, rol, sala);
        return res.json({ ok: true, mensaje: "Sala asignada con éxito" });
    } catch (err) {
        console.error('Error al asignar sala:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.traerTodasPeliculas = async (req, res) => {
    try {
        const results = await Admin.traerTodasPeliculas();
        return res.json({ ok: true, peliculas: results[0] });
    } catch (err) {
        console.error('Error al traer peliculas:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.registrarFuncion = async (req, res) => {
    const { ID_pelicula, Num_sala, dia, hora } = req.body;

    try {
        await Admin.registrarFuncion(ID_pelicula, Num_sala, dia, hora);
        return res.json({ ok: true, mensaje: "Función registrada con éxito" });
    } catch (err) {
        console.error('Error al registrar función:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.salirAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.json({ ok: false, mensaje: err.message });
        }
        res.redirect('/admin');
    });
}

exports.traerTodosActores = async (req, res) => {
    try {
        const results = await Admin.traerTodosActores();
        return res.json({ ok: true, actores: results[0] });
    } catch (err) {
        console.error('Error al traer actores:', err);
        return res.json({ ok: false, mensaje: err.message });
    }
}

exports.registrarActor = async (req, res) => {
    const { nombre } = req.body;
    const archivo = req.file;

    if (!nombre || !archivo) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan nombre o imagen del actor' });
    }

    const nombreArchivo = archivo.filename;
    const rutaOriginal = archivo.path;
    const rutaWebp = rutaOriginal.replace(path.extname(rutaOriginal), '.webp');

    try {
        // Crear copia en .webp
        await sharp(rutaOriginal)
            .webp({ quality: 80 })
            .toFile(rutaWebp);

        // Guardar solo el nombre del archivo original en la base de datos
        const result = await Admin.crearActor(nombre, nombreArchivo);

        return res.json({ ok: true, mensaje: "Actor registrado con éxito", actor: result[0][0] });
    } catch (err) {
        console.error('Error al registrar actor:', err);
        return res.status(500).json({ ok: false, mensaje: err.message });
    }
};

const { exec } = require('child_process');

exports.registrarPelicula = async (req, res) => {
    const { titulo, descripcion, genero, clasificacion, duracion, director, actoresJSON } = req.body;
    const poster = req.files.poster ? req.files.poster[0] : null;
    const trailer = req.files.trailer ? req.files.trailer[0] : null;

    if (!titulo || !descripcion || !genero || !clasificacion || !duracion || !director || !poster) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan datos para registrar la película' });
    }

    const posterPath = poster.filename;
    const trailerPath = trailer ? trailer.filename : null;

    let actores = [];
    try {
        actores = JSON.parse(actoresJSON || '[]');
    } catch (err) {
        return res.status(400).json({ ok: false, mensaje: 'Error al interpretar los actores' });
    }

    try {
        const result = await Admin.registrarPelicula({
            titulo,
            descripcion,
            genero,
            clasificacion,
            imagen: posterPath,
            duracion,
            director,
            trailer: trailerPath
        }, actores);

        res.json({ ok: true, mensaje: "Película registrada con éxito" });

        // EJECUTAMOS EL SCRIPT EN SEGUNDO PLANO (NO BLOQUEA):
        exec('node server/bots/generarFunciones', (error, stdout, stderr) => {
            if (error) {
                console.error('Error al ejecutar generarFunciones:', error.message);
                return;
            }
            if (stderr) {
                console.error('stderr generarFunciones:', stderr);
            }
            console.log('Salida generarFunciones:', stdout);
        });
        
    } catch (err) {
        console.error('Error al registrar película:', err);
        return res.status(500).json({ ok: false, mensaje: err.message });
    }
};

