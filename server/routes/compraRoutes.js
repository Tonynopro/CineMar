const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// Ruta para guardar la función seleccionada
router.post('/seleccionar-funcion', compraController.guardarFuncionSeleccionada);

// Ruta para mostrar la página de selección de asientos
router.get('/seleccionar-asientos',compraController.mostrarSeleccionarAsientos);

// Ruta para guardar los asientos seleccionados
router.post('/seleccionar-asientos', compraController.guardarAsientosSeleccionados);

// Ruta para mostrar la página del método de pago
router.get('/metodo-de-pago', compraController.mostrarMetodoPago);

// Ruta para procesar el pago
router.post('/procesar-pago', compraController.procesarPago);

// Ruta para traer sala y asientos
router.get('/traerSala', compraController.traerSala);

// Ruta para traer los asientos disponibles
router.get('/traerAsientos', compraController.traerAsientos);

// Ruta para traer el codigo de descuento
router.get('/traerCodigoDescuento/:id', compraController.traerCodigosDescuento);

// Ruta para crear una nueva venta
router.post('/crearVenta', compraController.crearVenta);

// Ruta para comprar el boleto
router.post('/comprarBoleto', compraController.comprarBoleto);

// Ruta para obtener los datos de compra
router.get('/datosCompra', compraController.datosCompra);

// Ruta para pagar con Stripe
router.post('/pagarStripe', compraController.pagarConStripe);

module.exports = router;