/*global window, document, DEBUG, CHA*/
(function () {
    'use strict';

    if (!window.CHA) {
        DEBUG && window.alert("Imposible definir CHA.domHelper porque CHA no esta definido.");
        return;
    }

    var DomHelper = function () {
        var TAG_DIV = "div",
            me = this,
            estaDefinido = CHA.estaDefinido;

        this.crearTag = function (p_tag, p_id, p_clase, p_cfg) {
            var elemento = document.createElement(p_tag);
            elemento.id = p_id;

            if (estaDefinido(p_clase)) {
                elemento.className = p_clase;
            }

            if (estaDefinido(p_cfg) && estaDefinido(p_cfg.clase)) {
                CHA.addClass(elemento, p_cfg.clase);
            }

            return elemento;
        };

        this.crearTagDiv = function (p_id, p_clase, p_cfg) {
            return me.crearTag(TAG_DIV, p_id, p_clase, p_cfg);
        };

        this.hasClass = function (elemento, p_clase) {
            if (!estaDefinido(elemento)) {
                return;
            }

            return (' ' + elemento.className + ' ').indexOf(' ' + p_clase.trim() + ' ') !== -1;
        };

        this.addClass = function (elemento, p_clase) {
            if (!estaDefinido(elemento)) {
                return;
            }

            if (!me.hasClass(elemento, p_clase)) {
                elemento.className += " " + p_clase;
            }
        };

        this.removeClass = function (elemento, p_clase) {
            if (!estaDefinido(elemento)) {
                return;
            }
            var exp = new RegExp("(\\s|^)" + p_clase + "(\\s|$)");
            elemento.className = elemento.className.replace(exp, ' ').trim();
        };

    };

    window.CHA.domHelper = new DomHelper();
}());
