/*global window, document, CHA, Ejercicio*/
(function () {
    'use strict';

    if (!window.Ejercicio) {
        DEBUG && window.alert("Imposible definir Ejercicio.PROGRESO porque window.Ejercicio no esta definido.");
        return;
    }

    var estaDefinido = CHA.estaDefinido,
        crearTagDiv = Ejercicio.crearTagDiv,
        crearTag = Ejercicio.crearTag,

        CLASE_PROGRESO = "progreso",
        CLASE_FONDO = "fondoProgreso",
        CLASE_BARRA = "barraProgreso",
        CLASE_TIRADOR = "tiradorProgreso",
        CLASE_TEXTOS = "textosProgreso",
        CLASE_TEXTO_IZQUIERDA = "textoIzquierda",
        CLASE_TEXTO_DERECHA = "textoDerecha",

        SPAN = 'span',

        UNIDAD_PX = "px",

        PROGRESO = function (p_id, p_cfg) {
            var me = this,
                cfg = p_cfg,
                id = p_id,

                posicionable = null, // posicionamiento relativo al contenedor
                texturizable = null, // colores y fondos

                padding_x = 10,

                elemento_fondo = null,
                fondo_id = null,

                barra_id = null,
                barra_y = 20,
                barra_alto = 10,

                elemento_tirador = null,
                tirador_id = null,
                tirador_ancho = 16,
                tirador_alto = 20,

                elemento_textos = null,
                textos_id = null,
                textos_y = 35,
                textos_tam = 10,

                texto_izquierda_id = null,
                texto_derecha_id = null,

                valor = 0.0, // 0...1

                // eventos
                onValorSeleccionado = new CHA.CallbackList(),

                crearElemento = function (p_contenedor) {
                    var elemento = crearTagDiv(id, CLASE_PROGRESO, cfg),
                        barra = crearTagDiv(barra_id, CLASE_BARRA, cfg),
                        texto_izquierda = crearTag(SPAN, texto_izquierda_id, CLASE_TEXTO_IZQUIERDA, cfg),
                        texto_derecha = crearTag(SPAN, texto_derecha_id, CLASE_TEXTO_DERECHA, cfg);

                    elemento_fondo = crearTagDiv(fondo_id, CLASE_FONDO, cfg);
                    elemento_fondo.style.backgroundColor = "#" + cfg.fondoColor;
                    elemento.appendChild(elemento_fondo);

                    elemento_tirador = crearTagDiv(tirador_id, CLASE_TIRADOR, cfg);
                    elemento_tirador.style.backgroundColor = "#" + cfg.tiradorColor;
                    barra.appendChild(elemento_tirador);

                    barra.style.backgroundColor = "#" + cfg.barraColor;
                    elemento_fondo.appendChild(barra);

                    texto_izquierda.innerHTML = cfg.textoIzquierda;
                    texto_derecha.innerHTML = cfg.textoDerecha;

                    elemento_textos = crearTagDiv(textos_id, CLASE_TEXTOS, cfg);
                    elemento_textos.appendChild(texto_izquierda);
                    elemento_textos.appendChild(texto_derecha);
                    elemento.appendChild(elemento_textos);

//                    texturizable.crearTextura(elemento);

                    // pulsar sobre la barra de progreso
                    Ejercicio.ComportamientoPulsable(elemento_fondo, function (datos_evento) {
                        var x;

                        if (datos_evento.type === 'touchstart') {
                            x = datos_evento.originalEvent.changedTouches[0].clientX - $(elemento).offset().left;
                        } else {
                            x = datos_evento.offsetX;
                        }
                        setValor(x / posicionable.getScreenTam().w);
                        onValorSeleccionado(me);
                    });

                    if (estaDefinido(p_contenedor)) {
                        p_contenedor.appendChild(elemento);
                    }

                    return elemento;
                },
                setValor = function (p_valor) {
                    valor = p_valor;

                    var elemento = document.getElementById(barra_id);
                    if (elemento !== null) {
                        elemento.style.width = (valor * 100) + "%";
                    }
                },
                ajustarEscala = function () {
                    barra_y = EjercicioPadre.normalizedY(Number(cfg.barraY));
                    barra_alto = EjercicioPadre.normalizedY(Number(cfg.barraAlto));

                    tirador_alto = EjercicioPadre.normalizedX(Number(cfg.tiradorAlto));
                    tirador_ancho = EjercicioPadre.normalizedX(Number(cfg.tiradorAncho));

                    padding_x = (tirador_ancho / 2) + EjercicioPadre.normalizedX(2);

                    textos_y = EjercicioPadre.normalizedX(Number(cfg.textosY));
                    textos_tam = EjercicioPadre.normalizedFontSize(cfg.tamTexto);
                },
                render = function (contenedor) {
                    var elemento = document.getElementById(id),
                        style;

                    if (elemento === null) {
                        elemento = crearElemento(contenedor);
                    }

                    posicionable.posicionar(elemento);
                    texturizable.texturizar(elemento, posicionable);

                    ajustarEscala();

                    // progreso
                    elemento.style.padding = "0 " + padding_x + UNIDAD_PX;

                    // fondo progreso
                    style = elemento_fondo.style;
                    style.height = barra_alto + UNIDAD_PX;
                    style.marginTop = barra_y + UNIDAD_PX;

                    // tirador
                    style = elemento_tirador.style;
                    style.height = tirador_alto + UNIDAD_PX;
                    style.width = tirador_ancho + UNIDAD_PX;
                    style.right = -(tirador_ancho / 2) + UNIDAD_PX;
                    style.top = -(tirador_alto - barra_alto) / 2 + UNIDAD_PX;

                    // textos
                    style = elemento_textos.style;
                    style.marginTop = (textos_y - barra_y - barra_alto) + UNIDAD_PX;
                    style.fontSize = textos_tam + UNIDAD_PX;

                    return elemento;
                },
                initIds = function () {
                    if (estaDefinido(cfg.id)) { id = cfg.id; }
                    fondo_id = id + '_fondo';
                    barra_id = id + '_barra';
                    tirador_id = id + '_tirador';
                    textos_id = id + '_textos';
                    texto_derecha_id = id + "_texto_derecha";
                    texto_izquierda_id = id + "_texto_izquierda";
                },
                init = function () {
                    initIds();
                    posicionable = new Ejercicio.ComportamientoPosicionable(cfg);
                    texturizable = new Ejercicio.ComportamientoTexturizable(cfg);

                    // fondo
                    if (!estaDefinido(cfg.fondoColor)) { cfg.fondoColor = "999"; }

                    // barra
                    if (!estaDefinido(cfg.barraY)) { cfg.barraY = "20"; }
                    if (!estaDefinido(cfg.barraAlto)) { cfg.barraAlto = "10"; }
                    if (!estaDefinido(cfg.barraColor)) { cfg.barraColor = "ff0"; }

                    // tirador
                    if (!estaDefinido(cfg.tiradorAlto)) { cfg.tiradorAlto = "20"; }
                    if (!estaDefinido(cfg.tiradorAncho)) { cfg.tiradorAncho = "10"; }
                    if (!estaDefinido(cfg.tiradorColor)) { cfg.tiradorColor = "f93"; }

                    // textos
                    if (!estaDefinido(cfg.textosY)) { cfg.textosY = "35"; }
                    if (!estaDefinido(cfg.tamTexto)) { cfg.tamTexto = "10"; }
                };

            // Metodos publicos
            this.getId = function () {
                return id;
            };
            this.getCfg = function () {
                return cfg;
            };

            this.render = render;

            // valor
            this.getValor = function () {
                return valor;
            };

            this.setValor = function (p_valor) {
                setValor(p_valor);

                return this;
            };

            this.setTextoDerecha = function (p_texto) {
                cfg.textoDerecha = p_texto;

                var elemento = document.getElementById(texto_derecha_id);
                if (elemento !== null) {
                    elemento.innerHTML = cfg.textoDerecha;
                }
                return this;
            };
            this.setTextoIzquierda = function (p_texto) {
                cfg.textoIzquierda = p_texto;

                var elemento = document.getElementById(texto_izquierda_id);
                if (elemento !== null) {
                    elemento.innerHTML = cfg.textoIzquierda;
                }
                return this;
            };

            // Eventos publicos
            this.onValorSeleccionado = onValorSeleccionado;

            // inicializar
            init();
        };

    window.Ejercicio.PROGRESO = PROGRESO;
}());