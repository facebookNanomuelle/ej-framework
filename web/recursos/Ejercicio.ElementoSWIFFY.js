/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.SWIFFY porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_SWIFFY = "ventana",
        SWIFFY = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,

                posicionable = null,

                swiffyobject = null,
                stage = null,

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_SWIFFY, cfg);

                    stage = new swiffy.Stage(elemento, swiffyobject);
                    stage.setBackground(null);
                    if (estaDefinido(cfg.parametros)) {
                        stage.setFlashVars("parametros=" + cfg.parametros);
                    }

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
                    }

                    return elemento;
                },

                loadSwiffy = function (p_contenedor, callback) {
                    var file = EjercicioPadre.config.folder + cfg.archivo;

                    CHA.loadScript(file,
                        function () {
                            DEBUG && CHA.console("cargado swiffy: " + file);

                            swiffyobject = window[cfg.nombre];
                            window[cfg.nombre] = null;
                            crearElemento(p_contenedor);
                            callback();
                        },
                        function () {
                            DEBUG && CHA.console("error cargando swiffy: " + file);
                        });
                },

                render = function (p_contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        loadSwiffy(p_contenedor, render);
                        return;
                    }

                    posicionable.posicionar(elemento);
                    stage.start();
                },
                init = function () {
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                };

            // Eventos publicos

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;

            // inicializar
            init();
        };

    window.Ejercicio.SWIFFY = SWIFFY;
}());