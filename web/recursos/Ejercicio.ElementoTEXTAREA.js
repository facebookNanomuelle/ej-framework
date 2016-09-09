/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.TEXTAREA porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,

        TAG_TEXTAREA = "textarea",

        TAM_DEFECTO = 20,
        CLASE_TEXTAREA = "textarea",

        TEXTAREA = function (p_id, p_cfg) {
        //        DEBUG && CHA.console(debugUid() + "Texto(" + index + ")");

            var cfg = p_cfg,
                id = p_id,

                posicionable = null,
                texturizable = null,

                tam = null,
                ajustarEscala = function () {
                    if (estaDefinido(cfg.tamTexto)) {
                        tam = EjercicioPadre.normalizedFontSize(cfg.tamTexto);
                    }
                },
                init = function () {
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);

                    if (!estaDefinido(cfg.tamTexto)) { cfg.tamTexto = TAM_DEFECTO; }
                    if (!estaDefinido(cfg.texto)) { cfg.texto = ''; }
                },
                crearElemento = function (contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_TEXTAREA, cfg),
                        elemento_text_area = document.createElement(TAG_TEXTAREA);

                    elemento.appendChild(elemento_text_area);

//                    texturizable.crearTextura(elemento);

                    if (estaDefinido(contenedor)) {
                        contenedor.appendChild(elemento);
                    }

                    return elemento;
                };

            this.render = function (contenedor) {
                var elemento = document.getElementById(id);

                if (elemento === null) {
                    elemento = crearElemento(contenedor);
                }

                ajustarEscala();

                posicionable.posicionar(elemento);
                texturizable.texturizar(elemento, posicionable);

                if (tam !== null) {
                    elemento.style.fontSize = tam + "px";
                }
            };

            init();

            // metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };

        };

    window.Ejercicio.TEXTAREA = TEXTAREA;
}());