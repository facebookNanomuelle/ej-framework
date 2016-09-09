/*global $*/
var BotoneraEjercicio = function (p_ejercicio) {
    'use strict';

    var OPTION = "option",
        OPT_DISABLED = "disabled",
        OPT_LABEL = "label",

        BT_CHECK = "btCheck",
        BT_SOLUTIONS = "btSolutions",
        BT_RETRY = "btRetry",
        BT_RESET = "btReset",
        BT_CLOSE = "btClose",

        ejercicio = p_ejercicio,
        evaluacion = ejercicio.ej.config.EJERCICIO.evaluacion,

        isTouchSupported = window.hasOwnProperty('ontouchstart'),
        click_event = isTouchSupported ? 'touchstart' : 'mousedown',

        initBotonRetry = function () {
            var boton = document.getElementById(BT_RETRY);

            if (boton === null) {
                return;
            }

            if (evaluacion === EVALUACION.PARCIAL ||
                    EjercicioPadre.ej.nombreTipo === "test") {
                boton.parentNode.removeChild(boton);
                return;
            }

            // evaluacion global
            $(boton)
                .button()
                .button(OPTION, OPT_DISABLED, true)
                .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonReintentar)
                .off(click_event)
                .on(click_event, function () {
                    ejercicio.reintentar();
                });
        },
        initBotonSolutions = function () {
            var boton = document.getElementById(BT_SOLUTIONS);

            if (boton === null) {
                return;
            }

            if (evaluacion === EVALUACION.PARCIAL ||
                EjercicioPadre.ej.nombreTipo === "test") {
                boton.parentNode.removeChild(boton);
                return;
            }

            $(boton)
                .button()
                .button(OPTION, OPT_DISABLED, (ejercicio.config.solution_mode > ejercicio.EJ_SOLUTION_MODE.SIEMPRE))
                .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonSoluciones)
                .off(click_event)
                .on(click_event, function () {
                    ejercicio.mostrarSoluciones();
                });
        },
        initBotonCheck = function () {
            var boton = document.getElementById(BT_CHECK);

            if (boton === null) {
                return;
            }

            if (evaluacion === EVALUACION.PARCIAL ||
                    ejercicio.ej.config.EJERCICIO.mostrarBotonCheck !== "si") {
                boton.parentNode.removeChild(boton);
                return;
            }

            $(boton)
                .button()
                .button(OPTION, OPT_DISABLED, false)
                .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonComprobar)
                .off(click_event)
                .on(click_event, function () {
                    if (ejercicio.ej_status === ejercicio.EJ_STATUS.NORMAL) {
                        ejercicio.check();
                    } else {
                        ejercicio.mostrarRespuestasUsuario();
                    }
                });
        },
        initBotonReset = function () {
            var boton = document.getElementById(BT_RESET);

            if (boton === null) {
                return;
            }

            $(boton)
                .button()
                .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonReiniciar)
                .off(click_event)
                .on(click_event, function () {
                    if (EjercicioPadre.config.tipo === 'test') {
                        EjercicioPadre.reset();
                    } else {
                        ejercicio.reset();
                    }
                    init();
//                        $(BT_CHECK_ID)
//                            .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonComprobar)
//                            .button(OPTION, OPT_DISABLED, (ejercicio.config.check_mode === 1));
//
//                        $(BT_SOLUTIONS_ID)
//                            .button(OPTION, OPT_DISABLED, (ejercicio.config.solution_mode > ejercicio.EJ_SOLUTION_MODE.SIEMPRE));
                });
        },
        initBotonClose = function () {
            var boton = document.getElementById(BT_CLOSE);

            if (boton === null) {
                return;
            }

            $(boton)
                .button()
                .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonCerrar)
                .off(click_event)
                .on(click_event, function () {
                    Ejercicio.onClose();
                });
        },
        updateBotoneraEstadoNormal = function() {
            var boton_solutions = document.getElementById(BT_SOLUTIONS),
                boton_check = document.getElementById(BT_CHECK),
                boton_retry = document.getElementById(BT_RETRY);

            if (boton_solutions) {
                $(boton_solutions).button(OPTION, OPT_DISABLED, true);
            }

            if (boton_check) {
                $(boton_check).button(OPTION, OPT_DISABLED, false);
            }

            if (boton_retry) {
                $(boton_retry).button(OPTION, OPT_DISABLED, true);
            }
        },
        updateBotoneraEstadoChequeado = function () {
            var boton_check = document.getElementById(BT_CHECK),
                boton_solutions = document.getElementById(BT_SOLUTIONS),
                boton_retry = document.getElementById(BT_RETRY);

            if (ejercicio.config.configxml.intentosRestantes > 0) {
                $(boton_check).button(OPTION, OPT_DISABLED, true);

                if (ejercicio.config.solution_mode === ejercicio.EJ_SOLUTION_MODE.AL_COMPROBAR) {
                    // Enabled xq se ha pulsado comprobar (comprobar)
                    $(boton_solutions).button(OPTION, OPT_DISABLED, false);
                } else if (ejercicio.config.solution_mode === ejercicio.EJ_SOLUTION_MODE.AL_ACABAR) {
                    // Disabled xq quedan intentos
                    $(boton_solutions).button(OPTION, OPT_DISABLED, true);
                }

                // habilita el boton retry
                if (boton_retry) {
                    $(boton_retry).button(OPTION, OPT_DISABLED, false);
                }
            } else {
                // Ya no nos quedan intentos

                // cambia label boton check y lo deshabilita
                $(boton_check)
                    .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonMisSoluciones)
                    .button(OPTION, OPT_DISABLED, true);

                // deshabilita el boton Retry
                if (boton_retry) {
                    $(boton_retry).button(OPTION, OPT_DISABLED, true);
                }

                // Si el ejercicio no es 100% correcto, se habilita el boton soluciones
                if (boton_solutions) {
                    if (ejercicio.ej.percentCorrect() < 100) {
                        $(boton_solutions).button(OPTION, OPT_DISABLED, false);
                    }
                }
            }
        },
        updateBotoneraEstadoSoluciones = function () {
            var boton_check = document.getElementById(BT_CHECK),
                boton_solutions = document.getElementById(BT_SOLUTIONS);

            if (boton_check) {
                $(boton_check)
                    .button(OPTION, OPT_LABEL, ejercicio.config.configxml.textoBotonMisSoluciones)
                    .button(OPTION, OPT_DISABLED, false);
            }

            if (boton_solutions) {
                $(boton_solutions).button(OPTION, OPT_DISABLED, true);
            }
        },
        init = function () {
            initBotonReset();
            initBotonClose();
            initBotonCheck();
            initBotonSolutions();
            initBotonRetry();

            if (evaluacion === EVALUACION.GLOBAL) {
                ejercicio.onEstadoCambiado(function (datos_evento) {
                    switch (datos_evento.estadoActual) {
                    case ejercicio.EJ_STATUS.NORMAL:
                        updateBotoneraEstadoNormal();
                    break;

                    case ejercicio.EJ_STATUS.CHEQUEADO:
                        updateBotoneraEstadoChequeado();
                    break;

                    case ejercicio.EJ_STATUS.SOLUCIONES:
                        updateBotoneraEstadoSoluciones();
                    break;
                    }
                });
            }

            ejercicio.onEstadoCambiado(function (datos_evento) {
                var estadoActual = datos_evento.estadoActual;

                var boton_reset = document.getElementById(BT_RESET);
                if (boton_reset === null) {
                    return;
                }

                if (estadoActual !== ejercicio.EJ_STATUS.NORMAL &&
                        estadoActual !== ejercicio.EJ_STATUS.TERMINADO &&
                        estadoActual !== ejercicio.EJ_STATUS.RESUMEN &&
                        estadoActual !== ejercicio.EJ_STATUS.CHEQUEADO &&
                        estadoActual !== ejercicio.EJ_STATUS.SOLUCIONES &&
                        estadoActual !== ejercicio.EJ_STATUS.DESTRUIDO) {

                    $(boton_reset).button(OPTION, OPT_DISABLED, true);
                } else {
                    $(boton_reset).button(OPTION, OPT_DISABLED, false);
                }


            });
        },
        /**
         *  Funcion que cambia como se muestran los iconos de los botones del pie
         *  @param {type} miniVersion description
         */
        setFootBarIcons = function (miniVersion) {
            var configurarBoton = function (elemento_id, p_con_texto, p_icon) {
                var elemento = document.getElementById(elemento_id);

                    if (elemento === null) {
                        return;
                    }

                    $(elemento)
                        .button(OPTION, "text", p_con_texto)
                        .button({ icons: p_icon });
                },
                con_texto,
                icon;

            switch (miniVersion) {
            case 0: // normal
                con_texto = true;
                icon = { primary: ($(this).attr("icon"))};
                break;

            case 1: // solo texto
                con_texto = true;
                icon = {};
                break;

            case 2: // solo iconos
                con_texto = false;
                icon = { primary: ($(this).attr("icon"))};
                break;
            }

            configurarBoton(BT_RESET, con_texto, icon);
            configurarBoton(BT_CLOSE, con_texto, icon);
            configurarBoton(BT_CHECK, con_texto, icon);
            configurarBoton(BT_SOLUTIONS, con_texto, icon);
            configurarBoton(BT_RETRY, con_texto, icon);
        };

    // Metodos publicos
    this.update = function (p_contenedor) {
        var $contenedor = $(p_contenedor),
            w = $contenedor.width(),
            smallWidth,
            ui = ejercicio.config.ui;

        if (w <= ui.smallWidth[0]) {
            smallWidth = 2;
        } else if (w <= ui.smallWidth[1]) {
            smallWidth = 1;
        } else {
            smallWidth = 0;
        }

        setFootBarIcons(smallWidth);
    };

    // inicializacion
    init();
};