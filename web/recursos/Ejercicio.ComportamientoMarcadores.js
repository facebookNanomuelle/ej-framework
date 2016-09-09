/*global DEBUG, window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.Marcadores porque window.Ejercicio no esta definido.");
        return;
    }

    var // estaDefinido = CHA.estaDefinido,
        E_BODY = "ebody",

        ComportamientoMarcadores = function (p_contenedor, p_num_jugadores) {
            var num_jugadores = p_num_jugadores,
                index_jugador_actual = 0,

                contenedor = p_contenedor,

                // metodos privados
                getMarcadorPorJugador = function (p_index_jugador) {
                    var id_marcador = contenedor.getId() + "_MARCADOR" + p_index_jugador,
                        marcador = contenedor.getElemento(id_marcador);

                    return marcador;
                },
                getMarcadorActual = function () {
                    return getMarcadorPorJugador(index_jugador_actual);
                },
                reset = function () {
                    var i,
                        cuenta,
                        marcador;

                    index_jugador_actual = 0;
                    for (i = 0, cuenta = num_jugadores; i < cuenta; i++) {
                        marcador = getMarcadorPorJugador(i);
                        if (marcador !== null) {
                            marcador.reset();
                            if (i !== index_jugador_actual) {
                                marcador.desactivar();
                            } else {
                                marcador.activar();
                            }
                        }
                    }
                },
                cambiarTurno = function () {
                    // desactiva marcador actual
                    var marcador = getMarcadorActual();
                    if (marcador !== null) {
                        marcador.desactivar();
                    }

                    // siguiente jugador
                    index_jugador_actual = (index_jugador_actual + 1) % num_jugadores;

                    // activa marcador actual
                    marcador = getMarcadorActual();
                    if (marcador !== null) {
                        marcador.activar();
                    }
                },
                incrementarPuntuacion = function () {
                    var marcador = getMarcadorActual();
                    if (marcador !== null) {
                        marcador.incrementar();
                    }
                },
                init = function () {
                    reset();
                };

            init();

            // metodos publicos
            this.reset = reset;
            this.cambiarTurno = cambiarTurno;
            this.incrementarPuntuacion = incrementarPuntuacion;
        };

    window.Ejercicio.ComportamientoMarcadores = ComportamientoMarcadores;
}());