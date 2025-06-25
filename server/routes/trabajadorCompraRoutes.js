const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const trabajadorCompraController = require('../controllers/trabajadorCompraController');
const { esTrabajador } = require('../middlewares/verificarRol');

// Ruta para guardar la función seleccionada
router.post('/seleccionar-funcion', esTrabajador, compraController.guardarFuncionSeleccionada);

// Ruta para mostrar la página de selección de asientos
router.get('/seleccionar-asientos', esTrabajador, trabajadorCompraController.mostrarSeleccionarAsientos);

// Ruta para guardar los asientos seleccionados
router.post('/seleccionar-asientos', esTrabajador, compraController.guardarAsientosSeleccionados);

// Ruta para mostrar la página del método de pago
router.get('/metodo-de-pago', esTrabajador, trabajadorCompraController.mostrarMetodoPago);

// Ruta para procesar el pago
router.post('/procesar-pago', esTrabajador, compraController.procesarPago);

// Ruta para traer sala y asientos
router.get('/traerSala', esTrabajador, compraController.traerSala);

// Ruta para traer los asientos disponibles
router.get('/traerAsientos', esTrabajador, compraController.traerAsientos);

// Ruta para traer el codigo de descuento
router.get('/traerCodigoDescuento/:id', esTrabajador, compraController.traerCodigosDescuento);

// Ruta para comprar el boleto
router.post('/comprarBoleto', esTrabajador, compraController.comprarBoleto);

// Ruta para obtener los datos de compra
router.get('/datosCompra', esTrabajador, compraController.datosCompra);

// Ruta para checar si el usuario existe
router.get('/checarUsuario/:id', esTrabajador, trabajadorCompraController.checarUsuario);

module.exports = router;