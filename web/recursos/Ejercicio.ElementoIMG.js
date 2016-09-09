/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.IMG porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,

        TIPO_FUNCTION = "function",
        ATTR_ID = "id",

        CLASE_IMAGEN = "imagen",

        IMG = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,

                posicionable = null,

                src = null,

                loadImg = function (p_contenedor, p_callback) {
                    var imagen = new Image();

                    imagen.onload = function (datos_evento) {
                        imagen.style.display = "block";

                        var arrastrable = new Ejercicio.ComportamientoArrastrable(imagen, cfg.arrastrable);
                        arrastrable.onArrastrado(function (datos_evento) {
                            cfg.x = EjercicioPadre.screenToWorldX(datos_evento.x);
                            cfg.y = EjercicioPadre.screenToWorldX(datos_evento.y);
                        });

                        if (typeof p_callback === TIPO_FUNCTION) {
                            p_callback();
                        }

                        imagen.onload = null;
                    };

                    imagen.setAttribute(ATTR_ID, id);
                    imagen.className = CLASE_IMAGEN;
                    imagen.style.display = "none";

                    if (estaDefinido(p_contenedor)) {
//                        $(imagen).prependTo(p_contenedor);
                        p_contenedor.appendChild(imagen);
                    }

                    imagen.src = src;
                },
                render = function (p_contenedor) {
                    var imagen = document.getElementById(id);

                    if (imagen === null) {
                        loadImg(p_contenedor, render);
                        return;
                    }

                    CHA.addClass(imagen, cfg.posicion);
                    posicionable.posicionar(imagen);
                },
                init = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; };
                    cfg.posicion = cfg.posicion || "encima";
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    if (!estaDefinido(cfg.arrastrable)) { cfg.arrastrable = "no"; }
                    if (estaDefinido(cfg.archivo)) { src = EjercicioPadre.config.folder + cfg.archivo; }
                    if (estaDefinido(cfg.imagen)) { src = EjercicioPadre.config.folder + cfg.imagen; }
                };

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

    window.Ejercicio.IMG = IMG;
}());