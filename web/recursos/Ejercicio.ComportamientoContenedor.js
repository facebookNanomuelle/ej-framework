/*global DEBUG, window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.Contenedor porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        POSICION_ENCIMA = "encima",
        ComportamientoContenedor = function (id, p_cfg) {
            var cfg = JSON.parse(JSON.stringify(p_cfg)),
                elementos = null,
                contenedor = null,
                getElemento = function (elemento_id) {
                    if (elemento_id === "" || elemento_id === null || elemento_id === false) {
                        return null;
                    }

                    var i,
                        cuenta;

                    for (i = 0, cuenta = elementos.length; i < cuenta; i++) {
                        if (elementos[i].getId() === elemento_id) {
                            return elementos[i];
                        }
                    }

                    return null;
                },
                render = function (p_contenedor, p_filtro_encima_o_debajo) {
                    var i,
                        cuenta,
                        filtro = p_filtro_encima_o_debajo || POSICION_ENCIMA,
                        elemento,
                        posicion_elemento;

                    contenedor = p_contenedor;
                    for (i = 0, cuenta = elementos.length; i < cuenta; i++) {
                        elemento = elementos[i];
                        posicion_elemento = elemento.getCfg().posicion || POSICION_ENCIMA;
                        if (filtro === posicion_elemento) {
                            elemento.render(contenedor);
                        }
                    }

                    return contenedor;
                },
                init = function () {
                    var nombre_elemento,
                        cfg_elementos,
                        cfg_elemento,
                        elemento,
                        i,
                        elemento_id,
                        cuenta;

                    elementos = [];
                    for (nombre_elemento in cfg) {
                        if (cfg.hasOwnProperty(nombre_elemento) && estaDefinido(Ejercicio[nombre_elemento])) {
                            cfg_elementos = cfg[nombre_elemento] = CHA.asArray(cfg[nombre_elemento]);
                            for (i = 0, cuenta = cfg_elementos.length; i < cuenta; i++) {
                                cfg_elemento = cfg_elementos[i];
                                elemento_id = id + "_" + nombre_elemento + i;

                                elemento = new Ejercicio[nombre_elemento](elemento_id, cfg_elemento);
                                elementos.push(elemento);
                            }
                        }
                    }
                },
                removeElement = function (p_element) {
                    if (CHA.estaDefinido(p_element.destruir)) {
                        p_element.destruir();
                    } else {
                        var elemento_html = document.getElementById(p_element.getId());
                        if (elemento_html !== null) {
                            elemento_html.parentNode.removeChild(elemento_html);
                        }
                    }
                };

            // metodos publicos
            this.getId = function () {
                return id;
            };
            this.render = render;
            this.removeAll = function () {
                var i,
                    cuenta = elementos.length;

                for (i = 0; i < cuenta; i++) {
                    removeElement(elementos[i]);
                }

                elementos = [];
            };
            this.getElemento = getElemento;
            this.getElementos = function () { return elementos; };
            this.add = function (p_elemento) {
                elementos.push(p_elemento);
                if (contenedor !== null) {
                    p_elemento.render(contenedor);
                }
            };
            this.removeById = function (p_elemento_id) {
                if (p_elemento_id === "" || p_elemento_id === null || p_elemento_id === false) {
                    return null;
                }

                var i,
                    cuenta;
//                    elemento_html;

                for (i = 0, cuenta = elementos.length; i < cuenta; i++) {
                    if (elementos[i].getId() === p_elemento_id) {
                        removeElement(elementos[i]);
                        elementos.splice(i, 1);
                        return;
                    }
                }

                return null;
            };
            //
            init();
        };

    window.Ejercicio.ComportamientoContenedor = ComportamientoContenedor;
}());