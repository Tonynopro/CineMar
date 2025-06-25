const db = require('../config/db');

const Compra = {

    traerSala: (id, callback) => {
        db.query('CALL traerSala(?)', [id], callback);
    },
    
    traerAsientos: (id, callback) => {
        db.query('CALL asientosdisponibles(?)', [id], callback);
    },

    traerCodigoDescuento: (id, callback) => {
        db.query('CALL infoOferta(?)', [id], callback);
    },

    comprarBoleto: (titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora, callback) => {
        db.query('CALL boletoG(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora], callback);
    },

    crearVenta: (idCliente, callback) => {
        db.query('CALL nueva_venta(?)', [idCliente], callback);
    },

    checarUsuario: (correo, callback) => {
        db.query('CALL infoCliente(?)', [correo], callback);
    }
};

module.exports = Compra;