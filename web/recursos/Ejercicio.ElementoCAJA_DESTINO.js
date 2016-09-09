/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.CAJA_DESTINO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_CAJA_DESTINO = "caja_destino",
        CAJA_DESTINO = function (p_id, p_cfg) {
            var me = this,
                cfg = p_cfg,
                id = p_id,

                posicionable = null,
                texturizable = null,
                contenedor = null,

                // eventos
                onElementoRecibido = new CHA.CallbackList(),

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_CAJA_DESTINO, cfg);

//                    texturizable.crearTextura(elemento);

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
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
                    contenedor.render(elemento);

                    return elemento;
                },
                init = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; };

                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                    contenedor = new Ejercicio.ComportamientoContenedor(id, cfg);
                };

            // Eventos publicos
            this.onElementoRecibido = onElementoRecibido;

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;
            this.getElemento = function (elemento_id) {
                if (contenedor === null) {
                    return;
                }
                return contenedor.getElemento(elemento_id);
            };

            // inicializar
            init();
        };

    window.Ejercicio.CAJA_DESTINO = CAJA_DESTINO;
}());