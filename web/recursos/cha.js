/*global navigator, window, document, DEBUG, CHA, $*/
(function (window) {
    'use strict';

    var CHA = {};
    window.CHA = CHA;

    CHA.CallbackList = function () {
        var fn_list = [],
            isFunction = function (fn) {
                return (typeof fn === "function");
            },
            addFunction = function (fn) {
                fn_list.push(fn);
            },
            callFunctions = function (context, args) {
                var i = 0,
                    cuenta = fn_list.length;

                for (; i < cuenta; i++) {
                    fn_list[i].apply(context, args);
                }
            },
            reset = function () {
                fn_list = [];
            },
            callBackList = function (fn) {
                if (fn && isFunction(fn)) {
                    addFunction(fn);
                } else {
                    callFunctions(fn, Array.prototype.slice.call(arguments));
                }
            };

            callBackList.reset = reset;

        return callBackList;
    };

    CHA.estaDefinido = function (p_var) {
        return typeof p_var !== 'undefined';
    };

    CHA.hasClass = function (elemento, p_clase) {
        if (!CHA.estaDefinido(elemento)) {
            return;
        }

//        return elemento.className.match(new RegExp('(\\s|^)' + p_clase + '(\\s|$)'));
        return (' ' + elemento.className + ' ').indexOf(' ' + p_clase.trim() + ' ') !== -1;
    };

    CHA.addClass = function (elemento, p_clase) {
        if (!CHA.estaDefinido(elemento)) {
            return;
        }

        if (!CHA.hasClass(elemento, p_clase)) {
            elemento.className += " " + p_clase;
        }
    };

    CHA.removeClass = function (elemento, p_clase) {
        if (!CHA.estaDefinido(elemento)) {
            return;
        }
        var exp = new RegExp("(\\s|^)" + p_clase + "(\\s|$)");
        elemento.className = elemento.className.replace(exp, ' ');
    };

    /**
     * Devuelve true si el objeto pasado por parametro es un array
     *
     * @param {type} un_objeto
     * @returns {Boolean}
     */
    CHA.asArray = function (un_objeto) {
        var empty_array = [];

        if (un_objeto === undefined) {
            return empty_array;
        }

        if (Object.prototype.toString.call(un_objeto) === '[object Array]') {
            return un_objeto;
        }

        return [un_objeto];
    };

    CHA.desordenarArray = function (lista) {
        var result = [],
            eleccion;

        while (lista.length > 0) {
            eleccion = Math.floor(Math.random() * lista.length);
            result.push(lista[eleccion]);
            lista.splice(eleccion, 1);
        }
        return result;
    };

    /**
     * Convierte una cadena decimal en una cadena hexadcimal
     * @param {type} cadenaDecimal
     * @returns {String}
     */
    CHA.DEC2HEX = function (cadenaDecimal) {
        var sCadenaHex = "";
        if (cadenaDecimal.length > 6) {
            cadenaDecimal = cadenaDecimal.substring(cadenaDecimal.length - 6, cadenaDecimal.length);
        }

        cadenaDecimal.substring(0, 2);
        sCadenaHex += parseInt(cadenaDecimal.substring(0, 2), 16);
        sCadenaHex += ", " + parseInt(cadenaDecimal.substring(2, 4), 16);
        sCadenaHex += ", " + parseInt(cadenaDecimal.substring(4, 6), 16);

        return sCadenaHex;
    };


    /**
     * Devuelve una cadena rellena de 0 a la izquierda de longitud size
     *
     * @param {type} num
     * @param {type} size
     * @returns {String|pad.s}
     */
    CHA.pad = function (num, size) {
        var s = String(num);

        while (s.length < size) {
            s = "0" + s;
        }

        return s;
    };

    /**
     *  Devuelve un color ficticio de un color aplicandole un alfa (para navegadores antiguos)
     *
     *  @param color - ("RRGGBB") - Color que se quiere convertir
     *  @param alfa - alfa que se quiere aplicar al color (0-100)
     */
    CHA.convertirColor = function (color, alfa) {
        // calcula la media aritmetica de los valores a y b (segun alfa)
        function media(a, b, alfa) {
            return Math.round(b + (a - b) / (100 / alfa));
        }

        // funcion que se asegura que todos los valores tengan dos cifras ('A' -> '0A')
        function format00(x) {
            if (x.length === 1) {
                return '0' + x;
            }

            return x;
        }

        // en principio el fondo es blanco, pero podria valer cualquier color
        var colorFondo = 'FFFFFF',

        // extraer los tres colores r + g + b, convirtiendolos a decimal
            rClr = Number('0x' + color.substr(0, 2)),
            gClr = Number('0x' + color.substr(2, 2)),
            bClr = Number('0x' + color.substr(4, 2)),

        // lo mismo para el fondo
            rFnd = Number('0x' + colorFondo.substr(0, 2)),
            gFnd = Number('0x' + colorFondo.substr(2, 2)),
            bFnd = Number('0x' + colorFondo.substr(4, 2)),

        // calcula los nuevos valores RGB
            rNv = format00(media(rClr, rFnd, alfa).toString(16)),
            gNv = format00(media(gClr, gFnd, alfa).toString(16)),
            bNv = format00(media(bClr, bFnd, alfa).toString(16));

        return rNv + gNv + bNv;
    };

    /*
     *  Formatea el texto para convertir * por saltos de linea
     *  @param txt - Texto que se quiere convertir
     *  @param charSalto - Caracter que se convertira en salto de linea (p.defecto *)
     */
    CHA.normalizedText = function (txt, charSalto) {
        var CHARSALTO_DEFECTO = "*",
            re;

        if (charSalto === undefined) {
            charSalto = CHARSALTO_DEFECTO;
        }

        if (charSalto === null || charSalto === "") {
            charSalto = CHARSALTO_DEFECTO;
        }

        re = new RegExp("\\$" + "\\" + charSalto, "g");
        txt = txt.replace(re, "%%%%0000%%");
        txt = txt.split(charSalto).join("<br>");
        txt = txt.replace(/\%\%\%\%0000\%\%/g, charSalto);

        return txt;
    };

    /*
    * Funcion que cambia caracteres de escape del ibook, por html
    * Ejemplo "$B TEXTO /B" -> <span class='bold'> TEXTO </span>
    */
    CHA.changeTags = function (cadena) {

        if (!cadena) {
            return "";
        }

//        cadena = cadena.replace(/ /g, "&nbsp;");
        cadena = cadena.replace(/ /g, "&emsp14;");

        cadena = cadena.replace(/\$\#/, "%%%%0001%%");
        cadena = cadena.replace(/\$\//g, "%%%%0002%%");
        cadena = cadena.replace(/\$\$/g, "%%%%0003%%");

        // TODO - Mirar funcion normalizedText (javi) para que pueda meter un $*.

        cadena = cadena.replace(/\$B/g, "<span class='bold'>");
        cadena = cadena.replace(/\/B/g, "</span>");

        cadena = cadena.replace(/\$I/g, "<span class='italic'>");
        cadena = cadena.replace(/\/I/g, "</span>");

        cadena = cadena.replace(/\$U/g, "<span class='underline'>");
        cadena = cadena.replace(/\/U/g, "</span>");

        cadena = cadena.replace(/\$Sp/g, "<sup>");
        cadena = cadena.replace(/\/Sp/g, "</sup>");

        cadena = cadena.replace(/\$Sb/, "<sub>");
        cadena = cadena.replace(/\/Sb/, "</sub>");

        cadena = cadena.replace(/\$F\#/g, "<span style='color:%%%%0001%%");
        cadena = cadena.replace(/\#/g, ";'>");
        cadena = cadena.replace(/\/F/g, "</span>");

        cadena = cadena.replace(/\%\%\%\%0003\%\%/g, "$");
        cadena = cadena.replace(/\%\%\%\%0002\%\%/g, "/");
        cadena = cadena.replace(/\%\%\%\%0001\%\%/g, "#");

        // Añadir tambien $Sp Y $Sb como SuperIndice y SubIndice (Hecho)
        // texto: este texto es $F# 00FF00  #  verde /F y este es                 $F#FF0000 #  rojo  /F      y este normal
        //<span style='color:      #000FF00 '> verde </span><span style='color:      #00FF00 '> rojo  </span>
        // este texto es $F#00FF00#verde/F y este es $F#FF0000#rojo/F y este normal

        return cadena;
    };

    CHA.makeUnselectable = function ($target) {
        $target
            .addClass('unselectable') // All these attributes are inheritable
            .attr('unselectable', 'on') // For IE9 - This property is not inherited, needs to be placed onto everything
            .attr('draggable', 'false') // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
            .on('dragstart', function () { return false; });  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS

        $target // Apply non-inheritable properties to the child elements
            .find('*')
            .attr('draggable', 'false')
            .attr('unselectable', 'on');
    };

    if (DEBUG) {
        CHA.console = function (info) {
            if (window.console) {
                window.console.log(info);
            }
        };
    }

    // String.trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
}(window));

// CHA loadScript
(function (CHA) {
    'use strict';

    CHA.loadScript = function (url, callback, onerrorCallback) {
        var script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) { // IE10
            script.onreadystatechange = function () {
//                if (script.readyState === "loaded" || script.readyState === "complete") {
                if (script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  // IE11+ and Others
            script.onload = function () {
                callback();
            };
        }

        script.onerror = function () {
            onerrorCallback();
        };

        script.src = url;
        document.body.appendChild(script);
    };
}(CHA));

// CHA Sound
//(function (CHA, null_mp3) {
(function (CHA) {
    'use strict';

    var $sound_buffer = null,
        urlToId = function (url) {
            return url.replace(/\/|\./g, "_");
        },
        getAudioByUrl = function (url) {
            var $audio = $("audio[src='" + url + "']", $sound_buffer);

            if ($audio.length > 0) {
                return $audio[0];
            }

            return null;
        },
        errorSoundCallback = function () {
            var $audio = $(this),
                urls = $audio.data('urls');

            if (!CHA.estaDefinido(urls) || urls.length === 0){
                $audio.remove();
                return;
            }

            $audio
                .attr('src', urls.shift())
                .data('urls', urls);
        },
        loadSound = function (urls, onCanplayCallback, onEndedCallback) {
            var audio = document.createElement('audio');

            if (typeof onCanplayCallback === 'function') {
                if (audio.addEventListener) {
                    audio.addEventListener('canplay', onCanplayCallback);
                } else { // IE8 fix
                    audio.attachEvent('canplay', onCanplayCallback);
                }
            }

            if (typeof onEndedCallback === 'function') {
                $(audio)
                    .on('pause', onEndedCallback);
//                    .on('ended', onEndedCallback);
            }

            audio.preload = "auto";
            $(audio)
                .attr('id', urlToId(urls[0]))
                .on('error', function () {
                    errorSoundCallback();
                    if (typeof onEndedCallback === 'function') {
                        onEndedCallback();
                    }
                })
                .attr('src', urls.shift())
                .data('urls', urls);

            $sound_buffer.append(audio);

            if (audio.load) { // IE8 does not support load
                audio.load();
            }

            return audio;
        },
        stopAll = function () {
            $.each($("audio"), function () {
                var sound = $(this)[0];
                if (sound.pause) { // IE8 does not support pause
                    sound.pause();
                }
            });
        };
    CHA.preloadAudio = function (sources) {
        var urls = CHA.asArray(sources),
            i = 0,
            cuenta = urls.length,
            audio;

        for (; i < cuenta; i++) {
            audio = getAudioByUrl(urls[i]);
            if (audio === null) {
                loadSound([urls[i]], false);
            }
        }
    };
    CHA.stopAudios = stopAll;
    CHA.autoPlaySound = function (sources, onEndedCallback) {
        var urls = CHA.asArray(sources),
            i = 0,
            cuenta = urls.length,
            audio = null;

        for (; i < cuenta; i++) {
            audio = getAudioByUrl(urls[i]);
            if (audio !== null) {
                break;
            }
        }

//        stopAll();
        if (audio === null) {
            loadSound(
                urls,
                function () {
                    $(this).off('error');
                    this.play();
                },
                onEndedCallback
            );
            return;
        }

        if (audio.load) { // IE8 does not support load
            audio.load();
        }

        $(audio)
            .off('pause')
//            .off('ended')
            .off('error');

        if (typeof onEndedCallback === 'function') {
            var callBackWrapper = function (e) {
//                DEBUG && console.log(e);

                onEndedCallback();
                $(audio)
                    .off('error', callBackWrapper)
                    .off('pause', callBackWrapper);
//                    .off('abort', callBackWrapper);
            };
            $(audio)
                .on('pause', callBackWrapper)
//                .on('ended', onEndedCallback)
                .on('error', callBackWrapper);
//                .on('abort', callBackWrapper);
        }
        audio.play();
    };

    $(document).ready(function () {
        // crear contenedor de audios si no existe
        $sound_buffer = $('#sound');

        if ($sound_buffer.length === 0) {
            $sound_buffer = $("<div id='sound'></div>");
            $sound_buffer.appendTo('body');
        }

        // En safari, solo suenan los audios una vez inicializados
        // por un evento lanzado por el usuario (p.e. touch)
        // Para minimizar este efecto, tocamos un audio 'mudo'
        // en el primer 'toque' de pantalla del usuario.
        //
        // Lo que ocurrira sera que el enunciado del ejercicio
        // no suena automaticamente tras la carga, sino que
        // solo sonara despues de que el usuario haya tocado
        // una vez la pantalla del ipad.
//        if (isSafari() && false) {
//            var handler = function (event) {
//                event.stopPropagation();
//                $('body').unbind('click', handler);
//                CHA.autoPlaySound(null_mp3);
//            };
//
//            $('body').bind('click', handler);
//        }
    });

//}(CHA, 'audio/null.mp3'));
}(CHA));