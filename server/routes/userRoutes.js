const express = require('express');
const router = express.Router();
const { esCliente } = require('../middlewares/verificarRol');
const userController = require('../controllers/userController');

// Ruta para mostrar el menu de ingreso
router.get('/menu', userController.mostrarMenuIngreso);

// Ruta para mostrar la pagina con el perfil de usuario
router.get('/perfil', esCliente, userController.mostrarPerfilUsuario);

// Ruta para mostrar formulario de registro
router.get('/registro_cliente', userController.mostrarFormularioRegistro);

// Ruta para mostrar formulario de acceso
router.get('/iniciar-sesion', userController.mostrarFormularioAcceso);

// Ruta para mostrar pantalla de borrado
router.get('/eliminar', userController.mostrarPaginaEliminar);

// Ruta para traer información del usuario
router.get('/info_usuario', userController.mostrarInfoUsuario);

// Ruta para mostrar la pagina de boletos comprados
router.get('/boletos', esCliente, userController.mostrarBoletos);

// Ruta para traer boletos comprados
router.get('/boletos_comprados', userController.traerBoletosComprados);

// Ruta para traer ventas y boletos
router.get('/ventas_y_boletos', userController.traerVentasYBoletos);

// Ruta para traer el total de una venta
router.get('/total_venta/', userController.traerTotalVenta);

//Ruta para cerrar sesion
router.get('/salir', userController.cerrarSesion);

// Ruta para registrar usuario
router.post('/registrar_usuario', userController.registrarUsuario);

//Ruta para el acceso al usuario
router.post('/acceso_usuario', userController.accesoUsuario);

//Ruta para la eliminacion del usuario
router.post('/eliminar_usuario', userController.eliminarUsuario);


module.exports = router;