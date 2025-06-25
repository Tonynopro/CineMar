const express = require('express');
const router = express.Router();
const { esAdmin } = require('../middlewares/verificarRol');
const adminController = require('../controllers/adminController');

// Ruta para mostrar el panel de administración
router.get('/index', esAdmin, adminController.mostrarPanelAdmin);

// Ruta para mostrar formulario de acceso
router.get('/iniciar-sesion', adminController.mostrarFormularioAcceso);
router.get('/', adminController.mostrarFormularioAcceso);

// Ruta para mostrar formulario de asignacion de rol
router.get('/asignar-trabajador', esAdmin, adminController.mostrarFormularioAsignarTrabajadores);

// Ruta para mostrar formulario de asignacion de funciones
router.get('/asignar-funcion', esAdmin, adminController.mostrarFormularioAsignarFunciones);

// Ruta para salir de admin
router.get('/salir', esAdmin, adminController.salirAdmin);

//Ruta para el acceso al admin
router.post('/acceso', adminController.accesoAdmin);

//Ruta asignar rol a trabajador
router.post('/asignar', esAdmin ,adminController.asignarRol);

// Ruta para asignar sala a trabajador
router.post('/asignar/sala', esAdmin, adminController.asignarSala);

// Ruta para registrar funcion
router.post('/registrar-funcion', esAdmin, adminController.registrarFuncion);

// Ruta para traer todos los trabajadores
router.get('/trabajadores', esAdmin, adminController.traerTodosTrabajadores);

// Ruta para traer todos los roles
router.get('/roles', esAdmin, adminController.traerTodosRoles);

// Ruta para traer todas las salas
router.get('/salas', esAdmin, adminController.traerTodasSalas);

// Ruta para traer todas las peliculas
router.get('/peliculas', esAdmin, adminController.traerTodasPeliculas);


module.exports = router;