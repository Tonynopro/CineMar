window.addEventListener('DOMContentLoaded', () => {
    const canciones = [
        {
            src: "/sounds/Ella_Y_Yo.mp3",
            letra: letraEllaYoCompleta(),
            tipo: "normal"
        },
        {
            src: "/sounds/DanzaKuduro.mp3",
            letra: letraDanzaKuduro(),
            tipo: "normal"
        },
        {
            src: "/sounds/DivaVirtual.mp3",
            letra: letraDivaVirtual(),
            tipo: "normal"
        },
        {
            src: "/sounds/HowWeRoll.mp3",
            letra: howWeRoll(),
            tipo: "normal"
        }
    ];

    const cancionesEspeciales = [
        {
            src: "/sounds/Homero.mp3",
            tipo: "especial",
            fondo: "url('/images/other/Homero.gif') no-repeat center center fixed",
            contenidoHtml: `
            <img src="/images/other/Homero.jpg" alt="Imagen especial" style="max-width: 100%; height: auto; z-index: 10; position: relative;">
        `
        },
        {
            src: "/sounds/NoSe.mp3",
            tipo: "especial",
            fondo: "url('/images/other/Si.gif') no-repeat center center fixed",
            contenidoHtml: `
            <img src="/images/other/NoSe.jpg" alt="Imagen especial" style="max-width: 100%; height: auto; z-index: 10; position: relative;">
        `
        }
    ];


    const azarEspecial = Math.floor(Math.random() * 1000) + 1;

    let cancionSeleccionada;

    if (azarEspecial === 1) {
        // Elegir aleatoriamente uno de los dos especiales con 50% de probabilidad
        const indiceEspecial = Math.random() < 0.5 ? 0 : 1;
        cancionSeleccionada = cancionesEspeciales[indiceEspecial];
    } else {
        const indiceNormal = Math.floor(Math.random() * canciones.length);
        cancionSeleccionada = canciones[indiceNormal];
    }

    const audio = new Audio(cancionSeleccionada.src);
    audio.loop = true;
    audio.play().catch(() => {
        console.warn("Autoplay bloqueado.");
    });

    function actualizarContenido(cancion) {
        const seccion = document.getElementById("seccion-especial");
        if (!seccion) {
            console.warn("Elemento con id 'seccion-especial' no encontrado.");
            return;
        }

        // Restaurar fondo por defecto
        document.body.style.background = "";
        document.body.style.backgroundSize = "";
        document.body.style.backgroundRepeat = "";
        document.body.style.backgroundAttachment = "";

        if (cancion.tipo === "normal") {
            seccion.innerHTML = `
            <p style="white-space: pre-line; text-align: left;">${cancion.letra}</p>
        `;
        } else if (cancion.tipo === "especial") {
            seccion.innerHTML = cancion.contenidoHtml;

            // Aplicar fondo si está definido
            if (cancion.fondo) {
                document.body.style.background = cancion.fondo;
                document.body.style.backgroundSize = "cover"; // puedes ajustar si no quieres que se escale
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundAttachment = "fixed";
            }
        }
    }
    actualizarContenido(cancionSeleccionada);

    // Función para cambiar canción en cualquier momento si quieres usarla
    window.cambiarCancion = function (nuevaCancion) {
        audio.pause();
        audio.src = nuevaCancion.src;
        audio.load();
        audio.play().catch(() => {
            console.warn("🔇 Autoplay bloqueado.");
        });
        actualizarContenido(nuevaCancion);
    };

    function letraEllaYoCompleta() {
        return `Ella y yo
Dos locos viviendo una aventura castigada por Dios
Un laberinto sin salida donde el miedo se convierte en amor
Somos su marido, ella y yo

Mi esposa y yo
Igual que ustedes compartimos en la vida un eterno amor
La dama perfecta, toda una belleza, ella es mi inspiración
Somos feliz, ella y yo

Amigo, ella y yo
Solos nos vemos a escondidas para ahogar esta prohibida pasión
Y aunque tiene dueño, yo solo tengo un sueño, ser su protector
Somos su marido, ella y yo

Oye Don, lucha por amor
No me aconsejes en tu posición
Quizás su marido no mande en su corazón
No sabes quién es víctima en la confusión

Oye mi pana, lucha por amor
No, no me aconsejes en tu posición
Quizás ese tipo no mande en su corazón
Tú no sabes quién es víctima en esta confusión

Mi esposa y yo, somos felices, dos almas matrices, sé lo que es el amor
Por eso te entiendo y aunque sea casada
No te alejes por temor, no lo hagas Don, ay no no no

Mi amigo, ella y yo teníamos claro que era una locura esta relación
Pero la carne nos llamaba, y la cama nos hacía una invitación
A solo hacer el amor

Ay ya te expliqué
Cuando hay personas que se aman, el amor tiene que vencer
Y ya el marido entiende que perdió su hembra, ahora es tu mujer
No pueden ganar los tres

Y te repito, lucha por amor
No me aconsejes en tu posición
Quizás su marido no mande en su corazón
No sabes quién es víctima en esta confusión

No seas tan tonto, lucha por amor
No, no me aconsejes en tu posición
Quizás ese tipo no mande en su corazón
Tú no sabes quién es víctima en esta confusión

Amigo pido perdón, yo nunca te fallé
Me traicionaron las ganas de volverla a ver
Y aunque todavía no puedo creer
Lo que este amargo encuentro me hizo comprender

Pues tú también llegaste a ese lugar
Donde tantas veces yo la fui a buscar
Y aunque no es fácil lo que voy a hacer
Admitiré que salí con tu mujer

Salí con tu mujer
(¿Qué?)
Salí con tu mujer
Salí con tu mujer
Salí con tu mujer

Que te perdone Dios, yo no lo voy a hacer
Los perdí a los dos y a la misma vez
Ya veo que todo era mentira cuando ella me decía
Que se iba pa' Puerto Rico a vacaciones con su amiga

Me mintió, tú y ella en una cama allá en Bayamón
Quizás en Isla Verde o Carolina, cuántos hoteles ensució
Tú también, los odio a los dos

(No me entiendes)
Que yo soy quien más sufro con todo esto
Me mata el dolor
Fue una traición
Perdí un amigo por la tentación
Perdón
Adiós`;
    }

    function letraDanzaKuduro() {
        return `A&X
El Orfanato
¡Danza Kuduro!
(Plop, plop, plop, plop, plop, plop, plop)
¡Lucenzo! (El Orfanato)
¡El rey!

La mano arriba, cintura sola
Da media vuelta, danza kuduro
No te canse' ahora, que esto solo empieza
Mueve la cabeza, danza kuduro

La mano arriba, cintura sola
Da media vuelta, danza kuduro
No te canse' ahora, que esto solo empieza
Mueve la cabeza, danza kuduro

Quién puede domar la fuerza del mal
Que se mete por tu' vena' (¡Don!)
Lo caliente del Sol que se te metió
Y no te deja quieta, nena (¡toma, toma!)

Quién puede parar eso que al bailar
Descontrola tu' cadera' (sexy)
Y ese fuego que quema por dentro y lento
Te convierte en fiera

Con la mano arriba, cintura sola
Da media vuelta y sacude duro
No te quite' ahora, que esto solo empieza
Mueve la cabeza y sacude duro (mexe kuduro)

Balança que é uma loucura
Morena, vem a meu lado
Ninguém vai ficar parado
Quero ver mexer kuduro

Balança que é uma loucura
Morena, vem a meu lado
Ninguém vai ficar parado

Oi, oi, oi
Oi, oi, oi, oi
É pra quebrar kuduro
Vamos dançar kuduro

Oi, oi, oi
Oi, oi, oi, oi
Seja morena ou loira
Vem balançar kuduro

Oi, oi, oi

La mano arriba, cintura sola
Da media vuelta, danza kuduro
No te canse' ahora, que esto solo empieza
Mueve la cabeza, danza kuduro

La mano arriba, cintura sola
Da media vuelta, danza kuduro
No te canse' ahora, que esto solo empieza
Mueve la cabeza, danza kuduro

Balança que é uma loucura
Morena, vem a meu lado
Ninguém vai ficar parado
Quero ver mexer kuduro

Balança que é uma loucura
Morena, vem a meu lado
Ninguém vai ficar parado

Oi, oi, oi
Oi, oi, oi, oi
É pra quebrar kuduro
Vamos dançar kuduro

Oi, oi, oi
Oi, oi, oi, oi
Seja morena ou loira
Vem balançar kuduro

Oi, oi, oi
¡El Orfanato!

(Vai, vai, vai, vai) la mano arriba
(Vai, vai, vai, vai) cintura sola
(Vai, vai, vai, vai) da media vuelta
(Vai, vai, vai, vai) danza kuduro

(Vai, vai, vai, vai) no te canse' ahora
(Vai, vai, vai, vai) que esto solo empieza
(Vai, vai, vai, vai) mueve la cabeza
(Vai, vai, vai, vai) danza kuduro

La mano arriba, cintura sola
Da media vuelta, danza kuduro
No te canse' ahora, que esto solo empieza
Mueve la cabeza, danza kuduro

A&X`
    }

    function letraDivaVirtual() {
        return `D– D– D!
D-O
Diesel!
Icon!

Ella es ese sueño
Que tuve despierto
Un recuerdo leve
De esto que siento
Una sacudida
A mis salidas
La cima de un beso en un brinco suicida
Su fuente de energía
Cautiva mis sensores
Pues no hay que la controle
Cuando baila encendía

Tiene dentro esa chispa
Que quema transistores
Y bebe de un elixir
Que enciende sus motores

Salió a la disco bailar
Una diva virtual
Uh!
Chequea como se menea
Uhh
Chequea como se menea
Uuuu!
Chequea como se menea

Tiene algo de robot en su táctica
Me agotó la batería su técnica
Su modelo vino con cintura plástica
Con lo movimientos de la mujer biónica

She's on fire!

Ta encendía!
Con la sangre high prendia
Hoy no quiere ver la luz del día
No trajo brujula, eta noche anda perdía
Su sistema seductivo calentándose!
Mientras que su frecuencia esta sintiéndose!
Su fluido corporal esta exportándose!
Robótica en la pista está luciéndose!

Salió a la disco bailar
Una diva virtual
Uh!
Chequea como se menea
Uhh
Chequea como se menea
Uuuu!
Chequea como se menea

Tiene algo de robot en su táctica
Me agotó la batería su técnica
Su modelo vino con cintura plástica
Con los movimientos de la mujer biónica

Tiene algo de robot en su táctica
Me agotó la batería su técnica
Su modelo vino con cintura plástica
Con los movimientos de la mujer biónica

Diesel!
Uhh
Chequea como se menea

Ella es ese sueño
Que tuve despierto
Un recuerdo leve
De esto que siento
Una sacudida
A mis salidas
La cima de un beso en un brinco suicida
Su fuente de energía
Cautiva mis sensores
Pues no hay que la controle
Cuando baila encendía

Tiene dentro esa chispa
Que quema transistores
Y bebe de un elixir
Que enciende sus motores

Salió a la disco bailar
Una diva virtual
Uh!
Chequea como se menea
(Sencillo!)
Uhh
Chequea como se menea
Uuuu!
Chequea como se menea

D– D– DO!
Diesel
Sencillo, tamo' trabajando por encima de sus expectativas
De eso se trata!
Algunos años luz ante que todos ustedes, siempre voy a vivir ahí
No mires pa' mi galaxia`
    }

    function howWeRoll() {
        return `Knignt Rydaz
Robin, Lex
¡Robin! (¡Yeah!), ¡Lex!
¡El Orfanato!
¡iDon!

That's how we roll, we roll like this
That's how we roll, we roll like this
That's how we roll, we roll like this
That's how we roll, we roll like this
We roll like this

Down blue jean y un White T
Forra'o en tinta, full de bling bling
Corro el bloque, we run the street
Y tengo un coro 'e loco' que si toco 'tán pa' ti
'Toy contrata'o con AT&T, tirame al BlackBerry
Tengo noticias pa' ti, soy mejor que tú, chery
Tengo tres mansiones, dos Porsche y un Bentley
Millonario y me case con Jackie
See Don Omar Live
Get tickets as low as $269
You might also like
Galactic Blues
Don Omar
Danza Kuduro
Don Omar & Lucenzo
HUNTR/X - Golden (Romanized)
Genius Romanizations

That's how we roll, we roll like this
That's how we roll, we roll like this
That's how we roll, we roll like this
That's how we roll, we roll like this

Desaparece como crazy de mi sueño ese es Bob Marley
Donde estoy quemando los auspicios que dio Harley
Junto con Sony voy a anticipar tu futuro
Aguántate cabrón que yo no voy a poner culo
Tu comitiva que no gaste saliva, te escriba quien te escriba
Mientras yo viva, mientras yo sea presidente
Y esta industria tenga vida, no te vistas tú no vienes pa'ca arriba

Yes, I keep it full tank, for the highway
Yes, I keep it full plane, for the skyway
It's just me and my gang, you're on our way
It's no wonder why your hate, is up, in my face
Yes, I keep it full tank, for the highway
Yes, I keep it full plane, for the skyway
It's just me and my gang, you're on our way
It's no wonder why your hate, is up, in my face

That's how we roll, we roll like this (¡D-O!)
That's how we roll (El Orfanato), we roll like this (Lex, Robin)
That's how we roll (You run the industry), we roll like this (We roll like this)
That's how we roll (Te estamo' quemando la liga), we roll like this (Lex, Robin)
We roll like this

¡El Orfanato!
¡iDon!
Di-di-di
Di-di-di, ¡D-O!
No trate de compararse, tú estas hablando con él presidente`
    }
});
