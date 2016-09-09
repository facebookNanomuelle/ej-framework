/*global window, document, DEBUG, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.BOTON porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_BOTON = "boton",

        CLASE_ACTIVO = "activo",
        CLASE_DESACTIVADO = "desactivado",

        CLASE_PRESIONADO = "presionado",
        CLASE_CORRECTO = "correcto",
        CLASE_INCORRECTO = "incorrecto",

        ACCION_TIPO_ALTERNAR = "alternar",
        BOTON = function (p_id, p_cfg) {
        //        DEBUG && CHA.console(debugUid() + "IMG(" + index + ")");

            var me = this,
                cfg = p_cfg,
                id = p_id,

                elemento = null,

                activo = true, // habilitado / desabilitado
                presionado = false, // presionado / relajado
                correcto = false,
                incorrecto = false,

                posicionable = null, // posicionamiento relativo al contenedor
                texturizable = null, // colores y fondos
                pulsable = null,

                // elemento hijo
                texto = null,

                // para accion ventana
                ventana = null,

                // eventos
                onPulsado = new CHA.CallbackList(),

                // metodos privados
                crearElementoVentana = function (contenedor) {
                    var elemento_ventana,
                        zindex_padre = Number(contenedor.style.zIndex || 0);

                    elemento_ventana = ventana.render(contenedor);
                    elemento_ventana.style.zIndex = zindex_padre + 1;

                    return elemento_ventana;
                },
                crearElemento = function (contenedor) {
                    elemento = Ejercicio.crearTagDiv(id, CLASE_BOTON, cfg);

                    pulsable = new Ejercicio.ComportamientoPulsable(elemento);

                    if (estaDefinido(cfg.ACCION)) {
                        // ventana
                        if (estaDefinido(cfg.ACCION.VENTANA)) {
                            pulsable.onPulsado(function () {
                                var cerrarVentana = function () {
                                        ventana.cerrar();
                                        ventana = null;
                                    },
                                    mostrarVentana = function () {
                                        ventana = new Ejercicio.VENTANA(id + "_ventana", cfg.ACCION.VENTANA);
                                        ventana.onCerrar(function () {
                                            ventana = null;
                                        });

                                        crearElementoVentana(contenedor);
                                    };

                                if (cfg.ACCION.tipo === ACCION_TIPO_ALTERNAR && ventana !== null) {
                                    cerrarVentana();
                                } else {
                                    mostrarVentana();
                                }
                            });
                        }
                    }

                    // lanzar evento on pulsado
                    pulsable.onPulsado(function () {
                        if (!activo) {
                            return;
                        }

                        onPulsado(me);
                    });

                    if (estaDefinido(contenedor)) {
                        contenedor.appendChild(elemento);
                    }

                    return elemento;
                },
                actualizarElementoAtributoActivo = function () {
                    if (!elemento) {
                        return;
                    }

                    if (activo) {
                        CHA.addClass(elemento, CLASE_ACTIVO);
                        CHA.removeClass(elemento, CLASE_DESACTIVADO);
                    } else {
                        CHA.removeClass(elemento, CLASE_ACTIVO);
                        CHA.addClass(elemento, CLASE_DESACTIVADO);
                    }
                },
                actualizarElementoAtributoPresionado = function () {
                    if (!elemento) {
                        return;
                    }

                    if (presionado) {
                        CHA.addClass(elemento, CLASE_PRESIONADO);
                    } else {
                        CHA.removeClass(elemento, CLASE_PRESIONADO);
//                        CHA.removeClass(elemento, CLASE_CORRECTO);
//                        CHA.removeClass(elemento, CLASE_INCORRECTO);
                    }
                },
                actualizarElementoAtributoCorrecto = function () {
                    if (!elemento) {
                        return;
                    }

                    if (presionado && correcto) {
                        CHA.addClass(elemento, CLASE_CORRECTO);
                    } else {
                        CHA.removeClass(elemento, CLASE_CORRECTO);
                    }
                },
                actualizarElementoAtributoIncorrecto = function () {
                    if (!elemento) {
                        return;
                    }

                    if (presionado && incorrecto) {
                        CHA.addClass(elemento, CLASE_INCORRECTO);
                    } else {
                        CHA.removeClass(elemento, CLASE_INCORRECTO);
                    }
                },
                render = function (contenedor) {
                    var elemento_en_documento = document.getElementById(id);

                    if (elemento_en_documento === null) {
                        elemento = crearElemento(contenedor);
                    } else {
                        elemento = elemento_en_documento;
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);

                    actualizarElementoAtributoActivo();
                    actualizarElementoAtributoPresionado();
                    actualizarElementoAtributoCorrecto();
                    actualizarElementoAtributoIncorrecto();

                    // texto
                    if (texto !== null && document.getElementById(texto.getId()) === null) {
                        texto.render(elemento);
                    }

                    // ventana
                    if (ventana !== null) {
                        crearElementoVentana(contenedor);
                    }

                    return elemento;
                },
                desactivar = function () {
                    activo = false;
                    actualizarElementoAtributoActivo();
                },
                activar = function () {
                    activo = true;
                    actualizarElementoAtributoActivo();
                },
                presionar = function () {
                    presionado = true;
                    actualizarElementoAtributoPresionado();
                },
                relajar = function () {
                    presionado = false;
                    actualizarElementoAtributoPresionado();
                },
                setPresionadoCorrecto = function () {
                    correcto = true;
                    incorrecto = false;

                    presionar();
                    desactivar();

                    actualizarElementoAtributoCorrecto();
                },
                setPresionadoIncorrecto = function () {
                    correcto = false;
                    incorrecto = true;

                    presionar();
                    desactivar();

                    actualizarElementoAtributoIncorrecto();
                },
                init = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; };

                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);

                    cfg.numFrames = 6;
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);

                    if (estaDefinido(cfg.texto)) {
                        if (!estaDefinido(cfg.TEXTO)) { cfg.TEXTO = {}; };
                        cfg.TEXTO.texto = cfg.texto;
                    }

                    if (estaDefinido(cfg.tamTexto)) {
                        if (!estaDefinido(cfg.TEXTO)) { cfg.TEXTO = {}; };
                        cfg.TEXTO.tamTexto = cfg.tamTexto;
                    }

                    // si se especifican coordenadas de TEXTO,
                    // se elimina la CLASE_TEXTO para evitar centrado por css
                    // y haga caso a las coordenadas
                    if (estaDefinido(cfg.TEXTO.x) || estaDefinido(cfg.TEXTO.y)) {
                        cfg.TEXTO.CLASE_TEXTO = "";
                    }

                    if (estaDefinido(cfg.TEXTO)) { texto = new Ejercicio.TEXTO(id + "_texto", cfg.TEXTO); }

                    if (estaDefinido(cfg.estado)) {
                        switch (cfg.estado) {
                        case "desactivado":
                            desactivar();
                            break;

                        case "correcto":
                            setPresionadoCorrecto();
                            break;

                        case "incorrecto":
                            setPresionadoIncorrecto();
                            break;
                        }
                    }
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

            // presionar / relajar
            this.presionar = presionar;
            this.relajar = relajar;
            this.estaPresionado = function () {
                return presionado;
            };

            // correcto / incorrecto
            this.setPresionadoCorrecto = setPresionadoCorrecto;
            this.setPresionadoIncorrecto = setPresionadoIncorrecto;
            this.estaCorrecto = function () {
                return correcto;
            };

            this.getPosicionable = function () {
                return posicionable;
            };

            this.getPulsable = function () {
                return pulsable;
            };

//            this.getTexturizable = function () {
//                return texturizable;
//            };

            // Eventos publicos
            this.onPulsado = onPulsado;

            // inicializar
            init();
        };

    window.Ejercicio.BOTON = BOTON;
}());