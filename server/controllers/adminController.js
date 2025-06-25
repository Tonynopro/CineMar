const path = require('path');
const Admin = require('../models/adminModel');
const e = require('express');

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

exports.accesoAdmin = (req, res) => {
    const { id, contraseña } = req.body;

    Admin.accesoAdmin(id, contraseña, (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

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
    });
}

exports.asignarRol = (req, res) => {
    const { fecha, trabajador, rol } = req.body;

    console.log(fecha, trabajador, rol);

    Admin.asignarRol(fecha, trabajador, rol, (err) => {
        if (err) {
            console.error('Error al asignar rol:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, mensaje: "Trabajador asignado con exito" });
    });
}

exports.traerTodosTrabajadores = (req, res) => {
    Admin.traerTodosTrabajadores((err, results) => {
        if (err) {
            console.error('Error al traer trabajadores:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, trabajadores: results[0] });
    });
}

exports.traerTodosRoles = (req, res) => {
    Admin.traerTodosRoles((err, results) => {
        if (err) {
            console.error('Error al traer roles:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, roles: results[0] });
    });
}

exports.traerTodasSalas = (req, res) => {
    Admin.traerTodasSalas((err, results) => {
        if (err) {
            console.error('Error al traer salas:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, salas: results[0] });
    });
}

exports.asignarSala = (req, res) => {
    const { fecha, trabajador, rol, sala } = req.body; 
    Admin.asignarSala(fecha, trabajador, rol, sala, (err) => {
        if (err) {
            console.error('Error al asignar sala:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, mensaje: "Sala asignada con exito" });
    });
}

exports.traerTodasPeliculas = (req, res) => {
    Admin.traerTodasPeliculas((err, results) => {
        if (err) {
            console.error('Error al traer peliculas:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, peliculas: results[0] });
    });
}

exports.registrarFuncion = (req, res) => {
    const { ID_pelicula, Num_sala, dia, hora } = req.body;

    console.log(ID_pelicula, Num_sala, dia, hora);

    Admin.registrarFuncion(ID_pelicula, Num_sala, dia, hora, (err) => {
        if (err) {
            console.error('Error al registrar función:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, mensaje: "Función registrada con éxito" });
    });
}

exports.salirAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }
        res.redirect('/admin');
    });
}