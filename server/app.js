const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const port = process.env.PORT;

// Middleware para limpiar la compra
const { limpiarInfoCompraEnGet } = require('./middlewares/limpiarCompra');

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Middlewares de body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware propio
app.use(limpiarInfoCompraEnGet);

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/cliente/', userRoutes);

const trabajadorRoutes = require('./routes/trabajadorRoutes');
app.use('/trabajador/', trabajadorRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin/', adminRoutes);

const infoRoutes = require('./routes/infoRoutes');
app.use('/', infoRoutes);

const compraRoutes = require('./routes/compraRoutes');
app.use('/compra', compraRoutes);

const trabajadorCompraRoutes = require('./routes/trabajadorCompraRoutes');
app.use('/trabajador/compra', trabajadorCompraRoutes);


// Redirección inicial
app.get('/', (req, res) => {
  switch (req.session.tipo) {
    case 'trabajador':
      return res.redirect('/trabajador/');
    case 'admin':
      return res.redirect('/admin/');
    case 'cliente':
      break;
    default:
      req.session.tipo = "default";
      break;
  }
  return res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/no-autorizado', (req, res) => {
  return res.sendFile(path.join(__dirname, '../public/views/acceso-denegado.html'));
});


// Perfil
app.get('/perfil', (req, res) => {
  console.log(req.session);
  if (!req.session.tipo) {
    return res.json({ ok: false });
  }
  return res.json({ ok: true, nombre: req.session });
});

// Middleware 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../public/views/404.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log("Sevidor activo");
});
