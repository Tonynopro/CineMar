const limpiarInfoCompraEnGet = (req, res, next) => {
    const rutasEstaticas = [
        '/compra/seleccionar-funcion',
        '/compra/seleccionar-asientos',
        '/compra/metodo-de-pago',
        '/compra/traerSala',
        '/compra/traerAsientos',
        '/compra/comprarBoleto',
        '/compra/datosCompra',
        '/cliente/info_usuario',
        '/trabajador/compra/seleccionar-funcion',
        '/trabajador/compra/seleccionar-asientos',
        '/trabajador/compra/metodo-de-pago',
        '/trabajador/compra/traerSala',
        '/trabajador/compra/traerAsientos',
        '/trabajador/compra/comprarBoleto',
        '/trabajador/compra/datosCompra'
    ];

    const rutasDinamicas = [
        /^\/compra\/traerCodigoDescuento\/[^/]+$/,
        /^\/trabajador\/compra\/traerCodigoDescuento\/[^/]+$/,
        /^\/trabajador\/compra\/checarUsuario\/[^/]+$/
    ];

    if (req.method === 'GET') {
        const esRutaEstatica = rutasEstaticas.includes(req.path);
        const esRutaDinamica = rutasDinamicas.some(regex => regex.test(req.path));

        if (!esRutaEstatica && !esRutaDinamica && req.session.compra) {
            console.log('Eliminando información de compra al navegar fuera del flujo:', req.path);
            delete req.session.compra;
        }
    }

    next();
};
module.exports = { limpiarInfoCompraEnGet };