const db = require('../config/db');

const Compra = {

    traerSala: async (id) => {
        const [rows] = await db.query('CALL traerSala(?)', [id]);
        return rows;
    },
    
    traerAsientos: async (id) => {
        const [rows] = await db.query('CALL asientosdisponibles(?)', [id]);
        return rows;
    },

    traerCodigoDescuento: async (id) => {
        const [rows] = await db.query('CALL infoOferta(?)', [id]);
        return rows;
    },

    comprarBoleto: async (titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora) => {
        const [rows] = await db.query('CALL boletoG(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento,
            subtotal, iva, total, oferta, metodoPago, tipoCompra,
            idVenta, fecha, hora
        ]);
        return rows;
    },

    crearVenta: async (idCliente) => {
        const [rows] = await db.query('CALL nueva_venta(?)', [idCliente]);
        return rows;
    },

    checarUsuario: async (correo) => {
        const [rows] = await db.query('CALL infoCliente(?)', [correo]);
        return rows;
    }
};

module.exports = Compra;
