const path = require('path');
const User = require('../models/userModel');
const { Console } = require('console');

exports.mostrarMenuIngreso = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/menu-usuario.html'));
};

exports.mostrarFormularioRegistro = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/registrar.html'));
};

exports.mostrarFormularioAcceso = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
    });
    res.sendFile(path.join(__dirname, '../../public/views/iniciar-sesion.html'));
}

exports.mostrarPaginaEliminar = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/borrar-cliente.html'));
}

exports.mostrarBoletos = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/boletos.html'));
}

exports.mostrarPerfilUsuario = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/info-cliente.html'));
}

exports.registrarUsuario = (req, res) => {
    const { nombre, apellido, fecha_nacimiento, correo, contraseña, verificar_contraseña } = req.body;

    if (contraseña !== verificar_contraseña) {
        return res.json({ ok: false, mensaje: 'Las contraseñas no coinciden' });
    }

    User.verificarCorreo(correo, (err, results) => {
        if (err) {
            console.error('Error al verificar correo:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al verificar correo' });
        }

        const mensaje = results[0][0].mensaje;
        if (mensaje === 'El cliente ya está registrado.') {
            return res.json({ ok: false, mensaje });
        }

        User.crearUsuario(nombre, apellido, fecha_nacimiento, correo, contraseña, (err, results) => {
            if (err) {
                console.error('Error al registrar usuario:', err.stack);
                return res.json({ ok: false, mensaje: 'Error al registrar usuario' });
            }

            let perfil = results[0][0];
            req.session.idCliente = perfil.ID_cliente;
            req.session.nombre = perfil.nombre;
            req.session.apellido = perfil.apellido;
            req.session.fecha_nacimiento = perfil.fecha_nac;
            req.session.correo = perfil.correo;
            req.session.nivel = perfil.nivel;
            req.session.contraseña = perfil.contraseña;
            req.session.tipo = "cliente";

            return res.json({ ok: true });
        });
    });
};

exports.accesoUsuario = (req, res) => {
    const { correo, contraseña } = req.body;
    
    if (!correo || !contraseña) {
        return res.json({ ok: false, mensaje: 'Correo y contraseña son requeridos' });
    }

    User.accesoUsuario(correo, contraseña, (err, results) => {
        if (err) {
            console.error('Error al acceder:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al acceder' });
        }

        const mensaje = results[0][0].mensaje;
        console.log(results[0][0]);
        if (mensaje === undefined) {
            let perfil = results[0][0];
            req.session.idCliente = perfil.ID_cliente;
            req.session.nombre = perfil.nombre;
            req.session.apellido = perfil.apellido;
            req.session.fecha_nacimiento = perfil.fecha_nac;
            req.session.correo = perfil.correo;
            req.session.nivel = perfil.nivel;
            req.session.contraseña = perfil.contraseña;
            req.session.tipo = "cliente";
            return res.json({ ok: true, redirectTo: '/' });
        } else {
            return res.json({ ok: false, mensaje });
        }
    });
};

exports.eliminarUsuario = (req, res) => {
    const { contraseña } = req.body;
    let id = req.session.idCliente;
    if (!id) {
        return res.json({ ok: false, mensaje: 'ID de usuario requerido' });
    }

    if(contraseña !== req.session.contraseña) {
        return res.json({ ok: false, mensaje: 'Contraseña incorrecta' });
    }

    User.eliminarUsuario(id, (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al eliminar usuario' });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.json({ ok: false, mensaje: 'Usuario eliminado, pero no se pudo cerrar la sesión' });
            }

            return res.json({ ok: true, mensaje: 'Usuario eliminado y sesión cerrada' });
        });

    });
};

exports.mostrarInfoUsuario = (req, res) => {
    let id = req.session.idCliente;
    if (!id) {
        return res.json({ ok: false, mensaje: 'No hay usuario en sesion' });
    }

    const response = {
        id: req.session.idCliente,
        nombre: req.session.nombre,
        apellido: req.session.apellido,
        fecha_nacimiento: req.session.fecha_nacimiento,
        correo: req.session.correo,
        nivel: req.session.nivel,
        tipo: req.session.tipo
    };
    return res.json({ ok: true, data: response });
}

exports.traerBoletosComprados = (req, res) => {
    let id = req.session.idCliente;
    if (!id) {
        return res.json({ ok: false, mensaje: 'No hay usuario en sesion' });
    }

    User.traerBoletosComprados(id, (err, results) => {
        if (err) {
            console.error('Error al obtener boletos:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al obtener boletos' });
        }

        return res.json({ ok: true, boletos: results[0] });
    });
}

exports.traerVentasYBoletos = (req, res) => {
    let id = req.session.idCliente;
    if (!id) {
        return res.json({ ok: false, mensaje: 'No hay usuario en sesion' });
    }

    User.traerVentasYBoletos(id, (err, results) => {
        if (err) {
            console.error('Error al obtener ventas y boletos:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al obtener ventas y boletos' });
        }

        return res.json({ ok: true, ventas_y_boletos: results[0] });
    });
}

exports.traerTotalVenta = (req, res) => {
    let id = req.session.idCliente;
    if (!id) {
        return res.json({ ok: false, mensaje: 'No hay usuario en sesion' });
    }

    const { id_venta } = req.query;
    if (!id_venta) {
        return res.json({ ok: false, mensaje: 'ID de venta requerido' });
    }

    User.traerTotalVenta(id_venta, (err, results) => {
        if (err) {
            console.error('Error al obtener total de venta:', err.stack);
            return res.json({ ok: false, mensaje: 'Error al obtener total de venta' });
        }

        return res.json({ ok: true, total_venta: results[0] });
    });
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.redirect('/cliente/menu');
        }
        res.redirect('/');
    });
}

