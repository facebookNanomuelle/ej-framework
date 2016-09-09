/*global window, document, DEBUG, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.TECLADO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_TECLADO = "teclado",
        DISPOSICION_AZERTY = "AZERTY",
        DISPOSICION_QUERTY = "QUERTY",
        ANCHO_TECLA_DEFECTO = 40,
        ALTO_TECLA_DEFECTO = 40,
        CONFIG_QUERTY = {
            BOTON: [
                {id: 'tecla_q', columna: 1, fila: 1, TEXTO: {texto: 'Q' }, letra: 'q' },
                {id: 'tecla_w', columna: 2, fila: 1, TEXTO: {texto: 'W' }, letra: 'w' },
                {id: 'tecla_e', columna: 3, fila: 1, TEXTO: {texto: 'E' }, letra: 'e' },
                {id: 'tecla_r', columna: 4, fila: 1, TEXTO: {texto: 'R' }, letra: 'r' },
                {id: 'tecla_t', columna: 5, fila: 1, TEXTO: {texto: 'T' }, letra: 't' },
                {id: 'tecla_y', columna: 6, fila: 1, TEXTO: {texto: 'Y' }, letra: 'y' },
                {id: 'tecla_u', columna: 7, fila: 1, TEXTO: {texto: 'U' }, letra: 'u' },
                {id: 'tecla_i', columna: 8, fila: 1, TEXTO: {texto: 'I' }, letra: 'i' },
                {id: 'tecla_o', columna: 9, fila: 1, TEXTO: {texto: 'O' }, letra: 'o' },
                {id: 'tecla_p', columna: 10, fila: 1, TEXTO: {texto: 'P' }, letra: 'p' },

                {id: 'tecla_a', columna: 1.25, fila: 2, TEXTO: {texto: 'A' }, letra: 'a' },
                {id: 'tecla_s', columna: 2.25, fila: 2, TEXTO: {texto: 'S' }, letra: 's' },
                {id: 'tecla_d', columna: 3.25, fila: 2, TEXTO: {texto: 'D' }, letra: 'd' },
                {id: 'tecla_f', columna: 4.25, fila: 2, TEXTO: {texto: 'F' }, letra: 'f' },
                {id: 'tecla_g', columna: 5.25, fila: 2, TEXTO: {texto: 'G' }, letra: 'g' },
                {id: 'tecla_h', columna: 6.25, fila: 2, TEXTO: {texto: 'H' }, letra: 'h' },
                {id: 'tecla_j', columna: 7.25, fila: 2, TEXTO: {texto: 'J' }, letra: 'j' },
                {id: 'tecla_k', columna: 8.25, fila: 2, TEXTO: {texto: 'K' }, letra: 'k' },
                {id: 'tecla_l', columna: 9.25, fila: 2, TEXTO: {texto: 'L' }, letra: 'l' },

                {id: 'tecla_z', columna: 1.5, fila: 3, TEXTO: {texto: 'Z' }, letra: 'z' },
                {id: 'tecla_x', columna: 2.5, fila: 3, TEXTO: {texto: 'X' }, letra: 'x' },
                {id: 'tecla_c', columna: 3.5, fila: 3, TEXTO: {texto: 'C' }, letra: 'c' },
                {id: 'tecla_v', columna: 4.5, fila: 3, TEXTO: {texto: 'V' }, letra: 'v' },
                {id: 'tecla_b', columna: 5.5, fila: 3, TEXTO: {texto: 'B' }, letra: 'b' },
                {id: 'tecla_n', columna: 6.5, fila: 3, TEXTO: {texto: 'N' }, letra: 'n' },
                {id: 'tecla_m', columna: 7.5, fila: 3, TEXTO: {texto: 'M' }, letra: 'm' }

            ]
        },
        CONFIG_AZERTY = {
            BOTON: [
                {id: 'tecla_a', columna: 1, fila: 1, TEXTO: {texto: 'A' }, letra: 'a' },
                {id: 'tecla_z', columna: 2, fila: 1, TEXTO: {texto: 'Z' }, letra: 'z' },
                {id: 'tecla_e', columna: 3, fila: 1, TEXTO: {texto: 'E' }, letra: 'e' },
                {id: 'tecla_r', columna: 4, fila: 1, TEXTO: {texto: 'R' }, letra: 'r' },
                {id: 'tecla_t', columna: 5, fila: 1, TEXTO: {texto: 'T' }, letra: 't' },
                {id: 'tecla_y', columna: 6, fila: 1, TEXTO: {texto: 'Y' }, letra: 'y' },
                {id: 'tecla_u', columna: 7, fila: 1, TEXTO: {texto: 'U' }, letra: 'u' },
                {id: 'tecla_i', columna: 8, fila: 1, TEXTO: {texto: 'I' }, letra: 'i' },
                {id: 'tecla_o', columna: 9, fila: 1, TEXTO: {texto: 'O' }, letra: 'o' },
                {id: 'tecla_p', columna: 10, fila: 1, TEXTO: {texto: 'P' }, letra: 'p' },

                {id: 'tecla_q', columna: 1.25, fila: 2, TEXTO: {texto: 'Q' }, letra: 'q' },
                {id: 'tecla_s', columna: 2.25, fila: 2, TEXTO: {texto: 'S' }, letra: 's' },
                {id: 'tecla_d', columna: 3.25, fila: 2, TEXTO: {texto: 'D' }, letra: 'd' },
                {id: 'tecla_f', columna: 4.25, fila: 2, TEXTO: {texto: 'F' }, letra: 'f' },
                {id: 'tecla_g', columna: 5.25, fila: 2, TEXTO: {texto: 'G' }, letra: 'g' },
                {id: 'tecla_h', columna: 6.25, fila: 2, TEXTO: {texto: 'H' }, letra: 'h' },
                {id: 'tecla_j', columna: 7.25, fila: 2, TEXTO: {texto: 'J' }, letra: 'j' },
                {id: 'tecla_k', columna: 8.25, fila: 2, TEXTO: {texto: 'K' }, letra: 'k' },
                {id: 'tecla_l', columna: 9.25, fila: 2, TEXTO: {texto: 'L' }, letra: 'l' },
                {id: 'tecla_m', columna: 10.25, fila: 2, TEXTO: {texto: 'M' }, letra: 'm' },

                {id: 'tecla_w', columna: 1.5, fila: 3, TEXTO: {texto: 'W' }, letra: 'w' },
                {id: 'tecla_x', columna: 2.5, fila: 3, TEXTO: {texto: 'X' }, letra: 'x' },
                {id: 'tecla_c', columna: 3.5, fila: 3, TEXTO: {texto: 'C' }, letra: 'c' },
                {id: 'tecla_v', columna: 4.5, fila: 3, TEXTO: {texto: 'V' }, letra: 'v' },
                {id: 'tecla_b', columna: 5.5, fila: 3, TEXTO: {texto: 'B' }, letra: 'b' },
                {id: 'tecla_n', columna: 6.5, fila: 3, TEXTO: {texto: 'N' }, letra: 'n' }
            ]
        },
        TECLADO = function (p_id, p_cfg) {
            var me = this,
                cfg = p_cfg,
                id = p_id,

                disposicion = null,
                posicionable = null,
                texturizable = null,
                contenedor = null,

                // eventos
                onTeclaPulsada = new CHA.CallbackList(),

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_TECLADO, cfg);

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
                    }

                    return elemento;
                },
                getTecla = function (p_letra) {
                    return contenedor.getElemento('tecla_' + p_letra);
                },
                keyPressHandler = function (e) {
                    var letra = e.key.toLowerCase(),
                        tecla = getTecla(letra);

                    if (tecla !== null) {
                        onTeclaPulsada(tecla);
                    }
                },
                activarEventoKeypress = function () {
                    $(document)
                        .off('keypress', keyPressHandler)
                        .on('keypress', keyPressHandler);
                },
                render = function (p_contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(p_contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);
                    contenedor.render(elemento);

                    // eventos de teclado
                    activarEventoKeypress();

                    return elemento;
                },
                resetContenedor = function () {
                    var teclas,
                        i,
                        cuenta,
                        tecla,
                        onPulsadoHandler = function (p_boton) {
                            onTeclaPulsada(p_boton);
                        };

                    contenedor = new Ejercicio.ComportamientoContenedor(id, disposicion);

                    teclas = contenedor.getElementos();
                    cuenta = teclas.length;
                    for (i = 0; i < cuenta; i++) {
                        tecla = teclas[i];
                        tecla.onPulsado(onPulsadoHandler);
                    }
                },
                resetDisposicion = function () {
                    disposicion = cfg.disposicion === DISPOSICION_AZERTY ? CONFIG_AZERTY : CONFIG_QUERTY;
                    var anchoTecla = Number(cfg.anchoTecla),
                        altoTecla = Number(cfg.altoTecla),
                        i,
                        cuenta = disposicion.BOTON.length,
                        boton;

                    for (i = 0; i < cuenta; i++) {
                        boton = disposicion.BOTON[i];
                        boton.x = (boton.columna - 1) * anchoTecla;
                        boton.y = (boton.fila - 1) * altoTecla;
                        boton.w = anchoTecla;
                        boton.h = altoTecla;
                        boton.imagen = cfg.imagenTecla;

                        if (estaDefinido(cfg.fuente)) {
                            boton.TEXTO.fuente = cfg.fuente;
                        }

                        if (estaDefinido(cfg.tamTexto)) {
                            boton.TEXTO.tamTexto = cfg.tamTexto;
                        }

                        if (estaDefinido(cfg.xTexto)) {
                            boton.TEXTO.x = cfg.xTexto;
                        }

                        if (estaDefinido(cfg.yTexto)) {
                            boton.TEXTO.y = cfg.yTexto;
                        }
                    }
                },
                reset = function () {
                    resetDisposicion();
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);
                    resetContenedor();
                },
                init = function () {
                    cfg.disposicion = cfg.disposicion || DISPOSICION_QUERTY;
                    cfg.anchoTecla = cfg.anchoTecla || ANCHO_TECLA_DEFECTO;
                    cfg.altoTecla = cfg.altoTecla || ALTO_TECLA_DEFECTO;
                    reset();
                };

            // Metodos publicos
            this.reset = function () {
                reset();
            };

            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;

            this.setTeclaCorrecta = function (p_letra) {
                var tecla = getTecla(p_letra);
                tecla.setPresionadoCorrecto();
            };

            this.setTeclaIncorrecta = function (p_letra) {
                var tecla = getTecla(p_letra);
                tecla.setPresionadoIncorrecto();
            };

            // Eventos publicos
            this.onTeclaPulsada = onTeclaPulsada;

            // inicializar
            init();
        };

    window.Ejercicio.TECLADO = TECLADO;
}());