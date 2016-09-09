/*global window, document, DEBUG, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.MARCADOR porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_MARCADOR = "marcador",

        CLASE_DESACTIVADO = "desactivado",

        PUNTUACION_MAXIMA_NO = "no",
        PUNTUACION_MAXIMA_SI = "si",
        SEPARADOR_POR_DEFECTO = "/",

        MARCADOR = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,
                texto_id = null,

                // comportamiento
                posicionable = null, // posicionamiento relativo al contenedor
                texturizable = null, // colores y fondos
                bordeable = null, // borde

                // elemento hijo
                texto = null,

                activo = true,
                puntuacion = 0,
                puntuacion_maxima = null,
                mostrar_puntuacion_maxima = false,
                separador = SEPARADOR_POR_DEFECTO,

                actualizarElementoAtributoActivo = function () {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        return;
                    }

                    if (activo) {
                        CHA.removeClass(elemento, CLASE_DESACTIVADO);
                    } else {
                        CHA.addClass(elemento, CLASE_DESACTIVADO);
                    }
                },

                desactivar = function () {
                    activo = false;
                    actualizarElementoAtributoActivo();
                },

                activar = function () {
                    activo = true;
                    actualizarElementoAtributoActivo();
                },

                crearElemento = function (contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_MARCADOR, cfg);

                    if (estaDefinido(contenedor)) {
                        contenedor.appendChild(elemento);
                    }

                    return elemento;
                },
                render = function (contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);
                    bordeable.bordear(elemento);

                    texto.render(elemento);

                    actualizarElementoAtributoActivo();

                    return elemento;
                },
                construirTextoMarcador = function () {
                    var texto_marcador = "" + puntuacion;

                    if (mostrar_puntuacion_maxima) {
                        texto_marcador += separador + puntuacion_maxima;
                    }

                    return texto_marcador;
                },
                incrementar = function (incremento) {
                    if (!estaDefinido(incremento)) {
                        incremento = 1;
                    }

                    puntuacion += incremento;
                    texto.setTexto(construirTextoMarcador());
                },
                reset = function () {
                    puntuacion = Number(cfg.puntuacion);
                    puntuacion_maxima = cfg.puntuacionMaxima === null ? null : Number(cfg.puntuacionMaxima);
                    mostrar_puntuacion_maxima = (cfg.mostrarPuntuacionMaxima === PUNTUACION_MAXIMA_SI);
                    separador = cfg.separador;

                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                    bordeable = new Ejercicio.ComportamientoBordeable(cfg);
                    texto = new Ejercicio.TEXTO(texto_id, cfg.TEXTO);
                    texto.setTexto(construirTextoMarcador());
                },
                init = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; };
                    texto_id = id + "_texto";
                    
                    if (!estaDefinido(cfg.puntuacion)) { cfg.puntuacion = 0; }
                    if (!estaDefinido(cfg.puntuacionMaxima)) { cfg.puntuacionMaxima = null; }
                    if (!estaDefinido(cfg.mostrarPuntuacionMaxima)) { cfg.mostrarPuntuacionMaxima = PUNTUACION_MAXIMA_NO; }
                    if (!estaDefinido(cfg.separador)) { cfg.separador = SEPARADOR_POR_DEFECTO; }
                    if (!estaDefinido(cfg.TEXTO)) { cfg.TEXTO = {}; }

                    reset();
                };

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;

            // activar / desactivar
            this.activar = activar;
            this.desactivar = desactivar;
            this.estaActivo = function () {
                return activo;
            };

            // puntuacion
            this.getPuntuacionMaxima = function () {
                return puntuacion_maxima;
            };

            this.getPuntuacion = function () {
                return puntuacion;
            };

            this.getTexto = function () {
                return texto.getTexto();
            };

            this.incrementar = incrementar;
            this.reset = reset;

            // inicializar
            init();
        };

    window.Ejercicio.MARCADOR = MARCADOR;
}());