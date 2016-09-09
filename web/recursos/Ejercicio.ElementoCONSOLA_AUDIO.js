/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.CONSOLA_AUDIO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,

        EVENT_CANPLAY = 'canplay',
        EVENT_ERROR = 'error',
        EVENT_TIMEUPDATE = 'timeupdate',
        EVENT_ENDED = 'ended',
        EVENT_DURATIONCHANGE = 'durationchange',

        ATTR_ID = 'id',

        CLASE_CONSOLA_AUDIO = "consola_audio",

        CLASE_CAJA_PISTAS = "caja_pistas",
        CLASE_CAJA_BOTONES = "caja_botones",
        CLASE_CAJA_PROGRESO = "caja_progreso",

        CONSOLA_AUDIO = function (p_id, p_cfg) {
        //        DEBUG && CHA.console(debugUid() + "IMG(" + index + ")");

            var me = this,
                cfg = p_cfg,
                id = p_id,

                posicionable = null,
                texturizable = null,

                audio_id = id + "_audio",
                audio_duracion = null,

                // caja pistas
                caja_pistas = null,

                // caja botones
                caja_botones = null,
                caja_botones_id = id + "_cajabotones",
                boton_playpause_id = id + "_cajabotones_boton_playpause",
                boton_stop_id = id + "_cajabotones_boton_stop",

                // caja progreso
                caja_progreso = null,

                boton_play_pause = null,
                boton_stop = null,
                barra_progreso = null,

                // metodos privados
                crearElemento = function (p_contenedor) {
                    var elemento = Ejercicio.crearTagDiv(id, CLASE_CONSOLA_AUDIO, cfg);

//                    texturizable.crearTextura(elemento);

                    if (estaDefinido(p_contenedor)) { p_contenedor.appendChild(elemento); }
                    return elemento;
                },
                render = function (p_contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(p_contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento);

                    // caja botones
                    caja_botones.render(elemento);

                    // barra progreso
                    if (barra_progreso !== null) {
                        barra_progreso.render(elemento);
                    }

                    // audio
                    var audio = document.getElementById(audio_id);
                    if (audio === null) {
                        crearElementoAudio(p_contenedor);
                    }

                    return elemento;
                },
                initBarraProgreso = function () {
                    var cfg_barra_progreso = {
                        x: "100",
                        y: "0",
                        w: "200",
                        h: "50",
                        color: "000000",
                        colorFondo: "dddddd",
                        textoIzquierda: "Track 01"
                    };

                    barra_progreso = new Ejercicio.PROGRESO(id + "_progreso", cfg_barra_progreso);
                    barra_progreso.onValorSeleccionado(function () {
                        if (audio_duracion === null) {
                            return;
                        }

                        var audio = document.getElementById(audio_id);

                        audio.currentTime = barra_progreso.getValor() * audio_duracion;
                    });
                },
                stopAudio = function () {
                    var audio = document.getElementById(audio_id);

//                    CHA.removeClass(boton_play_pause, CLASE_BOTON_PRESIONADO);
                    boton_play_pause.relajar();

                    audio.pause();
                    audio.currentTime = 0;
                },
                onAudioCanPlay = function () {
                    // TODO: activar boton play/pause
                },
                onAudioError = function () {
                    // TODO: desactivar boton play/pause
                },
                formatearADosDecimales = function (p_num) {
                    return parseFloat(Math.round(p_num * 100) / 100).toFixed(2);
                },
                onAudioTimeUpdate = function (event_data) {
                    if (audio_duracion === null) {
                        return;
                    }

                    var audio = event_data.currentTarget;
                    barra_progreso.setValor(audio.currentTime / audio_duracion);
                    barra_progreso.setTextoDerecha(formatearADosDecimales(audio.currentTime) + "/" + formatearADosDecimales(audio_duracion));
                },
                onAudioEnded = function () {
                    stopAudio();
                },
                onDurationChange = function (event_data) {
                    var audio = event_data.currentTarget;
                    audio_duracion = audio.duration;
                },
                crearElementoAudio = function (contenedor) {
                    var audio = document.createElement('audio');

                    audio.preload = "auto";
                    audio.addEventListener(EVENT_CANPLAY, onAudioCanPlay);
                    audio.addEventListener(EVENT_ERROR, onAudioError);
                    audio.addEventListener(EVENT_TIMEUPDATE, onAudioTimeUpdate);
                    audio.addEventListener(EVENT_ENDED, onAudioEnded);
                    audio.addEventListener(EVENT_DURATIONCHANGE, onDurationChange);
                    audio.load();

                    audio.setAttribute(ATTR_ID, audio_id);
                    audio.setAttribute('src', EjercicioPadre.config.folder + cfg.audio);

                    contenedor.appendChild(audio);

                    return audio;
                },
                destruir = function () {
                    var audio = document.getElementById(audio_id),
                        element = document.getElementById(id);

                    if (audio !== null) {
                        audio.removeEventListener(EVENT_CANPLAY, onAudioCanPlay);
                        audio.removeEventListener(EVENT_ERROR, onAudioError);
                        audio.removeEventListener(EVENT_TIMEUPDATE, onAudioTimeUpdate);
                        audio.removeEventListener(EVENT_ENDED, onAudioEnded);
                        audio.removeEventListener(EVENT_DURATIONCHANGE, onDurationChange);
                    }

                    if (element !== null) {
                        element.parentNode.removeChild(element);
                    }
                },
                initBotonStop = function () {
                    boton_stop = caja_botones.getElemento(boton_stop_id);
                    boton_stop.onPulsado(function () {
                        stopAudio();
                    });
                },
                initBotonPlayPause = function () {
                    boton_play_pause = caja_botones.getElemento(boton_playpause_id);
                    boton_play_pause.onPulsado(function () {
                        var audio = document.getElementById(audio_id);

                        if (boton_play_pause.estaPresionado()) {
                            audio.pause();
                            boton_play_pause.relajar();
                        } else {
                            audio.play();
                            boton_play_pause.presionar();
                        }
                    });
                },
                initCajaBotones = function () {
                    var cfg_cajabotones = {
                        x: "0",
                        y: "0",
                        w: "100",
                        h: "50",
                        BOTON: [
                            // PLAY/PAUSE
                            {id: boton_playpause_id, x: "0", y: "0", w: "50", h: "50", color: "000000", colorFondo: "dddddd", imagen: "BOTON_PLAY_PAUSE.png"},
                            // STOP
                            {id: boton_stop_id, x: "50", y: "0", w: "50", h: "50", color: "000000", colorFondo: "dddddd", imagen: "BOTON_STOP.png"}
                        ]
                    };

                    caja_botones = new Ejercicio.VENTANA(caja_botones_id, cfg_cajabotones);
                    initBotonPlayPause();
                    initBotonStop();
                },
                init = function () {
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);

                    initCajaBotones();
                    initBarraProgreso();
                };

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };
            this.render = render;
            this.destruir = destruir;

            // inicializar
            init();
        };

    window.Ejercicio.CONSOLA_AUDIO = CONSOLA_AUDIO;
}());