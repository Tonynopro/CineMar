function esCliente(req, res, next) {
  if (req.session.tipo === 'cliente') {
    return next();
  } else {
    res.redirect('/');
  }
}

function esTrabajador(req, res, next) {
  if (req.session.tipo === 'trabajador') {
    return next();
  } else {
    res.redirect('/trabajador/');
  }
}

function esAdmin(req, res, next) {
  console.log("verificando admin");
  console.log(req.session.tipo);
  if (req.session.tipo === 'admin') {
    return next();
  } else {
    res.redirect('/no-autorizado');
  }
}

module.exports = { esTrabajador, esAdmin, esCliente };
