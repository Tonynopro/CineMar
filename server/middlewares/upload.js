const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // Asegúrate de instalarlo: npm install sharp

// Convierte texto a camelCase sin acentos
function aCamelCase(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(' ')
    .map((palabra, i) => i === 0 ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join('');
}

// Diccionario para obtener extensión si no existe
const mimeToExt = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/jpg': '.jpg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let carpeta = 'uploads';

    if (file.fieldname === 'archivo' && req.body.tipo === 'actor') carpeta = 'images/actores';
    else if (file.fieldname === 'poster') carpeta = 'images/peliculas';
    else if (file.fieldname === 'trailer') carpeta = 'videos/trailers';

    const rutaCompleta = path.join(__dirname, '../../public', carpeta);
    fs.mkdirSync(rutaCompleta, { recursive: true });
    cb(null, rutaCompleta);
  },

  filename: async (req, file, cb) => {
    try {
      const baseNombre = req.body.titulo || req.body.nombre || 'archivo';
      const nombreCamel = aCamelCase(baseNombre);

      // Obtener extensión
      let ext = path.extname(file.originalname).toLowerCase();
      if (!ext) {
        ext = mimeToExt[file.mimetype] || '';
      }

      const filename = `${nombreCamel}_${file.fieldname}${ext}`;
      cb(null, filename);

      // Generar .webp si es el poster
      if (file.fieldname === 'poster') {
        // Esperar a que el archivo se guarde en disco
        const originalPath = path.join(__dirname, '../../public/images/peliculas', filename);
        const webpPath = path.join(__dirname, '../../public/images/peliculas', `${nombreCamel}_poster.webp`);

        // Esperar un poco y luego procesar con sharp
        setTimeout(() => {
          sharp(originalPath)
            .resize(500) // Tamaño estándar, puedes cambiarlo o quitarlo
            .toFormat('webp')
            .toFile(webpPath)
            .then(() => console.log(`Imagen .webp creada: ${webpPath}`))
            .catch(err => console.error('Error al generar .webp:', err));
        }, 500); // Esperamos 500ms para asegurar que el archivo original exista
      }
    } catch (err) {
      cb(err);
    }
  }
});

// Filtro de tipos MIME permitidos
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
    cb(new Error(`Tipo de archivo no permitido para ${file.fieldname}: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB máximo
});

module.exports = upload;
