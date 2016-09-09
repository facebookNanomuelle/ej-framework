/*global window, document, DEBUG, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.TEXTO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        TAG_SPAN = "span",

        CLASE_TEXTO = "texto",
        TAM_DEFECTO = 20,
        ARRASTRABLE_NO = "no",
        TextoEngine = function () {
            var MARCADOR_SALTO_DE_LINEA_DEFECTO = "*",
                validarMarcadorSaltoDeLinea = function (p_marcadorSaltoDeLinea) {
                    if (!estaDefinido(p_marcadorSaltoDeLinea) ||
                            p_marcadorSaltoDeLinea === null ||
                            p_marcadorSaltoDeLinea === "") {
                        return MARCADOR_SALTO_DE_LINEA_DEFECTO;
                    }

                    return p_marcadorSaltoDeLinea;
                },
                validarCadena = function (p_cadena) {
                    if (!p_cadena) {
                        return "";
                    }
                    return p_cadena;
                },
                reemplazarEspacios = function (p_cadena) {
                    var REGEXP_ESPACIO = / /g,
                        TAG_ESPACIO = "&nbsp;";

                    return p_cadena.replace(REGEXP_ESPACIO, TAG_ESPACIO);
                },
                reemplazarNegrita = function (p_cadena) {
                    var REGEXP_ABRIR_NEGRITA = /\$B/g,
                        REGEXP_CERRAR_NEGRITA = /\/B/g,
                        TAG_ABRIR_NEGRITA = "<span class='bold'>",
                        TAG_CERRAR_NEGRITA = "</span>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_NEGRITA, TAG_ABRIR_NEGRITA);
                    return cadena.replace(REGEXP_CERRAR_NEGRITA, TAG_CERRAR_NEGRITA);
                },
                reemplazarCursiva = function (p_cadena) {
                    var REGEXP_ABRIR_CURSIVA = /\$I/g,
                        REGEXP_CERRAR_CURSIVA = /\/I/g,
                        TAG_ABRIR_CURSIVA = "<span class='italic'>",
                        TAG_CERRAR_CURSIVA = "</span>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_CURSIVA, TAG_ABRIR_CURSIVA);
                    return cadena.replace(REGEXP_CERRAR_CURSIVA, TAG_CERRAR_CURSIVA);
                },
                reemplazarSubrayado = function (p_cadena) {
                    var REGEXP_ABRIR_SUBRAYADO = /\$U/g,
                        REGEXP_CERRAR_SUBRAYADO = /\/U/g,
                        TAG_ABRIR_SUBRAYADO = "<span class='underline'>",
                        TAG_CERRAR_SUBRAYADO = "</span>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_SUBRAYADO, TAG_ABRIR_SUBRAYADO);
                    return cadena.replace(REGEXP_CERRAR_SUBRAYADO, TAG_CERRAR_SUBRAYADO);
                },
                reemplazarSuperindice = function (p_cadena) {
                    var REGEXP_ABRIR_SUPERINDICE = /\$Sp/g,
                        REGEXP_CERRAR_SUPERINDICE = /\/Sp/g,
                        TAG_ABRIR_SUPERINDICE = "<sup>",
                        TAG_CERRAR_SUPERINDICE = "</sup>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_SUPERINDICE, TAG_ABRIR_SUPERINDICE);
                    return cadena.replace(REGEXP_CERRAR_SUPERINDICE, TAG_CERRAR_SUPERINDICE);
                },
                reemplazarSubindice = function (p_cadena) {
                    var REGEXP_ABRIR_SUBINDICE = /\$Sb/,
                        REGEXP_CERRAR_SUBINDICE = /\/Sb/,
                        TAG_ABRIR_SUBINDICE = "<sub>",
                        TAG_CERRAR_SUBINDICE = "</sub>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_SUBINDICE, TAG_ABRIR_SUBINDICE);
                    return cadena.replace(REGEXP_CERRAR_SUBINDICE, TAG_CERRAR_SUBINDICE);
                },
                reemplazarColor = function (p_cadena) {
                    var REGEXP_ABRIR_COLOR = /\$F\#([0-9a-fA-F]+)\#/g,
                        REGEXP_CERRAR_COLOR = /\/F/g,
                        TAG_ABRIR_COLOR = "<span style='color:$1;'>",
                        TAG_CERRAR_COLOR = "</span>",
                        cadena;

                    cadena = p_cadena.replace(REGEXP_ABRIR_COLOR, TAG_ABRIR_COLOR);
                    return cadena.replace(REGEXP_CERRAR_COLOR, TAG_CERRAR_COLOR);
//                    cadena = cadena.replace(/\$F\#/g, "<span style='color:%%%%0001%%");
//                    cadena = cadena.replace(/\#/g, ";'>");
//                    cadena = cadena.replace(/\/F/g, "</span>");

                },
                reemplazarSaltosDeLinea = function (p_cadena, p_marcador_salto_de_linea) {
                    var marcador_salto_de_linea = validarMarcadorSaltoDeLinea(p_marcador_salto_de_linea),
                        REGEXP_SALTO_DE_LINEA = new RegExp("\\" + marcador_salto_de_linea, "g"),
                        TAG_SALTO_DE_LINEA = "<br>";

                    return p_cadena.replace(REGEXP_SALTO_DE_LINEA, TAG_SALTO_DE_LINEA);
                },
                normalizarTexto = function (p_cadena, p_marcadorSaltoDeLinea) {
                    var cadena = validarCadena(p_cadena);

                    cadena = reemplazarEspacios(cadena);
                    cadena = reemplazarNegrita(cadena);
                    cadena = reemplazarCursiva(cadena);
                    cadena = reemplazarSubrayado(cadena);
                    cadena = reemplazarSuperindice(cadena);
                    cadena = reemplazarSubindice(cadena);
                    cadena = reemplazarColor(cadena);
                    cadena = reemplazarSaltosDeLinea(cadena, p_marcadorSaltoDeLinea);

                    return cadena;
                };

            this.normalizarTexto = normalizarTexto;
        },
        engine = new TextoEngine(),
        TEXTO = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,
                span_id = id + "_span",

                posicionable = null,
                texturizable = null,

                worldFontSize = null,

                fuente = null,
                texto = '',

                renderTexto = function () {
                    var elemento = document.getElementById(span_id);
                    if (elemento === null) {
                        return;
                    }

                    elemento.innerHTML = texto;
                },
                setTexto = function (p_texto) {
                    texto = engine.normalizarTexto(p_texto);
                    renderTexto();
                },
                setFuente = function (p_fuente) {
                    if (estaDefinido(p_fuente)) {
                        fuente = p_fuente;
                    }
                },
                reset = function () {
                    worldFontSize = Number(cfg.tamTexto);
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                    setTexto(cfg.texto);
                    setFuente(cfg.fuente);
                },
                init = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; };
                    if (estaDefinido(cfg.CLASE_TEXTO)) { CLASE_TEXTO = cfg.CLASE_TEXTO; }
                    cfg.tamTexto = cfg.tamTexto || cfg.tam || TAM_DEFECTO;
                    if (!estaDefinido(cfg.arrastrable)) { cfg.arrastrable = ARRASTRABLE_NO; }

                    reset();
                },
                crearElemento = function (contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_TEXTO, cfg),
                        elemento_span = Ejercicio.crearTag(TAG_SPAN, span_id);

                    elemento_span.innerHTML = texto;
                    elemento.appendChild(elemento_span);

                    if (estaDefinido(contenedor)) {
                        contenedor.appendChild(elemento);
                    }

                    if (cfg.arrastrable !== ARRASTRABLE_NO) {
                        var arrastrable = new Ejercicio.ComportamientoArrastrable(elemento, cfg.arrastrable);
                        arrastrable.onArrastrado(function (datos_evento) {
                            posicionable.setScreenPos(datos_evento.x, datos_evento.y);
                        });
                    }

                    return elemento;
                },
                getScreenFontSize = function () {
                    if (worldFontSize === null) {
                        return null;
                    }

                    return EjercicioPadre.normalizedFontSize(worldFontSize);
                },
                render = function (contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);

                    if (worldFontSize !== null) {
                        elemento.style.fontSize = getScreenFontSize() + "px";
                    }

                    if (fuente !== null) {
                        elemento.style.fontFamily = fuente;
                    }

                    return elemento;
                };

            // metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };

            this.render = render;

            this.setTexto = setTexto;
            this.getTexto = function () {
                return texto;
            };

            this.getWorldFontSize = function () {
                return worldFontSize;
            };

            this.getScreenFontSize = getScreenFontSize;
            this.getFontFamily = function () {
                return fuente;
            };

            this.getClaseTexto = function () {
                return CLASE_TEXTO;
            };
            
            // init
            init();
        };

    window.Ejercicio.TEXTO = TEXTO;

    if (DEBUG) {
        window.Ejercicio.TEXTO.__TestableTextoEngine__ = TextoEngine;
    }
}());