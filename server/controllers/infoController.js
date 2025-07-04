const path = require('path');
const Info = require('../models/infoModel');

exports.mostrarNuestraHistoria = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/Nuestra-historia.html'));
};

exports.mostrarPreguntasFrecuentes = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/preguntas-frecuentes.html'));
};

exports.mostrarTerminosUso = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/terminos.html'));
};

exports.mostrarPoliticasPrivacidad = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/politica-privacidad.html'));
};

exports.mostrarEncuentraTuCine = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/creditos.html'));
};

exports.mostrarInformacionPelicula = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/detalle.html'));
};

exports.mostrarHorariosPelicula = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/horarios.html'));
};

exports.mostrarPromociones = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/promociones.html'));
};

exports.traerInfoPelicula = async (req, res) => {
    const id = req.params.id;
    try {
        const results = await Info.obtenerInfo(id);
        const pelicula = results[0][0];
        if (!pelicula) {
            return res.status(404).json({ ok: false, mensaje: 'Película no encontrada.' });
        }
        // Obtener actores
        const actoresResults = await Info.obtenerActores(id);
        const actores = actoresResults[0];
        return res.json({ ok: true, pelicula, actores });
    } catch (err) {
        console.error('Error al obtener información de la película:', err);
        if (err.message === "Película no encontrada.") {
            return res.status(404).json({ ok: false, mensaje: err.message });
        }
        return res.status(500).json({ ok: false, mensaje: 'Error al obtener información de la película' });
    }
};

exports.traerFuncionesPelicula = async (req, res) => {
    const id = req.params.id;
    try {
        const results = await Info.obtenerFunciones(id);
        const funciones = results[0];
        const funcPr = funciones[0];
        let info = undefined;
        if (funcPr) {
            info = {
                id: funcPr.ID_pelicula,
                nombre: funcPr.titulo,
                clasificacion: funcPr.clasificacion,
                duracion: funcPr.duracion_min,
            };
        }
        return res.json({ ok: true, info, funciones });
    } catch (err) {
        console.error('Error al obtener funciones de la película:', err);
        if (err.message === "Pelicula no encontrada.") {
            return res.status(404).json({ ok: false, mensaje: err.message });
        }
        return res.status(500).json({ ok: false, mensaje: 'Error al obtener funciones de la película' });
    }
};

exports.traerAsientosFuncion = async (req, res) => {
    const id = req.params.id;
    try {
        const results = await Info.obtenerAsientos(id);
        const asientos = results[0];
        return res.json({ ok: true, asientos });
    } catch (err) {
        console.error('Error al obtener asientos de la función:', err);
        if (err.message === "Función no encontrada.") {
            return res.status(404).json({ ok: false, mensaje: err.message });
        }
        return res.status(500).json({ ok: false, mensaje: 'Error al obtener asientos de la función' });
    }
};

exports.traerPeliculas = async (req, res) => {
    try {
        const results = await Info.obtenerPeliculas();
        const peliculas = results[0];
        if (!peliculas || peliculas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron películas.' });
        }
        return res.json({ ok: true, peliculas });
    } catch (err) {
        console.error('Error al obtener películas:', err);
        return res.status(500).json({ ok: false, mensaje: err.message || 'Error al obtener películas' });
    }
};

exports.traerPromociones = async (req, res) => {
    try {
        const results = await Info.obtenerPromociones();
        const promociones = results[0];
        if (!promociones || promociones.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron promociones.' });
        }
        return res.json({ ok: true, promociones });
    } catch (err) {
        console.error('Error al obtener promociones:', err);
        return res.status(500).json({ ok: false, mensaje: 'Error al obtener promociones' });
    }
};

exports.traerPeliculasHoy = async (req, res) => {
    try {
        const results = await Info.obtenerPeliculasHoy();
        const peliculas = results[0];
        if (!peliculas || peliculas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron películas para hoy.' });
        }
        return res.json({ ok: true, peliculas });
    } catch (err) {
        console.error('Error al obtener películas de hoy:', err);
        return res.status(500).json({ ok: false, mensaje: 'Error al obtener películas de hoy' });
    }
};
