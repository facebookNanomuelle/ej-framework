/*global window, $, DEBUG, CHA, CHRONO, EVALUACION, Ejercicio, EjercicioPadre*/

(function () {
    'use strict';

    var AhorcadoEngine = function (p_cfg) {
            var MAX_INTENTOS_DEFECTO = 10,
                ALFABETO_EN = "abcdefghijklmnopqrstuvwxyz",
                cfg = p_cfg,
                max_intentos,
                solucion,
                modelo_solucion,
                frase_usuario,
                letras_restantes,
                letras_pulsadas,
                letras_acertadas,
                letras_falladas,
                num_fallos,

                onLetraIncorrecta = new CHA.CallbackList(),
                onLetraCorrecta = new CHA.CallbackList(),
                onReset = new CHA.CallbackList(),

                modeloLetra = function (p_letra) {
                    var letra = p_letra.toLowerCase();

                    // ver https://mothereff.in/js-escapes#0Fingerspitzengef%C3%BChl%20is%20a%20German%20term.\nIt%E2%80%99s%20pronounced%20as%20follows%3A%20[%CB%88f%C9%AA%C5%8B%C9%90%CB%8C%CA%83p%C9%AAts%C9%99n%C9%A1%C9%99%CB%8Cfy%CB%90l]

                    // aáàäâ => a
                    if ('\x61\xE1\xE0\xE4\xE2'.indexOf(letra) !== -1) { return 'a'; }

                    // eéèëê => e
                    if ('\x65\xE9\xE8\xEB\xEA'.indexOf(letra) !== -1) { return 'e'; }

                    // iíìïî => i
                    if ('\x69\xED\xEC\xEF\xEE'.indexOf(letra) !== -1) { return 'i'; }

                    // oóòöô => o
                    if ('\x6F\xF3\xF2\xF6\xF4'.indexOf(letra) !== -1) { return 'o'; }

                    // uúùüû => u
                    if ('\x75\xFA\xF9\xFC\xFB'.indexOf(letra) !== -1) { return 'u'; }

                    return letra;
                },
                resetFraseUsuario = function () {
                    var ESPACIO = ' ',
                        palabras = solucion.split(ESPACIO),
                        i,
                        cuenta = palabras.length,
                        palabra;

                    for (i = 0; i < cuenta; i++) {
                        palabra = palabras[i];
                        palabras[i] = '_'.repeat(palabra.length);
                    }

                    frase_usuario = palabras.join(ESPACIO);
                },
                resetLetrasRestantes = function () {
                    letras_restantes = ALFABETO_EN.split('');
                },
                resetLetrasPulsadas = function () {
                    letras_pulsadas = [];
                },
                resetLetrasFalladas = function () {
                    letras_falladas = [];
                },
                resetLetrasAcertadas = function () {
                    letras_acertadas = [];
                },
                resetModeloSolucion = function () {
                    var i,
                        cuenta = solucion.length,
                        letra,
                        modelo_letra;

                    modelo_solucion = [];
                    for (i = 0; i < cuenta; i++) {
                        letra = solucion.substr(i, 1);
                        modelo_letra = modeloLetra(letra);
                        modelo_solucion.push(modelo_letra);
                    }
                },
                resetNumFallos = function () {
                    num_fallos = 0;
                },
                reset = function () {
                    resetNumFallos();
                    resetModeloSolucion();
                    resetLetrasRestantes();
                    resetLetrasPulsadas();
                    resetLetrasFalladas();
                    resetLetrasAcertadas();
                    resetFraseUsuario();
                },
                init = function () {
                    max_intentos = !isNaN(cfg.maxIntentos) ? Number(cfg.maxIntentos) : MAX_INTENTOS_DEFECTO;
                    solucion = cfg.FRASE.solucion;
                    reset();
                },
                estaEntreLasPulsadas = function (p_letra) {
                    return letras_pulsadas.indexOf(p_letra) !== -1;
                },
                estaEntreLaSolucion = function (p_letra) {
                    return modelo_solucion.indexOf(p_letra) !== -1;
                },
                eliminarDeRestantes = function (p_letra) {
                    var index_of_letra = letras_restantes.indexOf(p_letra);
                    letras_restantes.splice(index_of_letra, 1);
                },
                addEnPulsadas = function (p_letra) {
                    letras_pulsadas.push(p_letra);
                },
                addEnFalladas = function (p_letra) {
                    letras_falladas.push(p_letra);
                },
                addEnAcertadas = function (p_letra) {
                    letras_acertadas.push(p_letra);
                },
                actualizarSolucion = function () {
                    var i,
                        cuenta = modelo_solucion.length,
                        letra;

                    for (i = 0; i < cuenta; i++) {
                        letra = modelo_solucion[i];
                        if (estaEntreLasPulsadas(letra)) {
                            frase_usuario = frase_usuario.substr(0, i) + solucion.substr(i, 1) + frase_usuario.substr(i + 1);
                        }
                    }
                },
                comprobarLetra = function (p_letra) {
                    if (estaEntreLaSolucion(p_letra)) {
                        addEnAcertadas(p_letra);
                        actualizarSolucion();

                        onLetraCorrecta(p_letra);
                    } else {
                        if (num_fallos < max_intentos) {
                            num_fallos++;
                        }
                        addEnFalladas(p_letra);

                        onLetraIncorrecta(p_letra);
                    }
                };

            this.reset = function () {
                reset();
                onReset();
            };

            this.getMaxIntentos = function () {
                return max_intentos;
            };

            this.getIntentosAgotados = function () {
                return num_fallos === max_intentos;
            };

            this.getSolucion = function () {
                return solucion;
            };

            this.getFraseUsuario = function () {
                return frase_usuario;
            };

            this.getLetrasRestantes = function () {
                return letras_restantes;
            };

            this.getLetrasPulsadas = function () {
                return letras_pulsadas;
            };

            this.getLetrasFalladas = function () {
                return letras_falladas;
            };

            this.getLetrasAcertadas = function () {
                return letras_acertadas;
            };

            this.getNumFallos = function () {
                return num_fallos;
            };

            this.seleccionarLetra = function (p_letra) {
                if (estaEntreLasPulsadas(p_letra)) {
                    return;
                }

                eliminarDeRestantes(p_letra);
                addEnPulsadas(p_letra);

                comprobarLetra(p_letra);
            };

            this.modeloLetra = modeloLetra;

            this.getSolucionado = function () {
                return frase_usuario === solucion;
            };

            // eventos
            this.onLetraCorrecta = onLetraCorrecta;
            this.onLetraIncorrecta = onLetraIncorrecta;
            this.onReset = onReset;

            init();
        },
        EjercicioAhorcado = function (ejercicioPadre) {

            // Variables privadas del objeto EjercicioTonto
            var uid = (function () {
                    if (EjercicioAhorcado.nextUid === undefined) {
                        EjercicioAhorcado.nextUid = 0;
                    } else {
                        EjercicioAhorcado.nextUid += 1;
                    }

        //            DEBUG && CHA.console("New EjercicioAhorcado -> uid: " + EjercicioAhorcado.nextUid);
                    return EjercicioAhorcado.nextUid;
                }()),
                me = this,
                parent = ejercicioPadre || EjercicioPadre,
                debugUid = function () {
                    var ej_id = parent.config && parent.config.id ? parent.config.id : "??????";
                    return ej_id + ": Ahorcado[uid: " + uid + "].";
                },

                texto_usuario = null,
                vidas = null,
                testigo_fallos = null,
                testigo_aciertos = null,
                teclado = null,
                engine = null,

                actualizarTextoUsuario = function () {
                    texto_usuario.setTexto(engine.getFraseUsuario());
                },
                actualizarVidas = function () {
                    vidas.getTexturizable().setFrame(engine.getNumFallos());
                },
                actualizarTestigoAciertos = function () {
                    if (!testigo_aciertos) {
                        return;
                    }
                    
                    var letras_acertadas = engine.getLetrasAcertadas().join(', ');
                    testigo_aciertos.setTexto(letras_acertadas);
                },
                actualizarTestigoFallos = function () {
                    if (!testigo_fallos) {
                        return;
                    }

                    var letras_falladas = engine.getLetrasFalladas().join(', ');
                    testigo_fallos.setTexto(letras_falladas);
                };

            // Variables publicas
            me.config = null;
            me.nombreTipo = "ahorcado";

            me.onCorrecto = new CHA.CallbackList();
            me.onIncorrecto = new CHA.CallbackList();
            me.onCompletado = new CHA.CallbackList();
            me.onTerminado = new CHA.CallbackList();

            // Metodos publicos INTERFACE CON EJERCICIO
            this.init = function () {
                DEBUG && CHA.console(debugUid() + "init");

                var cfg = me.config,
                    cfg_EJERCICIO = cfg.EJERCICIO;

                // engine
                engine = new AhorcadoEngine(cfg_EJERCICIO);
                engine.onReset(function () {
                    actualizarTextoUsuario();
                    actualizarVidas();
                    actualizarTestigoAciertos();
                    actualizarTestigoFallos();

                    teclado.reset();
                });

                engine.onLetraCorrecta(function (p_letra) {
                    actualizarTextoUsuario();
                    actualizarTestigoAciertos();

                    teclado.setTeclaCorrecta(p_letra);

                    parent.accionCorrecta(p_letra);
                });

                engine.onLetraIncorrecta(function (p_letra) {
                    actualizarTestigoFallos();
                    actualizarVidas();

                    teclado.setTeclaIncorrecta(p_letra);

                    parent.accionIncorrecta(p_letra);
                });

                // texto usuario
                texto_usuario = new Ejercicio.TEXTO(me.nombreTipo + "_texto_usuario", cfg_EJERCICIO.FRASE);
                texto_usuario.setTexto(engine.getFraseUsuario());

                // vidas
                cfg_EJERCICIO.VIDAS.numFrames = engine.getMaxIntentos() + 1;
                vidas = new Ejercicio.CAJA(me.nombreTipo + "_vidas", cfg_EJERCICIO.VIDAS);

                // testigo fallos
                if (CHA.estaDefinido(cfg_EJERCICIO.TESTIGO_LETRAS_FALLADAS)) {
                    testigo_fallos = new Ejercicio.TEXTO(me.nombreTipo + "_testigo_fallos", cfg_EJERCICIO.TESTIGO_LETRAS_FALLADAS);
                }

                // testigo aciertos
                if (CHA.estaDefinido(cfg_EJERCICIO.TESTIGO_LETRAS_ACERTADAS)) {
                    testigo_aciertos = new Ejercicio.TEXTO(me.nombreTipo + "_testigo_aciertos", cfg_EJERCICIO.TESTIGO_LETRAS_ACERTADAS);
                }

                // teclado
                teclado = new Ejercicio.TECLADO(me.nombreTipo + "_teclado", cfg_EJERCICIO.TECLADO);
                teclado.onTeclaPulsada(function (p_boton) {
                    if (parent.getEstado() !== parent.EJ_STATUS.NORMAL) {
                        return;
                    }

                    engine.seleccionarLetra(p_boton.getCfg().letra);
                });

                this.onCompletado(function () {
                    parent.terminar();
                });
            };

            this.draw = function (p_contenedor) {
                texto_usuario.render(p_contenedor);
                vidas.render(p_contenedor);

                if (testigo_aciertos) {
                    testigo_aciertos.render(p_contenedor);
                }

                if (testigo_fallos) {
                    testigo_fallos.render(p_contenedor);
                }
                teclado.render(p_contenedor);
            };

            this.estaCompletado = function () {
                return engine.getSolucionado() || engine.getIntentosAgotados();
            };

            this.totalAnswers = function () {
                var i,
                    frase_usuario = engine.getFraseUsuario(),
                    cuenta = frase_usuario.length,
                    letra,
                    total = 0;

                for (i = 0; i < cuenta; i++) {
                    letra = frase_usuario.substr(i, 1);
                    if (letra !== ' ') {
                        total++;
                    }
                }

                return total;
            };

            this.correctAnswers = function () {
                var i,
                    frase_usuario = engine.getFraseUsuario(),
                    cuenta = frase_usuario.length,
                    letra,
                    aciertos = 0;

                for (i = 0; i < cuenta; i++) {
                    letra = frase_usuario.substr(i, 1);
                    if (letra !== ' ' && letra !== '_') {
                        aciertos++;
                    }
                }

                return aciertos;
            };

            this.percentCorrect = function () {
                var percentCorrect = Math.round(100 * this.correctAnswers() / this.totalAnswers());
                return percentCorrect;
            };

            this.reset = function () {
                engine.reset();
            };
        };

    window.EjercicioAhorcado = EjercicioAhorcado;

    // If DEBUG => hacer engine accesible para unit test
    if (DEBUG) {
        EjercicioAhorcado.__TestableAhorcadoEngine__ = AhorcadoEngine;
    }
}());
