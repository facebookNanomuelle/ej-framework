/*global window, document, $, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.Arrastrable porque window.Ejercicio no esta definido.");
        return;
    }

    var // estaDefinido = CHA.estaDefinido,
        TAG_BODY = "body",
        ARRASTRABLE_SI = "si",
        ARRASTRABLE_INFANTIL = "infantil", // solo disponible en pc, se convierte en ARRASTRABLE_SI si se utiliza en dispositivos tactiles
        CLASE_ARRASTRABLE = "arrastrable",

        ComportamientoArrastrable = function (p_elemento, p_modo_arrastre) {
            var elemento = p_elemento,

                // posicion del elemento en coordenadas de pantalla
                x,
                y,

                // para arrastre infantil
                arrastrando = false,
                anclaX = 0,
                anclaY = 0,

                isTouchSupported = window.hasOwnProperty('ontouchstart'),
                modo_arrastre = p_modo_arrastre,

                // eventos
                onArrastrado = new CHA.CallbackList(),

                // metodos privados
                arrastrar = function (datos_evento) {
                    if (!arrastrando) {
                        return;
                    }

                    var offset = $(elemento).parent().offset();

                    x = parseInt(datos_evento.pageX - offset.left - anclaX, 10),
                    y = parseInt(datos_evento.pageY - offset.top - anclaY, 10);

                    elemento.style.left = x + "px";
                    elemento.style.top = y + "px";
                },
                noArrastrable = function () {
                    CHA.makeUnselectable($(elemento));
                },
                activarArrastrableNormal = function () {
                    CHA.addClass(elemento, CLASE_ARRASTRABLE);

                    $(elemento)
                        .draggable({
                            stop: function(event, ui) {
                                // lanza evento
                                var datos_evento = {
                                    x: ui.position.left,
                                    y: ui.position.top
                                };
                                onArrastrado(datos_evento);
                            }
                          });
                },
                terminarArrastreInfantil = function () {
                    arrastrando = false;
                    $(TAG_BODY).off('mousemove', arrastrar);

                    // lanza evento
                    var datos_evento = {
                            x: x,
                            y: y
                        };
                    onArrastrado(datos_evento);
                },
                iniciarArrastreInfantil = function (datos_evento) {
                    var nombre_evento = 'mousemove';

                    anclaX = datos_evento.offsetX;
                    anclaY = datos_evento.offsetY;

                    $(TAG_BODY).on(nombre_evento, arrastrar);

                    arrastrando = true;
                },
                activarArrastrableInfantil = function (datos_evento) {
                    var nombre_evento = 'mousedown';

                    CHA.addClass(elemento, CLASE_ARRASTRABLE);
                    $(elemento)
                        .on(nombre_evento, function (datos_evento) {
                            if (arrastrando) {
                                terminarArrastreInfantil();
                                return;
                            }
                            iniciarArrastreInfantil(datos_evento);
                        });
                },
                init = function () {
                    if (isTouchSupported && modo_arrastre === ARRASTRABLE_INFANTIL) {
                        modo_arrastre = ARRASTRABLE_SI;
                    }

                    switch (modo_arrastre) {
                    case ARRASTRABLE_SI:
                        activarArrastrableNormal();
                        break;

                    case ARRASTRABLE_INFANTIL:
                        activarArrastrableInfantil();
                        break;

                    default:
                        noArrastrable();
                        break;
                    }
                };

            init();

            // eventos publicos
            this.onArrastrado = onArrastrado;
        };

    window.Ejercicio.ComportamientoArrastrable = ComportamientoArrastrable;
}());