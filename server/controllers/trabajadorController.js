const path = require('path');
const Trabajador = require('../models/trabajadorModel');

exports.mostrarFormularioRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/registrar-trabajador.html'));
};

exports.mostrarFormularioAcceso = (req, res) => {
    if (req.session.tipo === "trabajador") {
        return res.redirect('/trabajador/index');
    }
    req.session.destroy(err => {
        if (err) console.error('Error al cerrar sesión:', err);
        res.clearCookie('connect.sid');
        res.sendFile(path.join(__dirname, '../../public/views/iniciar-sesion-trabajador.html'));
    });
};

exports.mostrarFormularioEliminacion = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/eliminar-trabajador.html'));
};

exports.mostrarPaginaPrincipal = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index-trabajador.html'));
};

exports.mostrarFormularioOferta = async (req, res) => {
    if (!req.session.idTrabajador) return res.redirect('/trabajador/iniciar-sesion');
    try {
        const results = await Trabajador.obtenerRolActual(req.session.idTrabajador);
        const roles = results[0];
        const tieneRolSala = roles.some(rol => rol.nombre_rol === 'supervisor');
        if (!tieneRolSala) return res.redirect('/trabajador/');
        res.sendFile(path.join(__dirname, '../../public/views/registrar-cupon.html'));
    } catch (err) {
        console.error('Error al obtener rol actual:', err);
        res.redirect('/trabajador/iniciar-sesion');
    }
};

exports.mostrarInfoSala = async (req, res) => {
    if (!req.session.idTrabajador) return res.redirect('/trabajador/iniciar-sesion');
    try {
        const results = await Trabajador.obtenerRolActual(req.session.idTrabajador);
        const roles = results[0];
        const tieneRolSala = roles.some(rol => rol.nombre_rol === 'sala');
        if (!tieneRolSala) return res.redirect('/trabajador/');
        res.sendFile(path.join(__dirname, '../../public/views/vista-sala.html'));
    } catch (err) {
        console.error('Error al obtener rol actual:', err);
        res.redirect('/trabajador/iniciar-sesion');
    }
};

exports.mostrarFunciones = async (req, res) => {
    if (!req.session.idTrabajador) return res.redirect('/trabajador/iniciar-sesion');
    try {
        const results = await Trabajador.obtenerRolActual(req.session.idTrabajador);
        const roles = results[0];
        const tieneRolTaquilla = roles.some(rol => rol.nombre_rol === 'taquilla');
        if (!tieneRolTaquilla) return res.redirect('/trabajador/');
        res.sendFile(path.join(__dirname, '../../public/views/cartelera.html'));
    } catch (err) {
        console.error('Error al obtener rol actual:', err);
        res.redirect('/trabajador/iniciar-sesion');
    }
};

exports.mostrarHorariosPelicula = async (req, res) => {
    if (!req.session.idTrabajador) return res.redirect('/trabajador/iniciar-sesion');
    try {
        const results = await Trabajador.obtenerRolActual(req.session.idTrabajador);
        const roles = results[0];
        const tieneRolTaquilla = roles.some(rol => rol.nombre_rol === 'taquilla');
        if (!tieneRolTaquilla) return res.redirect('/trabajador/');
        res.sendFile(path.join(__dirname, '../../public/views/horarios-taquilla.html'));
    } catch (err) {
        console.error('Error al obtener rol actual:', err);
        res.redirect('/trabajador/iniciar-sesion');
    }
};

exports.obtenerSupervisores = async (req, res) => {
    try {
        const results = await Trabajador.obtenerSupervisores();
        const supervisores = results[0].map(s => ({
            id: s.ID_trabajador,
            nombre: s.nombre,
            apellido: s.apellido,
            curp: s.CURP_T,
            fecha: s.fecha,
            contraseña: s.contraseña,
        }));
        res.json({ ok: true, supervisores });
    } catch (err) {
        console.error('Error al obtener supervisores:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.registrarTrabajador = async (req, res) => {
    const { curp, nombre, apellido, fecha_nacimiento, fecha_contratacion, contraseña, verificar_contraseña } = req.body;
    if (contraseña !== verificar_contraseña) {
        return res.json({ ok: false, mensaje: 'Las contraseñas no coinciden' });
    }
    try {
        await Trabajador.crearTrabajador(curp, nombre, apellido, fecha_nacimiento, fecha_contratacion, contraseña);
        res.json({ ok: true });
    } catch (err) {
        console.error('Error al registrar trabajador:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.accesoTrabajador = async (req, res) => {
    const { id, contraseña } = req.body;
    try {
        const results = await Trabajador.accesoTrabajador(id, contraseña);
        const mensaje = results[0][0].mensaje;
        if (mensaje === undefined) {
            const perfil = results[0][0];
            req.session.idTrabajador = perfil.ID_trabajador;
            req.session.curp = perfil.CURP_T;
            req.session.nombre = perfil.nombre;
            req.session.apellido = perfil.apellido;
            req.session.fecha_nacimiento = perfil.fecha_nac;
            req.session.fecha_contratacion = perfil.fecha_ing;
            req.session.contraseña = perfil.contraseña;
            req.session.tipo = "trabajador";
            return res.json({ ok: true, redirectTo: '/' });
        }
        return res.json({ ok: false, mensaje });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.json({ ok: false, mensaje: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ ok: true, mensaje: 'Se cerró sesión con éxito' });
    });
};

exports.eliminarTrabajador = async (req, res) => {
    const { id, contraseña } = req.body;
    if (!id) return res.json({ ok: false, mensaje: 'ID de usuario requerido' });

    try {
        const results = await Trabajador.obtenerTrabajador(id);
        const trabajador = results[0][0];
        if (!trabajador) return res.json({ ok: false, mensaje: 'Trabajador no encontrado' });

        if (req.session.contraseña !== contraseña) {
            return res.json({ ok: false, mensaje: 'Contraseña incorrecta' });
        }

        const eliminarRes = await Trabajador.eliminarTrabajador(id);
        const mensaje = eliminarRes[0][0].mensaje;
        if (mensaje !== "Trabajador eliminado.") {
            return res.json({ ok: false, mensaje });
        }

        res.json({ ok: true, redirectTo: '/' });
    } catch (err) {
        console.error('Error al eliminar trabajador:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.obtenerDatosTrabajador = async (req, res) => {
    const { idTrabajador, curp, nombre, apellido, fecha_nacimiento, fecha_contratacion } = req.session;
    if (!idTrabajador) return res.json({ ok: false, mensaje: 'No se encontró el ID del trabajador en la sesión' });

    try {
        const turnos = await Trabajador.obtenerTurnos(idTrabajador);
        const turnosR = turnos[0];
        const turnosFormateados = turnosR.map(turno => {
            const fechaLocalStr = new Date(turno.fecha).toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
            const fechaLocal = new Date(fechaLocalStr);
            const dia = fechaLocal.toLocaleDateString('es-MX', { weekday: 'long' });
            const fechaISO = fechaLocal.toISOString().split('T')[0];
            return { dia, fecha: fechaISO, rol: turno.nombre_rol };
        });
        res.json({
            ok: true,
            trabajador: { id: idTrabajador, curp, nombre, apellido, fecha_nacimiento, fecha_contratacion },
            turnos: turnosFormateados
        });
    } catch (err) {
        console.error('Error al obtener turnos:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.registrarOferta = async (req, res) => {
    const { folio, tipo, id_trab, contra } = req.body;
    if (!folio || !tipo || !id_trab || !contra) {
        return res.json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }
    try {
        await Trabajador.registrarOferta(folio, tipo, id_trab, contra);
        res.json({ ok: true, mensaje: 'Oferta registrada correctamente' });
    } catch (err) {
        console.error('Error al registrar oferta:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.obtenerSalaDelDia = async (req, res) => {
    const { idTrabajador } = req.session;
    if (!idTrabajador) return res.json({ ok: false, mensaje: 'No se encontró el ID del trabajador en la sesión' });
    try {
        const results = await Trabajador.obtenerSalaDelDia(idTrabajador);
        const sala = results[0][0];
        if (!sala) return res.json({ ok: false, mensaje: 'El trabajador no tiene encargado sala hoy' });
        res.json({ ok: true, sala });
    } catch (err) {
        console.error('Error al obtener sala del día:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.obtenerFuncionesDeLaSala = async (req, res) => {
    const { sala } = req.params;
    if (!sala) return res.json({ ok: false, mensaje: 'ID de sala requerido' });
    try {
        const results = await Trabajador.obtenerFuncionesDeLaSala(sala);
        const funciones = results[0].map(funcion => ({
            id: funcion.ID_funcion,
            fecha: funcion.fecha,
            hora: funcion.hora,
            pelicula: funcion.titulo,
            sala: funcion.Num_sala,
            tipo: funcion.tipo_sala,
            precio: funcion.precio,
            ancho: funcion.ancho_grid,
            alto: funcion.alto_grid,
        }));
        res.json({ ok: true, funciones });
    } catch (err) {
        console.error('Error al obtener funciones de la sala:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.obtenerSala = async (req, res) => {
    const sala = req.params.sala;
    if (!sala) return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
    try {
        const results = await Trabajador.traerSala(sala);
        const resp = results[0][0];
        const info = {
            Num_sala: resp.Num_sala,
            tipo: resp.tipo_sala,
            precio: resp.precio,
            ancho: resp.ancho_grid,
            alto: resp.alto_grid,
        };
        res.json({ ok: true, info, sala: results[0] });
    } catch (err) {
        console.error('Error al traer sala:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};

exports.obtenerAsientosDisponibles = async (req, res) => {
    const funcion = req.params.funcion;
    if (!funcion) return res.status(400).json({ ok: false, mensaje: 'ID de función no proporcionado.' });
    try {
        const results = await Trabajador.traerAsientos(funcion);
        res.json({ ok: true, asientos: results[0] });
    } catch (err) {
        console.error('Error al traer asientos:', err);
        res.json({ ok: false, mensaje: err.message });
    }
};
