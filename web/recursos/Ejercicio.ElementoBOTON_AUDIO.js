/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.BOTON_AUDIO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_BOTON_AUDIO = "audio",
        
        onAudioCanPlayHandler = function (event_data) {
            var audio_id = event_data.target.id,
                audio = document.getElementById(audio_id);

            if (audio !== null) {
                audio.boton.activar();
            }
        },
        onAudioErrorHandler = function (event_data) {
            var audio_id = event_data.target.id,
                audio = document.getElementById(audio_id);

            if (audio !== null) {
                audio.boton.desactivar();
            }
        },
        onStopAudioHandler = function (event_data) {
            var audio_id = event_data.target.id,
                audio = document.getElementById(audio_id);

            if (audio !== null) {
                audio.boton.relajar();

                if (audio.paused) {
                    return;
                }

                try {
                    audio.pause();
                    audio.currentTime = 0;

                } catch (e) {
                    // el audio no esta disponible, posiblmente por un resize
                }
            }
        },
        onPlayHandler = function (event_data) {
            var audio_id = event_data.target.id,
                audio = document.getElementById(audio_id);

            if (audio !== null) {
                audio.boton.presionar();
            }
        },
        enlazarEventosAudio = function (audio) {
            audio.addEventListener('canplay', onAudioCanPlayHandler);
            audio.addEventListener('error', onAudioErrorHandler);
//            audio.addEventListener('abort', onAudioErrorHandler);
            audio.addEventListener('ended', onStopAudioHandler);
            audio.addEventListener('pause', onStopAudioHandler);
            audio.addEventListener('play', onPlayHandler);
        },
        destruirEventosAudio = function (audio) {
            audio.removeEventListener('canplay', onAudioCanPlayHandler);
            audio.removeEventListener('error', onAudioErrorHandler);
//            audio.removeEventListener('abort', onAudioErrorHandler);
            audio.removeEventListener('ended', onStopAudioHandler);
            audio.removeEventListener('pause', onStopAudioHandler);
            audio.removeEventListener('play', onPlayHandler);
        },
        botonPlayPauseHandler = function (boton) {
            var reproducir_audio = !boton.estaPresionado(),
                audio = document.getElementById(boton.getAudioId());

            if (audio === null) {
                return;
            }

            if (reproducir_audio ) {
                CHA.stopAudios();
                audio.play();
            } else {
                audio.pause();
            }
        },
        crearElementoAudio = function (boton, contenedor) {
            var audio = document.createElement('audio');

            audio.preload = "auto";
            audio.setAttribute('id', boton.getAudioId());
            audio.setAttribute('src', boton.getCfg().audio);

            audio.boton = boton;

            contenedor.appendChild(audio);

            audio.load();
            return audio;
        },
        BOTON_AUDIO = function (p_id, p_cfg) {
            var cfg = p_cfg,
                id = p_id,

                audio_id = null,

                boton = null,

                // metodos privados
                crearElemento = function (contenedor) {
                    var elemento = boton.render(contenedor);
                    CHA.addClass(elemento, CLASE_BOTON_AUDIO);

                    return elemento;
                },
                render = function (contenedor) {
                    var elemento = document.getElementById(id);

                    if (elemento === null) {
                        elemento = crearElemento(contenedor);
                    }

                    // audio
                    var audio = document.getElementById(audio_id);
                    if (audio === null) {
                        audio = crearElementoAudio(boton, contenedor);
                        enlazarEventosAudio(audio);
                    }

                    return elemento;
                },
                init = function () {
                    // id
                    if (estaDefinido(cfg.id)) { id = cfg.id; };
                    audio_id = id + "_audio";

                    // audio
                    cfg.audio = EjercicioPadre.config.folder + cfg.audio;
                    CHA.preloadAudio(cfg.audio);

                    // boton
                    boton = new Ejercicio.BOTON(id, cfg);
                    boton.getAudioId = function () {
                        return audio_id;
                    };
                    boton.onPulsado(botonPlayPauseHandler);
                },
                destruir = function () {
                    var audio = document.getElementById(audio_id);
                    if (audio !== null) {
                        destruirEventosAudio(audio);
                        audio.parentNode.removeChild(audio);
                    };
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

            this.getBoton = function () {
                return boton;
            };

            // inicializar
            init();
        };

    window.Ejercicio.BOTON_AUDIO = BOTON_AUDIO;
}());