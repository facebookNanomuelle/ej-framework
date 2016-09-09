/*global DEBUG, window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.Pulsable porque window.Ejercicio no esta definido.");
        return;
    }

    var // estaDefinido = CHA.estaDefinido,
        TYPE_FUNCTION = "function",
        CLASE_PULSABLE = "pulsable",

        PROPERTY_ONTOUCHSTART = 'ontouchstart',
        EVENTO_TOUCHSTART = 'touchstart',
        EVENTO_MOUSEDOWN = 'mousedown',

        ComportamientoPulsable = function (p_elemento, onPulsadoHandler) {
            var elemento = p_elemento,
                nombre_evento = null,

                // eventos
                onPulsado = new CHA.CallbackList(),

                // metodos privados
                eventListener = function (datos_evento) {
                    datos_evento.preventDefault();

                    // lanzar evento propio
                    onPulsado(datos_evento);
                },
                activarPulsable = function () {
                    CHA.addClass(elemento, CLASE_PULSABLE);
                    elemento.addEventListener(nombre_evento, eventListener);
                },

                desactivarPulsable = function () {
                    CHA.removeClass(elemento, CLASE_PULSABLE);
                    elemento.removeEventListener(nombre_evento, eventListener);
                },

                init = function () {
                    var isTouchSupported = window.hasOwnProperty(PROPERTY_ONTOUCHSTART);
                    nombre_evento = isTouchSupported ? EVENTO_TOUCHSTART : EVENTO_MOUSEDOWN;

                    if (typeof onPulsadoHandler === TYPE_FUNCTION) {
                        onPulsado(onPulsadoHandler);
                    }

                    activarPulsable();
                };

            init();

            // eventos publicos
            this.onPulsado = onPulsado;
            this.destruir = desactivarPulsable;
            this.getNombreEventoGestionado = function () {
                return nombre_evento;
            };
        };

    window.Ejercicio.ComportamientoPulsable = ComportamientoPulsable;
}());