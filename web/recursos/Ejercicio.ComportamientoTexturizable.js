/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.ComportamientoTexturizable porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        CLASE_COMPORTAMIENTO_TEXTURIZABLE = "texturizable",
        UNIDAD_PX = "px",
        FRAME_INICIAL = 0,
        NUM_FRAMES_DEFECTO = 1,
        INTERVAL_FONDO_ANIMADO_DEFECTO = 500,
        ComportamientoTexturizable = function (p_cfg) {
            var cfg = p_cfg,

                elemento = null,
                posicionable = null,

                color = null,
                colorFondo = null,
                transparencia = null,

                imagen = null,

                // fondo animado
                numFrames = NUM_FRAMES_DEFECTO,
                frame = FRAME_INICIAL,
                handlerFondoAnimado = null,
                intervalFondoAnimado = INTERVAL_FONDO_ANIMADO_DEFECTO,
                actualizarImagenElemento = function () {
                    if (elemento === null || imagen === null || elemento.style.backgroundImage === imagen) {
                        return;
                    }

                    var style = elemento.style,
                        ancho_contenedor = posicionable.getScreenTam().w,
                        alto_contenedor = posicionable.getScreenTam().h,
                        background_size = numFrames * ancho_contenedor;

                    style.backgroundImage = imagen;
                    style.width = Math.floor(ancho_contenedor) + UNIDAD_PX;
                    style.height = Math.floor(alto_contenedor) + UNIDAD_PX;
                    style.backgroundSize = background_size + UNIDAD_PX + " 100%";
                },
                actualizarFondoAnimadoElemento = function () {
                    if (!elemento || !posicionable) {
                        return;
                    }

                    var offset_x_imagen = - frame * posicionable.getScreenTam().w;
                    elemento.style.backgroundPosition = offset_x_imagen + UNIDAD_PX + " 0";
                },
                actualizarColorYTransparenciaElemento = function () {
                    var style = elemento.style;

                    if (color !== null) { style.color = color; }
                    if (colorFondo !== null) { style.backgroundColor = colorFondo; }
                    if (transparencia !== null) { style.opacity = transparencia; }
                },
                actualizarElemento = function () {
                    CHA.addClass(elemento, CLASE_COMPORTAMIENTO_TEXTURIZABLE);
                    actualizarColorYTransparenciaElemento();
                    actualizarImagenElemento();
                    actualizarFondoAnimadoElemento();
                    return elemento;
                },
                texturizar = function (p_elemento, p_posicionable) {
                    elemento = p_elemento;
                    posicionable = p_posicionable;

                    actualizarElemento();
                },
                construirAtributoUrl = function (p_nombre_imagen) {
                    if (estaDefinido(p_nombre_imagen)) {
                        return "url('" + EjercicioPadre.config.folder + p_nombre_imagen + "')";
                    }

                    return null;
                },
                construirAtributoColor = function (p_color) {
                    if (estaDefinido(p_color)) {
                        return '#' + p_color;
                    }

                    return null;
                },
                construirAtributoNumerico = function (p_transparencia, p_valor_por_defecto) {
                    if (!isNaN(p_transparencia)) {
                        return Number(p_transparencia);
                    }

                    if (estaDefinido(p_valor_por_defecto)) {
                        return p_valor_por_defecto;
                    }

                    return null;
                },
                setImagen = function (p_imagen) {
                    imagen = construirAtributoUrl(p_imagen);
                    actualizarImagenElemento();
                },
                reset = function () {
                    color = construirAtributoColor(cfg.color);
                    colorFondo = construirAtributoColor(cfg.colorFondo);
                    transparencia = construirAtributoNumerico(cfg.transparencia);
                    numFrames = construirAtributoNumerico(cfg.numFrames, NUM_FRAMES_DEFECTO);
                    intervalFondoAnimado = construirAtributoNumerico(cfg.tiempo, INTERVAL_FONDO_ANIMADO_DEFECTO);
                    setImagen(cfg.imagen);

                    detenerFondoAnimado();
                },
                init = function () {
                    reset();
                },
                setFrame = function (p_frame) {
                    frame = p_frame % numFrames;
                    actualizarFondoAnimadoElemento();
                },
                stepFondoAnimado = function () {
                    var siguiente_frame = frame + 1;
                    setFrame(siguiente_frame);
                },
                detenerFondoAnimado = function () {
                    frame = FRAME_INICIAL;
                    if (handlerFondoAnimado !== null) {
                        window.clearInterval(handlerFondoAnimado);
                        handlerFondoAnimado = null;
                    }
                    actualizarFondoAnimadoElemento();
                },
                animarFondoNVeces = function (p_num, p_callback) {
                    var i = 0,
                        cuenta = p_num * numFrames;

                    detenerFondoAnimado();
                    actualizarImagenElemento();

                    handlerFondoAnimado = window.setInterval(function () {
                        stepFondoAnimado();
                        i++;
                        if (i > cuenta) {
                            detenerFondoAnimado();
                            if (typeof p_callback === 'function') {
                                p_callback();
                            }
                        }
                    }, intervalFondoAnimado);
                },
                animarFondo = function () {
                    detenerFondoAnimado();
                    handlerFondoAnimado = window.setInterval(function () {
                        stepFondoAnimado();
                    }, intervalFondoAnimado);
                };

            // metodos publicos
            this.animarFondo = animarFondo;
            this.animarFondoNVeces = animarFondoNVeces;
            this.detenerFondoAnimado = detenerFondoAnimado;

            this.getFrame = function () {
                return frame;
            };

            this.setFrame = setFrame;

            this.setImagen = setImagen;
            this.texturizar = texturizar;

            // inicializar
            init();
        };

    window.Ejercicio.ComportamientoTexturizable = ComportamientoTexturizable;
}());