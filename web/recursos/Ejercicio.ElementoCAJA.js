/*global window, document, DEBUG, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.CAJA porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_CAJA = "caja",
        ARRASTRABLE_NO = "no",
        CAJA = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,

                posicionable = null,
                texturizable = null,
                arrastrable = null,

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_CAJA, cfg);

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
                    }

                    if (cfg.arrastrable !== ARRASTRABLE_NO) {
                        arrastrable = new Ejercicio.ComportamientoArrastrable(elemento, cfg.arrastrable);
                        arrastrable.onArrastrado(function (datos_evento) {
                            posicionable.setScreenPos(datos_evento.x, datos_evento.y);
                        });
                    }

                    return elemento;
                },
                render = function (p_contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(p_contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);

                    return elemento;
                },
                reset = function () {
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                },
                init = function () {
                    if (!estaDefinido(cfg.arrastrable)) { cfg.arrastrable = ARRASTRABLE_NO; }
                    reset();
                };

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };

            this.getPosicionable = function () {
                return posicionable;
            };

            this.getTexturizable = function () {
                return texturizable;
            };

            this.render = render;

            // inicializar
            init();
        };

    window.Ejercicio.CAJA = CAJA;
}());