/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.VENTANA porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_VENTANA = "ventana",
        VENTANA = function (p_id, p_cfg) {
            var me = this,
                cfg = p_cfg,
                id = p_id,

                posicionable = null,
                texturizable = null,
                contenedor = null,

                // eventos
                onCerrar = new CHA.CallbackList(),

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_VENTANA, cfg);

//                    texturizable.crearTextura(elemento);

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
                    }

                    var arrastrable = new Ejercicio.ComportamientoArrastrable(elemento, cfg.arrastrable);
                        arrastrable.onArrastrado(function (datos_evento) {
                            posicionable.setScreenPos(datos_evento.x, datos_evento.y);
                        });

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
                cerrar = function () {
                    var elemento = document.getElementById(id);
                    elemento.parentNode.removeChild(elemento);

                    onCerrar(me);
                },
                initBotonCerrar = function () {
                    var botonCerrar = contenedor.getElemento(cfg.botonCerrar);
                    if (botonCerrar !== null) {
                        botonCerrar.onPulsado(function () {
                            cerrar();
                        });
                    }
                },
                init = function () {
                    if (!estaDefinido(cfg.arrastrable)) { cfg.arrastrable = "no"; }

                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                    contenedor = new Ejercicio.ComportamientoContenedor(id, cfg);

                    if (estaDefinido(cfg.botonCerrar)) { initBotonCerrar(); }
                };

            // Eventos publicos
            this.onCerrar = onCerrar;

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;
            this.cerrar = cerrar;
            this.getElemento = function (elemento_id) {
                if (contenedor === null) {
                    return;
                }
                return contenedor.getElemento(elemento_id);
            };

            // inicializar
            init();
        };

    window.Ejercicio.VENTANA = VENTANA;
}());