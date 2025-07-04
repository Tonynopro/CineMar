const path = require('path');
const Admin = require('../models/adminModel');

exports.mostrarPanelAdmin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index-admin.html'));
}

exports.mostrarFormularioAcceso = (req, res) => {
    if(req.session.tipo === "admin"){
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
