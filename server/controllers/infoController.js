const path = require('path');
const Info = require('../models/infoModel');
const { info } = require('console');

exports.mostrarNuestraHistoria = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/Nuestra-historia.html'));
}

exports.mostrarPreguntasFrecuentes = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/preguntas-frecuentes.html'));
}

exports.mostrarTerminosUso = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/terminos.html'));
}

exports.mostrarPoliticasPrivacidad = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/politica-privacidad.html'));
}

exports.mostrarEncuentraTuCine = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/creditos.html'));
}

exports.mostrarInformacionPelicula = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/detalle.html'));
}

exports.mostrarHorariosPelicula = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/horarios.html'));
}

exports.mostrarPromociones = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/promociones.html'));
}

exports.traerInfoPelicula = (req, res) => {
    const id = req.params.id;

    Info.obtenerInfo(id, (err, results) => {
        if (err) {
            console.error('Error al obtener información de la película:', err.stack);

            if (err.message === "Película no encontrada.") {
                return res.status(404).json({ ok: false, mensaje: err.message });
            }

            return res.status(500).json({ ok: false, mensaje: 'Error al obtener información de la película' });
        }

        const pelicula = results[0][0];
        if (!pelicula) {
            return res.status(404).json({ ok: false, mensaje: 'Película no encontrada.' });
        }

        // Ahora sí: encadenamos la segunda consulta
        Info.obtenerActores(id, (err, results) => {
            if (err) {
                console.error('Error al obtener actores de la película:', err.stack);

                if (err.message === "Película no encontrada.") {
                    return res.status(404).json({ ok: false, mensaje: err.message });
                }

                return res.status(500).json({ ok: false, mensaje: 'Error al obtener actores de la película' });
            }

            const actores = results[0];
            const respuesta = {
                ok: true,
                pelicula,
                actores
            };

            return res.json(respuesta);
        });
    });
};

exports.traerFuncionesPelicula = (req, res) => {
    const id = req.params.id;

    Info.obtenerFunciones(id, (err, results) => {
        if (err) {
            console.error('Error al obtener funciones de la película:', err.stack);

            if (err.message === "Pelicula no encontrada.") {
                return res.status(404).json({ ok: false, mensaje: err.message });
            }

            return res.status(500).json({ ok: false, mensaje: 'Error al obtener funciones de la película' });
        }

        const funciones = results[0];
        const funcPr = results[0][0];
        
        let info = undefined;
        
        if(funcPr) {
            let info = {
            id: funcPr.ID_pelicula,
            nombre: funcPr.titulo,
            clasificacion: funcPr.clasificacion,
            duracion: funcPr.duracion_min,
            }
        }
            

        const respuesta = {
            ok: true,
            info,
            funciones
        };

        return res.json(respuesta);
    });
}

exports.traerAsientosFuncion = (req, res) => {
    const id = req.params.id;

    Info.obtenerAsientos(id, (err, results) => {
        if (err) {
            console.error('Error al obtener asientos de la función:', err.stack);

            if (err.message === "Función no encontrada.") {
                return res.status(404).json({ ok: false, mensaje: err.message });
            }

            return res.status(500).json({ ok: false, mensaje: 'Error al obtener asientos de la función' });
        }

        const asientos = results[0];
        const respuesta = {
            ok: true,
            asientos
        };

        return res.json(respuesta);
    });
}

exports.traerPeliculas = (req, res) => {
    Info.obtenerPeliculas((err, results) => {
        if (err) {
            console.error('Error al obtener películas:', err.stack);
            return res.status(500).json({ ok: false, mensaje: 'Error al obtener películas' });
        }

        const peliculas = results[0];

        if (!peliculas || peliculas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron películas.' });
        }
        const respuesta = {
            ok: true,
            peliculas
        };

        return res.json(respuesta);
    });
}

exports.traerPromociones = (req, res) => {
    Info.obtenerPromociones((err, results) => {
        if (err) {
            console.error('Error al obtener promociones:', err.stack);
            return res.status(500).json({ ok: false, mensaje: 'Error al obtener promociones' });
        }

        const promociones = results[0];

        if (!promociones || promociones.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron promociones.' });
        }
        const respuesta = {
            ok: true,
            promociones
        };

        return res.json(respuesta);
    });
}

exports.traerPeliculasHoy = (req, res) => {
    Info.obtenerPeliculasHoy((err, results) => {
        if (err) {
            console.error('Error al obtener películas de hoy:', err.stack);
            return res.status(500).json({ ok: false, mensaje: 'Error al obtener películas de hoy' });
        }

        const peliculas = results[0];

        if (!peliculas || peliculas.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No se encontraron películas para hoy.' });
        }
        const respuesta = {
            ok: true,
            peliculas
        };

        return res.json(respuesta);
    });
}


