export const contieneNumeros = (str) => /\d/.test(str);

export const soloNumeros = (str) => /^[0-9]+$/.test(str);

export const validarFechaNacimiento = (fecha) => {
  const fechaLimite = new Date('1900-01-01');
  const hoy = new Date();
  const fechaMaxima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
  return new Date(fecha) >= fechaLimite && new Date(fecha) <= fechaMaxima;
};

export const validarFechaContratacion = (fecha) => {
  const fechaMinima = new Date('2025-02-10');

  const fechaMaxima = new Date();
  fechaMaxima.setDate(fechaMaxima.getDate() + 5);

  const fechaIngresada = new Date(fecha);
  return fechaIngresada >= fechaMinima && fechaIngresada <= fechaMaxima;
};

export const validarFechaTurno = (fecha) => {
  const fechaMinima = new Date('2025-02-10');
  const fechaMaxima = new Date('2025-12-31');
  return new Date(fecha) >= fechaMinima && new Date(fecha) <= fechaMaxima;
};

export const validarFechaFuncion = (fecha) => {
  const hoy = new Date();
  
  // Establecemos la fecha mínima a las 00:00:00 en UTC
  const fechaMinima = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

  // Establecemos la fecha máxima a 5 días después a las 23:59:59.999 en UTC
  const fechaMaxima = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 5, 23, 59, 59, 999));

  // Parseamos la fecha de entrada a un objeto Date
  const fechaInput = new Date(fecha);

  // Comprobamos que la fecha de entrada esté dentro del rango
  return fechaInput >= fechaMinima && fechaInput <= fechaMaxima;
};


export const validarCorreo = (correo) => {
  const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexCorreo.test(correo);
};

export const validarContraseña = (contraseña) => {
  const regexContraseña = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  return regexContraseña.test(contraseña);
};

export const validarCURP = (curp) => {
  const regexCURP = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/;

  if (!regexCURP.test(curp.toUpperCase())) {
    return false;
  }

  const caracteres = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const curp17 = curp.slice(0, 17).toUpperCase();
  const digitoVerificador = curp.slice(17);
  
  let suma = 0;
  for (let i = 0; i < 17; i++) {
    const valor = caracteres.indexOf(curp17[i]);
    suma += valor * (18 - i);
  }

  const digitoCalculado = (10 - (suma % 10)) % 10;

  return digitoVerificador === digitoCalculado.toString();
};

export const validarHoraFuncion = (hora) => {
  const [horaNum, min] = hora.split(':').map(Number);

  const horaMinima = 10; // 10:00 AM
  const horaMaxima = 22; // 10:00 PM

  return horaNum >= horaMinima && horaNum <= horaMaxima;
};
