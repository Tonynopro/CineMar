const express = require('express');
const path = require('path');
const session = require('express-session');
const os = require('os');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const port = process.env.PORT;

// Función mejorada para detectar IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        addresses.push(alias.address);
      }
    }
  }

  console.log('Direcciones IP detectadas:', addresses);

  // Preferimos IPs privadas (192.x, 10.x, 172.x)
  const preferida = addresses.find(ip =>
    ip.startsWith('192.') || ip.startsWith('10.') || ip.startsWith('172.')
  );

  return preferida || 'localhost';
}

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

// Iniciar servidor
const localIP = getLocalIP();
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor listo`);
});
