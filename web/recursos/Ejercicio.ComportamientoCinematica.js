/*global window, document, CHA, Ejercicio, EjercicioPadre*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.ComportamientoCinematica porque window.Ejercicio no esta definido.");
        return;
    }

    var // estaDefinido = CHA.estaDefinido,
        // UNIDAD_PX = 'px',
        // UNIDAD_PORCENTAJE = '%',
        ComportamientoCinematica = function (p_onDestinoAlcanzadoCallback, p_onRunningCallback) {
            var onDestinoAlcanzadoCallback = p_onDestinoAlcanzadoCallback,
                onRunningCallback = p_onRunningCallback,

                velocidad_escalar_world = null, // velocidad escalar en coordenadas world
                pos_final_world = null, // posicion final en coordenadas world
                pos_inicial_world = null, // posicion inicial en coordenadas world
                pos_world = null, // posicion actual en coordenadas world

                tiempoReferencia = Ejercicio.tiempoGlobal,
                cinematicaHandler = null,

                detener = function () {
                    if (cinematicaHandler === null) {
                        return;
                    }

                    window.clearInterval(cinematicaHandler);
                    cinematicaHandler = null;
                },
                calcularVectorVelocidad = function (p_alpha) {
                    return {
                        x: velocidad_escalar_world * Math.cos(p_alpha),
                        y: velocidad_escalar_world * Math.sin(p_alpha)
                    };
                },
                distancia = function (p1, p2) {
                    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
                },
                stepMove = function (posicionable, p_tiempo_transcurrido) {
                    var scale_x = EjercicioPadre.getScaleX(),
                        scale_y = EjercicioPadre.getScaleY(),
                        alpha = Math.atan2(pos_final_world.y - pos_inicial_world.y, pos_final_world.x - pos_inicial_world.x),
                        velocidad_vectorial_world = calcularVectorVelocidad(alpha),
                        pos_world = {
                            x: posicionable.getScreenPos().x / scale_x,
                            y: posicionable.getScreenPos().y / scale_y
                        },
                        distancia_antes_de_mover = distancia(pos_world, pos_final_world),
                        distancia_despues_de_mover;

                    // desplazar
                    pos_world = {
                        x: pos_world.x + velocidad_vectorial_world.x * p_tiempo_transcurrido,
                        y: pos_world.y + velocidad_vectorial_world.y * p_tiempo_transcurrido
                    };

                    distancia_despues_de_mover = distancia(pos_world, pos_final_world);

                    if (distancia_despues_de_mover > distancia_antes_de_mover) {
//                    if (distancia_al_objetivo <= DISTANCIA_DE_COLISION) {
                        distancia_despues_de_mover = 0;
                        pos_world.x = pos_final_world.x;
                        pos_world.y = pos_final_world.y;
                    }

                    posicionable.setWorldPos(pos_world.x, pos_world.y);
//                    posicionable.setScreenPos(pos_world.x * scale_x, pos_world.y * scale_y);

                    return distancia_despues_de_mover;
                },
                interceptar = function (posicionable, posicionable_objetivo, velocidadEscalar, restringir, offset_objetivo) {
                    var scale_x = EjercicioPadre.getScaleX(),
                        scale_y = EjercicioPadre.getScaleY(),
                        interceptarStep = function () {
                            var tiempoTranscurrido = Ejercicio.tiempoGlobal - tiempoReferencia,
                                distancia_al_objetivo;

                            if (tiempoTranscurrido <= 0.0) {
                                return;
                            }

                            scale_x = EjercicioPadre.getScaleX();
                            scale_y = EjercicioPadre.getScaleY();

                            pos_final_world = {
                                x: restringir === 'Y' ? posicionable.getWorldPos().x : (posicionable_objetivo.getScreenPos().x + offset_objetivo.x) / scale_x,
                                y: restringir === 'X' ? posicionable.getWorldPos().y : (posicionable_objetivo.getScreenPos().y + offset_objetivo.y) / scale_y
                            };

                            pos_inicial_world = {
                                x: posicionable.getScreenPos().x / scale_x,
                                y: posicionable.getScreenPos().y / scale_y
                            };

                            distancia_al_objetivo = stepMove(posicionable, tiempoTranscurrido);
                            tiempoReferencia = Ejercicio.tiempoGlobal;

                            if (typeof onRunningCallback === 'function') {
                                onRunningCallback();
                            }

                            if (distancia_al_objetivo === 0) {
                                detener();
                                if (typeof onDestinoAlcanzadoCallback === 'function') {
                                    onDestinoAlcanzadoCallback();
                                }
                            }
                        };

                    velocidad_escalar_world = velocidadEscalar / scale_x;

                    detener();

                    if (!CHA.estaDefinido(offset_objetivo)) {
                        offset_objetivo = {x: 0.0, y: 0.0};
                    }

                    tiempoReferencia = Ejercicio.tiempoGlobal;
                    cinematicaHandler = window.setInterval(interceptarStep, Ejercicio.TIME_INTERVAL);
                },
                animar = function (posicionable, pos_final_screen, velocidadEscalar, restringir, offset_objetivo) {
                    detener();

                    var scale_x = EjercicioPadre.getScaleX(),
                        scale_y = EjercicioPadre.getScaleY(),
                        animarStep = function () {
                            var tiempoTranscurrido = Ejercicio.tiempoGlobal - tiempoReferencia,
                                distancia_al_objetivo;

                            if (tiempoTranscurrido <= 0.0) {
                                return;
                            }

                            distancia_al_objetivo = stepMove(posicionable, tiempoTranscurrido);
                            tiempoReferencia = Ejercicio.tiempoGlobal;

                            if (typeof onRunningCallback === 'function') {
                                onRunningCallback();
                            }

                            if (distancia_al_objetivo === 0) {
                                detener();
                                if (typeof onDestinoAlcanzadoCallback === 'function') {
                                    onDestinoAlcanzadoCallback();
                                }
                            }
                        };

                    velocidad_escalar_world = Number(velocidadEscalar) / scale_x;

                    pos_inicial_world = {
                        x: posicionable.getScreenPos().x / scale_x,
                        y: posicionable.getScreenPos().y / scale_y
                    };

                    if (!CHA.estaDefinido(offset_objetivo)) {
                        offset_objetivo = {
                            x: 0.0,
                            y: 0.0
                        };
                    }

                    pos_final_world = {
                        x: (restringir === 'Y' ? posicionable.getScreenPos().x : (pos_final_screen.x + offset_objetivo.x)) / scale_x,
                        y: (restringir === 'X' ? posicionable.getScreenPos().y : (pos_final_screen.y + offset_objetivo.y)) / scale_y
                    };

                    tiempoReferencia = Ejercicio.tiempoGlobal;
                    cinematicaHandler = window.setInterval(animarStep, Ejercicio.TIME_INTERVAL);
                };

            // Metodos publicos
            this.detener = detener;
            this.animar = animar;
            this.interceptar = interceptar;
        };

    window.Ejercicio.ComportamientoCinematica = ComportamientoCinematica;
}());