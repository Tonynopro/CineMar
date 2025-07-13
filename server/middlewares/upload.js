const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Convertir a camelCase y quitar acentos
function aCamelCase(texto) {
  return texto
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(' ')
    .map((p, i) => i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

// Diccionario solo para trailers
const mimeToExt = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogg'
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const permitidos = {
    'archivo': ['image/jpeg', 'image/png', 'image/jpg'],
    'poster': ['image/jpeg', 'image/png', 'image/jpg'],
    'trailer': ['video/mp4', 'video/webm', 'video/ogg']
  };

  const tiposValidos = permitidos[file.fieldname] || [];
  if (tiposValidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo no permitido para ${file.fieldname}: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// 🎬 Póster en .webp
async function procesarPoster(buffer, titulo) {
  const nombre = aCamelCase(titulo);
  const nombreArchivo = `${nombre}_poster.webp`;

  const outputDir = path.join(__dirname, '../../public/images/peliculas');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, nombreArchivo);

  await sharp(buffer)
    .resize(500)
    .toFormat('webp')
    .toFile(outputPath);

  return nombreArchivo;
}

// 🧑 Imagen actor en .webp
async function guardarImagenActor(buffer, nombre, mimetype) {
  const nombreLimpio = aCamelCase(nombre);
  const nombreArchivo = `${nombreLimpio}.webp`;

  const outputDir = path.join(__dirname, '../../public/images/actores');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, nombreArchivo);

  await sharp(buffer)
    .resize(300)
    .toFormat('webp')
    .toFile(outputPath);

  return nombreArchivo;
}

// 🎥 Trailer (sin conversión de formato)
async function guardarTrailer(buffer, nombre, mimetype) {
  const nombreLimpio = aCamelCase(nombre);
  const ext = mimeToExt[mimetype] || '.mp4';
  const nombreArchivo = `${nombreLimpio}_trailer${ext}`;

  const outputDir = path.join(__dirname, '../../public/videos/trailers');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, nombreArchivo);

  fs.writeFileSync(outputPath, buffer);

  return nombreArchivo;
}

module.exports = {
  upload,
  procesarPoster,
  guardarImagenActor,
  guardarTrailer
};
