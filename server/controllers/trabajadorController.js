const path = require('path');
const Trabajador = require('../models/trabajadorModel');
const e = require('express');

exports.mostrarFormularioRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/registrar-trabajador.html'));
};

exports.mostrarFormularioAcceso = (req, res) => {

    if (req.session.tipo === "trabajador") {
        return res.redirect('/trabajador/index');
    } else {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            }
            res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
        });
        res.sendFile(path.join(__dirname, '../../public/views/iniciar-sesion-trabajador.html'));
    }
}

exports.mostrarFormularioEliminacion = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/eliminar-trabajador.html'));
}

exports.mostrarPaginaPrincipal = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index-trabajador.html'));
}

exports.mostrarFormularioOferta = (req, res) => {
    if (!req.session.idTrabajador) {
        res.redirect('/trabajador/iniciar-sesion');
    }

    Trabajador.obtenerRolActual(req.session.idTrabajador, (err, results) => {
        if (err) {
            console.error('Error al obtener rol actual:', err.stack);
            res.redirect('/trabajador/iniciar-sesion');
        }
        const roles = results[0];
        const tieneRolSala = roles.some(rol => rol.nombre_rol === 'supervisor');

        if (!tieneRolSala) {
            return res.redirect('/trabajador/');
        }
        else {
            res.sendFile(path.join(__dirname, '../../public/views/registrar-cupon.html'));
        }
    });

}

exports.mostrarInfoSala = (req, res) => {
    if (!req.session.idTrabajador) {
        res.redirect('/trabajador/iniciar-sesion');
    }

    Trabajador.obtenerRolActual(req.session.idTrabajador, (err, results) => {
        if (err) {
            console.error('Error al obtener rol actual:', err.stack);
            res.redirect('/trabajador/iniciar-sesion');
        }
        const roles = results[0];
        const tieneRolSala = roles.some(rol => rol.nombre_rol === 'sala');

        if (!tieneRolSala) {
            return res.redirect('/trabajador/');
        }
        else {
            res.sendFile(path.join(__dirname, '../../public/views/vista-sala.html'))
        }
    });
}

exports.mostrarFunciones = (req, res) => {
    if (!req.session.idTrabajador) {
        res.redirect('/trabajador/iniciar-sesion');
    }
    Trabajador.obtenerRolActual(req.session.idTrabajador, (err, results) => {
        if (err) {
            console.error('Error al obtener rol actual:', err.stack);
            res.redirect('/trabajador/iniciar-sesion');
        }
        const roles = results[0];
        const tieneRolTaquilla = roles.some(rol => rol.nombre_rol === 'taquilla');

        if (!tieneRolTaquilla) {
            return res.redirect('/trabajador/');
        }
        else {
            res.sendFile(path.join(__dirname, '../../public/views/cartelera.html'));
        }
    });
}

exports.mostrarHorariosPelicula = (req, res) => {
    if (!req.session.idTrabajador) {
        res.redirect('/trabajador/iniciar-sesion');
    }
    Trabajador.obtenerRolActual(req.session.idTrabajador, (err, results) => {
        if (err) {
            console.error('Error al obtener rol actual:', err.stack);
            res.redirect('/trabajador/iniciar-sesion');
        }
        const roles = results[0];
        const tieneRolTaquilla = roles.some(rol => rol.nombre_rol === 'taquilla');

        if (!tieneRolTaquilla) {
            return res.redirect('/trabajador/');
        }
        else {
            res.sendFile(path.join(__dirname, '../../public/views/horarios-taquilla.html'));
        }
    });
};

exports.obtenerSupervisores = (req, res) => {
    Trabajador.obtenerSupervisores((err, results) => {
        if (err) {
            console.error('Error al obtener supervisores:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }
        const supervisores = results[0].map(supervisor => {
            return {
                id: supervisor.ID_trabajador,
                nombre: supervisor.nombre,
                apellido: supervisor.apellido,
                curp: supervisor.CURP_T,
                fecha: supervisor.fecha,
                contraseña: supervisor.contraseña
            };
        });
        return res.json({ ok: true, supervisores });
    });
};

exports.registrarTrabajador = (req, res) => {
    const { curp, nombre, apellido, fecha_nacimiento, fecha_contratacion, contraseña, verificar_contraseña } = req.body;

    if (contraseña !== verificar_contraseña) {
        return res.json({ ok: false, mensaje: 'Las contraseñas no coinciden' });
    }

    Trabajador.crearTrabajador(curp, nombre, apellido, fecha_nacimiento, fecha_contratacion, contraseña, (err, results) => {
        if (err) {
            console.error('Error al registrar trabajador:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }
        return res.json({ ok: true });
    });

};

exports.accesoTrabajador = (req, res) => {
    const { id, contraseña } = req.body;

    Trabajador.accesoTrabajador(id, contraseña, (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        const mensaje = results[0][0].mensaje;
        if (mensaje === undefined) {
            let perfil = results[0][0];
            req.session.idTrabajador = perfil.ID_trabajador;
            req.session.curp = perfil.CURP_T;
            req.session.nombre = perfil.nombre;
            req.session.apellido = perfil.apellido;
            req.session.fecha_nacimiento = perfil.fecha_nac;
            req.session.fecha_contratacion = perfil.fecha_ing;
            req.session.contraseña = perfil.contraseña;
            req.session.tipo = "trabajador";
            return res.json({ ok: true, redirectTo: '/' });
        } else {
            return res.json({ ok: false, mensaje });
        }
    });
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.json({ ok: false, mensaje: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
        return res.json({ ok: true, mensaje: 'Se cerro sesion con exito' });
    });
};

exports.eliminarTrabajador = (req, res) => {
    const { id, contraseña } = req.body;

    if (!id) {
        return res.json({ ok: false, mensaje: 'ID de usuario requerido' });
    }

    Trabajador.obtenerTrabajador(id, (err, results) => {
        if (err) {
            console.error('Error al obtener trabajador:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        const trabajador = results[0][0];
        if (!trabajador) {
            return res.json({ ok: false, mensaje: 'Trabajador no encontrado' });
        }
        console.log(req.session.contraseña);
        if (req.session.contraseña !== contraseña) {
            return res.json({ ok: false, mensaje: 'Contraseña incorrecta' });
        } else {

            Trabajador.eliminarTrabajador(id, (err, results) => {

                if (err) {
                    console.error('Error al eliminar trabajador:', err.stack);
                    return res.json({ ok: false, mensaje: 'Error al eliminar trabajador' });
                }

                let mensaje = results[0][0].mensaje;

                if (mensaje != "Trabajador eliminado.") {
                    return res.json({ ok: false, mensaje });
                } else {

                    return res.json({ ok: true, redirectTo: '/' });
                }

            });
        }
    });
};

exports.obtenerDatosTrabajador = (req, res) => {

    let { idTrabajador, curp, nombre, apellido, fecha_nacimiento, fecha_contratacion, tipo } = req.session;

    if (!idTrabajador) {
        return res.json({ ok: false, mensaje: 'No se encontró el ID del trabajador en la sesión' });
    }

    Trabajador.obtenerTurnos(idTrabajador, (err, turnos) => {
        if (err) {
            console.error('Error al obtener turnos:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }
        let turnosR = turnos[0];
        const turnosFormateados = turnosR.map(turno => {
            const fechaLocalStr = new Date(turno.fecha).toLocaleString('en-US', {
                timeZone: 'America/Mexico_City'
            });
            const fechaLocal = new Date(fechaLocalStr);

            const dia = fechaLocal.toLocaleDateString('es-MX', {
                weekday: 'long'
            });
            const fechaISO = fechaLocal.toISOString().split('T')[0];

            return {
                dia,
                fecha: fechaISO,
                rol: turno.nombre_rol
            };
        });
        console.log(turnosFormateados);
        return res.json({
            ok: true,
            trabajador: {
                id: idTrabajador,
                curp: curp,
                nombre: nombre,
                apellido: apellido,
                fecha_nacimiento: fecha_nacimiento,
                fecha_contratacion: fecha_contratacion
            },
            turnos: turnosFormateados
        });
    });
};

exports.registrarOferta = (req, res) => {
    const { folio, tipo, id_trab, contra } = req.body;

    if (!folio || !tipo || !id_trab || !contra) {
        return res.json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }

    Trabajador.registrarOferta(folio, tipo, id_trab, contra, (err, results) => {
        if (err) {
            console.error('Error al registrar oferta:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, mensaje: 'Oferta registrada correctamente' });
    });
}

exports.obtenerSalaDelDia = (req, res) => {
    const { idTrabajador } = req.session;

    if (!idTrabajador) {
        return res.json({ ok: false, mensaje: 'No se encontró el ID del trabajador en la sesión' });
    }

    Trabajador.obtenerSalaDelDia(idTrabajador, (err, results) => {
        if (err) {
            console.error('Error al obtener sala del día:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        const sala = results[0][0];
        if (!sala) {
            return res.json({ ok: false, mensaje: 'El trabajador no tiene encargado sala hoy' });
        }

        return res.json({ ok: true, sala });
    });
}

exports.obtenerFuncionesDeLaSala = (req, res) => {
    const { sala } = req.params;

    if (!sala) {
        return res.json({ ok: false, mensaje: 'ID de sala requerido' });
    }

    Trabajador.obtenerFuncionesDeLaSala(sala, (err, results) => {
        if (err) {
            console.error('Error al obtener funciones de la sala:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        const funciones = results[0].map(funcion => {
            return {
                id: funcion.ID_funcion,
                fecha: funcion.fecha,
                hora: funcion.hora,
                pelicula: funcion.titulo,
                sala: funcion.Num_sala,
                tipo: funcion.tipo_sala,
                precio: funcion.precio,
                ancho: funcion.ancho_grid,
                alto: funcion.alto_grid,
            };
        });

        return res.json({ ok: true, funciones });
    });
}

exports.obtenerSala = (req, res) => {
    const sala = req.params.sala;

    if (!sala) {
        return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
    }

    Trabajador.traerSala(sala, (err, results) => {
        if (err) {
            console.error('Error al traer sala:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        const resp = results[0][0];

        const info = {
            Num_sala: resp.Num_sala,
            tipo: resp.tipo_sala,
            precio: resp.precio,
            ancho: resp.ancho_grid,
            alto: resp.alto_grid,
        }

        return res.json({ ok: true, info, sala: results[0] });
    });
}

exports.obtenerAsientosDisponibles = (req, res) => {
    const funcion = req.params.funcion;

    if (!funcion) {
        return res.status(400).json({ ok: false, mensaje: 'ID de función no proporcionado.' });
    }

    Trabajador.traerAsientos(funcion, (err, results) => {
        if (err) {
            console.error('Error al traer asientos:', err.stack);
            return res.json({ ok: false, mensaje: err.message });
        }

        return res.json({ ok: true, asientos: results[0] });
    });
}



