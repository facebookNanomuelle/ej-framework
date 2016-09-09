/*global window, document, CHA, Ejercicio, EjercicioPadre*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.ComportamientoPosicionable porque window.Ejercicio no esta definido.");
        return;
    }

    var CLASE_CENTRADO = 'centrado',
        UNIDAD_PX = 'px',
        ComportamientoPosicionable = function (p_cfg) {
            var cfg = p_cfg,

                // posicionamiento relativo al contenedorz
                centrado = false,

                worldPos = {x: null, y: null},
                screenPos = {x: null, y: null},

                worldTam = {w: null, h: null},
                screenTam = {w: null, h: null},

                elemento = null,

                // metodos privados
                toScreenX = function (val_world) {
                    return Number(val_world) * EjercicioPadre.getScaleX();
                },
                toScreenY = function (val_world) {
                    return Number(val_world) * EjercicioPadre.getScaleY();
                },
                toWorldX = function (val_screen) {
                    return val_screen / EjercicioPadre.getScaleX();
                },
                toWorldY = function (val_screen) {
                    return val_screen / EjercicioPadre.getScaleY();
                },
                actualizarPosElemento = function () {
                    var style = elemento.style;

                    if (centrado) {
                        CHA.addClass(elemento, CLASE_CENTRADO);
                    } else {
                        CHA.removeClass(elemento, CLASE_CENTRADO);
                        style.left = Math.floor(screenPos.x) + UNIDAD_PX;
                        style.top = Math.floor(screenPos.y) + UNIDAD_PX;
                    }
                },
                recalcularScreenPos = function () {
                    if (isNaN(worldPos.x) || isNaN(worldPos.y)) {
                        screenPos.x = worldPos.x;
                        screenPos.y = worldPos.y;
                        centrado = true;
                    } else {
                        screenPos.x = toScreenX(worldPos.x);
                        screenPos.y = toScreenY(worldPos.y);
                        centrado = false;
                    }
                },
                setWorldPos = function (p_x, p_y) {
                    worldPos.x = p_x;
                    worldPos.y = p_y;

                    recalcularScreenPos();

                    if (elemento !== null) {
                        actualizarPosElemento();
                    }
                },
                setScreenPos = function (p_x, p_y) {
                    if (isNaN(p_x) || isNaN(p_y)) {
                        centrado = true;
                    } else {
                        screenPos.x = p_x;
                        screenPos.y = p_y;

                        worldPos.x = toWorldX(screenPos.x);
                        worldPos.y = toWorldY(screenPos.y);
                    }

                    if (elemento !== null) {
                        actualizarPosElemento();
                    }
                },
                actualizarTamElemento = function () {
                    var style = elemento.style;

                    if (!isNaN(screenTam.w)) {
                        style.width = Math.floor(screenTam.w) + UNIDAD_PX;
                    }

                    if (!isNaN(screenTam.h)) {
                        style.height = Math.floor(screenTam.h) + UNIDAD_PX;
                    }
                },
                recalcularScreenTam = function () {
                    if (isNaN(worldTam.w) || isNaN(worldTam.h)) {
                        screenTam.w = worldTam.w;
                        screenTam.h = worldTam.h;
                    } else {
                        screenTam.w = toScreenX(worldTam.w);
                        screenTam.h = toScreenY(worldTam.h);
                    }
                },
                setWorldTam = function (p_w, p_h) {
                    worldTam.w = p_w;
                    worldTam.h = p_h;

                    recalcularScreenTam();

                    if (elemento !== null) {
                        actualizarTamElemento();
                    }
                },
                posicionar = function (p_elemento) {
                    elemento = p_elemento;

                    recalcularScreenPos();
                    recalcularScreenTam();

                    actualizarPosElemento();
                    actualizarTamElemento();

                    return elemento;
                },
                reset = function () {
                    setWorldPos(cfg.x, cfg.y);
                    setWorldTam(cfg.w, cfg.h);
                },
                init = function () {
                    cfg.w = cfg.w || cfg.ancho;
                    cfg.h = cfg.h || cfg.alto;

                    reset();
                };

            // Metodos publicos
            this.posicionar = posicionar;

            this.getScreenPos = function () {
                return screenPos;
            };
            this.setScreenPos = setScreenPos;

            this.getWorldPos = function () {
                return worldPos;
            };
            this.setWorldPos = setWorldPos;

            this.getWorldTam = function () {
                return worldTam;
            };
            this.getScreenTam = function () {
                return screenTam;
            };

            this.reset = reset;

            init();
        };

    window.Ejercicio.ComportamientoPosicionable = ComportamientoPosicionable;
}());