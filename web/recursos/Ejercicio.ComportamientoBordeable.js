/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.ComportamientoBordeable porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_COMPORTAMIENTO_BORDEABLE = "bordeable",
        UNIDAD_PX = "px",
        REDONDEAR_BORDES_SI = "si",
        ComportamientoBordeable = function (p_cfg) {
            var cfg = p_cfg,

                color = null,

                screenRadio = null,
                screenGrosor = null,

                worldRadio = null,
                worldGrosor = null,

                alpha = null,

                toScreenX = function (val_world) {
                    return Number(val_world) * EjercicioPadre.getScaleX();
                },
                recalcularScreenRadio = function () {
                    if (isNaN(worldRadio)) {
                        screenRadio = worldRadio;
                    } else {
                        screenRadio = toScreenX(worldRadio);
                    }
                },
                recalcularScreenGrosor = function () {
                    if (isNaN(worldGrosor)) {
                        screenGrosor = worldGrosor;
                    } else {
                        screenGrosor = toScreenX(worldGrosor);
                    }
                },
                actualizarElemento = function (elemento) {
                    var style = elemento.style;

                    CHA.addClass(elemento, CLASE_COMPORTAMIENTO_BORDEABLE);

                    if (color !== null) {
                        elemento.style.borderColor = "rgba(" + CHA.DEC2HEX(color) + ", " + String(alpha) + ")";
                    }

                    if (!isNaN(screenRadio)) {
                        style.borderRadius = screenRadio + UNIDAD_PX;
                    }

                    if (!isNaN(screenGrosor)) {
                        style.borderWidth = screenGrosor + UNIDAD_PX;
                    }
                },
                bordear = function (elemento) {
                    recalcularScreenRadio();
                    recalcularScreenGrosor();

                    actualizarElemento(elemento);
                    return elemento;
                },
                reset = function () {
                    if (estaDefinido(cfg.colorBorde)) {
                        color = cfg.colorBorde;
                        alpha = 1.0;
                    }

                    if (estaDefinido(cfg.redondear)) {
                        var params = cfg.redondear.split(",");

                        if (params[0] === REDONDEAR_BORDES_SI && !isNaN(params[1])) {
                            worldRadio = Number(params[1]);
                        }

                        if (!isNaN(params[2])) {
                            worldGrosor = Number(params[2]);
                        }
                    }

                    if (!isNaN(cfg.alphaBorde)) {
                        alpha = Number(cfg.alphaBorde) / 100;
                    }
                },
                init = function () {
                    reset();
                };

            // metodos publicos
            this.bordear = bordear;

            // inicializar
            init();
        };

    window.Ejercicio.ComportamientoBordeable = ComportamientoBordeable;
}());