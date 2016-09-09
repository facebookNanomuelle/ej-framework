/*global window, $ */

/*
 * Funciones miguel
 */

var iLastTime = 0,
    aTiempos = [];

/*
 * alert para poder controlar desde un sitio centralizado todo el modo DEBUG
 */
function myAlert(obj) {
    'use strict';
    window.alert(obj);
}

function tiempoCarga() {
    'use strict';

    var date = new Date(),
        mls = date.getTime();

    if (iLastTime === 0) {
        iLastTime = mls;
    }

    aTiempos.push(mls - iLastTime);
    iLastTime = mls;
}

function tiempoCargaVer() {
    'use strict';
    myAlert(aTiempos);
}

/**
 *
 * creaDebug
 *
 * Funcion que crea el html para mostrar la consola de debug
 */
function creaDebug() {
    'use strict';
    return;
//    //Comprobamos si existe elemento
//    if (!$("#dbg").length)
//    {
//        var htmlDebug="\
//<div id='dbg-on'>\n\
//<div id='dbg-head'>\n\
//    <ul id='dbg-menu-head' class='dbg-buttons'>\n\
//        <li><a id='dbg-item-close' href='#'>[X]</a></li><li><a id='dbg-item-consola'>Consola</a></li><li><a id='dbg-item-tools'>Tooools</a></li>\n\
//    </ul>\n\
//</div>\n\
//<div id='dbg-consola'>\n\
//    <div class='dbg-titles'>\n\
//        <ul id='dbg-menu-consola' class='dbg-buttons'></ul>\n\
//    </div>\n\
//    <div id='dbg-content' class='dbg-content'>\n\
//        <span class='dbg-content-title'>Titulo del contenido</span>\n\
//        <textarea cols='30' rows='15' id='dbg-content-text'></textarea>\n\
//    </div>\n\
//</div>\n\
//<div id='dbg-tools'>\n\
//    <div class='dbg-titles'>\n\
//        <ul id='dbg-menu-tools' class='dbg-buttons'>\n\
//            <li><a id='dbg-item-JSON' href='#'>JSON-Ej</a></li>\n\
//            <li><a id='dbg-item-ejStatus' href='#'>ActualStatus</a></li>\n\
//            <li><a id='dbg-item-config' href='#'>Config</a></li></ul>\n\
//            </ul>\n\
//    </div>\n\
//    <div id='dbg-content2' class='dbg-content'>\n\
//        <span class='dbg-content-title'>Titulo</span>\n\
//        <input id='dbg-input-tool' type='text'><input id='dbg-button-tool' type='button' value='AddItem'>\n\
//    </div>\n\
//</div>\n\
//</div>";
//
//
//
//        //Añadimos la consola a la página
//        var capa = $("<div />",
//        {
//            id: "dbg"
//        });
//        capa.html(htmlDebug);
//        capa.appendTo("body");
//
//
//        //Boton para cerrar la consola
//        var aClose = $("#dbg-item-close");
//        aClose.click(function() {
//            $("#dbg").hide();
//        });
//
//        //Boton para Añadir elementos
//        var aAddItem = $("#dbg-button-tool");
//        aAddItem.click(function(){
//           addItemConsola(eval($("#dbg-input-tool").val()), $("#dbg-input-tool").val(), false);
//           //alert (eval($("#dbg-input-tool").val()));
//        });
//
//
//        //Mover la consola
//        $("#dbg").draggable();
//        $("#dbg").resizable({ cancel: ".dbg-content-text .dbg-input-tool" });
//
//    }
}

/*
 *
 * Funcion que añade la estructura y datos de un objeto a la consola
 *
 * @param obj - Objeto
 * @param sTitle - Titulo para mostrar del objeto
 * @param bNoRecursivo (bool) - Si se quiere mostrar recursivamente la estructura de todos
 *                              los objetos contenidos por el objeto a mostrar
 *
*/

function addItemConsola(obj, sTitle, bNoRecursivo) {
    'use strict';

    if (!$("#dbg").length) {
        creaDebug();
    }

    var num = $("#dbg-menu-consola").children().length,
        itemLi = $("<li />"),
    /*
    var itemSpan= $("<span />",
    {
        id: "dbg-close-" + num,
        text: "[X]",
        click: function (e) {
            //myAlert ();
        }
    });
    */

        itemA = $("<a />", {
            id: "dbg-item-" + num, //atributo directo, igual que si fuéramos con attr(?id?)
            //"class": "debug", //class entre comillas porque es una palabra reservada en javascript
            text: sTitle, //text no es un atributo sino una propiedad de jQuery, por ejemplo: .text("Lorem ipsum")
            href: "#",
    /*      css: //propiedad de jQuery
            {
                "position" : "absolute",
                "top" : "0px",
                "left" : "0px",
                "width" : "100px",
                "height" : "50px",
                "background-color" : "#FF00FF",
                "z-index" : "100",
                "visibility" : "visible",
                "font-size" : "50%"
            },
    */
            mousedown: function (e) { //evento de jQuery
                //Si esta pulsada la tecla ALT al hacer click lo borro de la consola
                if (e.altKey === true) {
                    $(this).parent().remove();
                    return true;
                }

                $("#dbg-content-title").html("----" + sTitle + "----");
                //var jsonStr = JSON.stringify(obj);

                //Si es jquery o lo pasamos por parametro no hacemos recursivo
                if (obj[0] || bNoRecursivo) {
                    $("#dbg-content-text").text(mediumDebug(obj));
                } else {
                   //$("#dbg-content-text").text(dump(obj));
                   $("#dbg-content-text").text(myDump(obj));
                }


                //var jsonStr = JSON.stringify(obj);


                $("#dbg-menu-consola").children(".selected").removeClass("selected");
                $(this).parent().addClass("selected");

                // Guardar en servidor
                $.ajax({
                    type: "POST",
                    url: "./debug/debug.php",
                    data: 'datos=' + $("#dbg-content-text").val()
                    //data: 'datos=' + jsonStr
                });

            } //Fin click
        });

    itemA.appendTo(itemLi);
    $("#dbg-menu-consola").append(itemLi);

    //"<li><a id='dbg-item-a'>Cuatro</a></li>"
}

function debugNotReferences(obj) {
    'use strict';
    var cache = [];

    JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });

    return cache;
//    cache = null; // Enable garbage collection
}

/**
 *  Recorre un objeto y devuelve su estructura sin recursividad
 *
 * @param obj - objeto que se quiere mostrar su estructura
 * @param bTab (bool) - Indica si se quiere tabular la cadena que devuelve la función
 * @return - Cadena con la estructura basica del objeto pasado
 */

function lightDebug(obj, bTab) {
    'use strict';

    var msg = '',
        property;

    if (bTab) {
        msg = '\t';
    }

    for (property in obj) {
        if (typeof obj[property] === 'function') {
            var inicio = obj[property].toString().indexOf('function'),
                fin = obj[property].toString().indexOf(')') + 1,
                propertyValue = obj[property].toString().substring(inicio, fin);

            msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
        } else if (typeof obj[property] === 'unknown') {
            msg += 'unknown ' + property + ' : unknown ;\n';
        } else {
            msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
            //myAlert (inspeccionar2(obj[property]));
        }

        if (bTab) {
            msg += '\t';
        }
    }

    return msg;
}

/*
 *  Recorre un objeto y devuelve su estructura (Si encuentra un objeto dentro de un objeto
 *  no lo recorre recursivamente, solo lo muestra)
 *
 *
 *
 */
function mediumDebug(obj) {
    'use strict';

    var msg = '',
        property,
        cad;

    for (property in obj) {
        if (typeof obj[property] === 'function') {
            var inicio = obj[property].toString().indexOf('function'),
                fin = obj[property].toString().indexOf(')') + 1,
                propertyValue = obj[property].toString().substring(inicio, fin);

            msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';

        } else if (typeof obj[property] === 'unknown') {
            msg += 'unknown ' + property + ' : unknown ;\n';

        } else if (typeof obj[property] === 'object') {
            cad = (typeof obj[property]) + ' ' + property + ' : ' + obj[property];
            //msg += (typeof obj[property])+' '+property+' : '+lightDebug(obj[property])+' ;\n';
            //msg +='\n'+ cad +' ;\n' + '*** INICIO ' + cad + '****\n{\n' + lightDebug(obj[property],true) + '}\n**** FIN ' + cad + ' *******\n';
            msg += cad + '{\n' + lightDebug(obj[property], true) + '\n}\n';
        } else {
            msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
            //myAlert (inspeccionar2(obj[property]));
        }

    }
    return msg;
}


/*
 * Recorre un objeto recursivamente y muestra su contenido en un myAlert
 *
 * @param obj (objeto que se quiere mostrar)
 * @param iTabs opcional (Tabulaciones iniciales)
 * @param titulo opcional (titulo a mostrar)
 *
 *
 */
function alertDumpFull(obj, iTabs, titulo) {
    'use strict';

    if (iTabs === null) {
        iTabs = 0;
    }

    if (titulo === null) {
        titulo = "";
    }

    var tempDump = myDump(obj, iTabs);

    myAlert(titulo + " - " + obj + " \n" + tempDump);
}

/*
 * Recorre un objeto y muestra su contenido en un myAlert (2 Niveles)
 *
 * @param obj (objeto que se quiere mostrar)
 *
 */
function alertDumpMedium(obj) {
    'use strict';

    var tempDump = mediumDebug(obj);
    myAlert("OBJECTO - " + obj + "\n" + tempDump);
}

function alertDumpLight(obj) {
    'use strict';

    var tempDump = lightDebug(obj, true);
    myAlert("OBJECTO - " + obj + "\n" + tempDump);
}



/**
 * Recorre un objeto recursivamente y  devuelve su estructura en un array de cadenas
 *
 * @param obj (objeto que se quiere mostrar)
 * @param iTabs2 (Tabulaciones iniciales)
 *
 * @return Array de cadenas que representan al objeto
 */

function myDump(obj, iTabs2) {
    'use strict';

    //  myAlert (iTabs2);
    if (isNaN(iTabs2)) {
        iTabs2 = 0;
    }


    if (iTabs2 === -1) {
        for (var property in obj) {
            alert("typeof obj[p]: " + typeof obj[property]);
            alert("obj[p]: " + obj[property]);
            alert("p: " + typeof obj[property]);

        }
    }

    var msg = new Array();

    // Nivel de recursividad
    if (iTabs2>9)
    {
        msg[msg.length]=vecesTexto(iTabs2)+ "[...]: " + typeof obj + " : " + lightDebug(obj)+'\n';
        return msg;
    }


    for (var property in obj)
    {
        //myAlert ("-:"+ typeof obj[property] +":-" + property);
        if (typeof obj[property] == 'function')
        {
            var inicio = obj[property].toString().indexOf('function');
            var fin = obj[property].toString().indexOf(')')+1;
            var propertyValue=obj[property].toString().substring(inicio,fin);
            msg[msg.length]=vecesTexto(iTabs2)+(typeof obj[property])+' '+property+' : '+propertyValue+' \n';
        }
        else if (typeof obj[property] == 'unknown')
        {
            msg[msg.length]= vecesTexto(iTabs2)+'unknown '+property+' : unknown \n';
        }
        else if (typeof obj[property] == 'string')
        {
            msg[msg.length]=vecesTexto(iTabs2)+("S:" + typeof obj[property])+' '+property+' : '+obj[property]+' \n';
        }
        else if (typeof obj[property] == 'number')
        {
            msg[msg.length]=vecesTexto(iTabs2)+("N:" + typeof obj[property])+' '+property+' : '+obj[property]+' \n';
        }
        else if (typeof obj[property] == 'boolean')
        {
            msg[msg.length]=vecesTexto(iTabs2)+("B:" + typeof obj[property])+' '+property+' : '+obj[property]+' \n';
        }
        else if (typeof obj[property] == 'object')
        {
            if (obj[property] !=null)
            {
                //iTabs2++;
                if (obj[property].length>0)
                {
                    /*   PROBAR

                    //myAlert (vecesTexto(iTabs2-1)+"Array Obj '"+ typeof obj[property][0] + "  XX  " + property + "' ("+obj[property].length+")\n");

                    msg[msg.length]=vecesTexto(iTabs2-1)+"Array Obj '" + property + "' ("+obj[property].length+")\n";

                    //TODO - Comprobar si obj[property].toSource() contiene jQuery12389471928347, saltar
                    msg[msg.length]=obj[property].toSource();

                    */
                    // OK
                    msg[msg.length]="\n"+vecesTexto(iTabs2)+"Array Obj '" + property + "' ("+obj[property].length+")\n";

                    //myAlert (obj[property].length);
                    for (var i=0;i<obj[property].length;i++)
                    {
                        //TODO - Separar si es un objeto o por ejemplo un STRING, BOOLEAN...
                        if (typeof obj[property][i]== 'object')
                            msg[msg.length]=vecesTexto(iTabs2)+("*" + property + "["+ i +"]"+ " ("+typeof obj[property][i]+'){' + '\n' + myDump (obj[property][i],iTabs2+1) + vecesTexto(iTabs2) + '}' ) + '\n';
                        else
                            msg[msg.length]=vecesTexto(iTabs2)+("(" + typeof obj[property][i])+') '+property+ "["+ i +"]"+' : '+obj[property][i]+'\n';
                        //myAlert (vecesTexto(iTabs2)+("\t*" + property + "["+ i +"]"+ " ("+typeof obj[property][i]+')\t{\n' +myDump (obj[property][i],iTabs2+1)+'}')+'\n');
                    }

                }
                else
                {
                    msg[msg.length]="\n"+vecesTexto(iTabs2)+("OBJETO: " + typeof obj[property]+' '+ property + '\n'+vecesTexto(iTabs2)+'{'+myDump (obj[property],iTabs2+1))+ vecesTexto(iTabs2) +'}\n';
                }
                //iTabs2--;
            }
            else
            {
                //myAlert("mallllllll");
                //myAlert(obj.toSource());
                //msg[msg.length]="\n"+vecesTexto(iTabs2)+("O: " + typeof obj[property]+'-'+ property + '\n' +myDump (obj[property],iTabs2+1))+'\n';
                msg[msg.length]=vecesTexto(iTabs2)+("O: " + typeof obj[property]+'-'+ property + ' : ' + obj[property])+'\n';
            //return null;
            //exit;
            }
        }
        else
        {
            //myAlert (typeof obj[property]);
            msg[msg.length]=vecesTexto(iTabs2)+("-:" + typeof obj[property])+' '+property+' : '+obj[property]+' \n';
        }
    }

    return msg;
}



/**
 *
 * @param iVeces (Tabuladores que se quieren)
 *
 * @return string '\t' repetida iVeces
 */


function vecesTexto(iVeces)
{
    var texto="";

   // myAlert ("Veces"+iVeces);
    for (var n=0;n<iVeces;n++)
    {
      texto += ''+' '+texto;
    }
    return texto;
}

/**
 * Funcion que crea un div id=debug para escribir lo que se le pase por parametro.
 * Requiere jQuery
 *
 * @param par1 (Texto que se quiere mostrar)
 */

function pinta (par1)
{
    //Comprobamos si existe elemento
    if (!$("#debug").length)
    {
        //myAlert ("Creando Debug - DobleClick para limpiar.");
        // Forma propuesta por jQuery
        var capa = $("<div />",
        {
            id: "debug", //atributo directo, igual que si fuéramos con attr(?id?)
            "class": "debug", //class entre comillas porque es una palabra reservada en javascript
            text: "-PINTA- DblClick limpiar -------\n", //text no es un atributo sino una propiedad de jQuery, por ejemplo: .text("Lorem ipsum")
            css: //propiedad de jQuery
            {
                "position" : "absolute",
                "top" : "0px",
                "left" : "0px",
                "width" : "100px",
                "height" : "50px",
                "background-color" : "#FF00FF",
                "z-index" : "100",
                "visibility" : "visible",
                "font-size" : "15%"
            },
            dblclick: function (e) { //evento de jQuery
                $(this).text("-------\n");
            }
        });
        capa.appendTo("body");
    }
    $("#debug").append("\n"+par1);
}



/////////////////////////////////////////////////////////


/**
* repeatString() returns a string which has been repeated a set number of times
*
*/


function repeatString(str, num) {
    out = '';
    for (var i = 0; i < num; i++) {
        out += str;
    }
    return out;
}

/**
dump() displays the contents of a variable like var_dump() does in PHP. dump() is
better than typeof, because it can distinguish between array, null and object.
Parameters:
  v:              The variable
  howDisplay:     "none", "body", "alert" (default)
  recursionLevel: Number of times the function has recursed when entering nested
                  objects or arrays. Each level of recursion adds extra space to the
                  output to indicate level. Set to 0 by default.
Return Value:
  A string of the variable's contents
Limitations:
  Can't pass an undefined variable to dump().
  dump() can't distinguish between int and float.
  dump() can't tell the original variable type of a member variable of an object.
  These limitations can't be fixed because these are *features* of JS. However, dump()
*/
function dump(v, howDisplay, recursionLevel) {
    howDisplay = (typeof howDisplay === 'undefined') ? "none" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
            /* there is absolutely no way in JS to distinguish 2 from 2.0
            so 'number' is the best that you can do. The following doesn't work:
            var er = /^[0-9]+$/;
            if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
                out = 'int';*/
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            //check if null
            if (v === null) {
                out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                        dump(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    //No way to know the original data type of member, since JS
                    //always converts it to a string and no other way to parse objects.
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre)
    }
    else if (howDisplay == 'alert') {
        alert(out);
    }

    return out;
}





/*

Estructura de la consola

    <div id="dbg">
        <div id="dbg-on"><a>X</a></div>
        <div id="dbg-head">
            <ul id="dbg-menu-head" class="dbg-buttons">
                <li><a id="dbg-item-consola">Consola</a></li>
                <li><a id="dbg-item-tools">Tools</a></li>
            </ul>
        </div>

        <div id="dbg-consola">
            <div class="dbg-titles">
                <ul id="dbg-menu-consola" class="dbg-buttons">
                    <li><a id="dbg-item-a">Cuatro</a></li>
                    <li><a id="dbg-item-b">Cinco</a></li>
                </ul>
            </div>
            <div id="dbg-content" class="dbg-content">
                <span id="dbg-content-title">Titulo</span>
                <textarea cols="40" rows="10" id="dbg-content-text">Texto</textarea>
            </div>
        </div>

        <div id="dbg-tools">
             <div class="dbg-titles">
                <ul id="dbg-menu-tools" class="dbg-buttons">
                    <li><a id="dbg-item-c">Seis</a></li>
                    <li><a id="dbg-item-d">Siete</a></li>
                </ul>
            </div>
        </div>
    </div>

*/

/*

TODO - Hacer el div tools
       - Que tenga una caja en el que escribas el nombre del objeto y un boton que haga myAlert sobre el
       - Caja con boton que haga un addItemConsola del objeto escrito en la caja.





/*

///////////////////////////////////

/*

function inspeccionar2(obj)
{
  var msg = new Array();

  for (var property in obj)
  {
    if (typeof obj[property] == 'function')
    {
      var inicio = obj[property].toString().indexOf('function');
      var fin = obj[property].toString().indexOf(')')+1;
      var propertyValue=obj[property].toString().substring(inicio,fin);
      msg[msg.length] = {'type' : (typeof obj[property]), 'name' : property, 'value' : propertyValue};
    }
    else if (typeof obj[property] == 'unknown')
    {
      msg[msg.length] = {'type' : 'unknown', 'name' : property, value : 'unknown'};
    }
    else
    {
      msg[msg.length] ={'type' : (typeof obj[property]), 'name' : property, 'value' : obj[property]};
    }
  }
  return msg;
}

function inspeccionar3(obj)
{

  var msg = '';

  for (var property in obj)
  {
    //myAlert ("-:"+ typeof obj[property] +":-" + property);
    if (typeof obj[property] == 'function')
    {
      var inicio = obj[property].toString().indexOf('function');
      var fin = obj[property].toString().indexOf(')')+1;
      var propertyValue=obj[property].toString().substring(inicio,fin);
      msg +=(typeof obj[property])+' '+property+' : '+propertyValue+' ;\n';
    }
    else if (typeof obj[property] == 'unknown')
    {
      msg += 'unknown '+property+' : unknown ;\n';
    }
    else if (typeof obj[property] == 'object')
    {
        if (obj[property].length>0)
        {
            msg +="Array Obj ["+obj[property].length+"]\n";

            for (i=0;i<obj[property].length;i++)
            {
                msg +=("*" + "["+ i +"]"+ "\t"+typeof obj[property][i]+' '+ property +' ' +inspeccionar (obj[property][i]))+' ;\n';
            }
        }
        else
        {
            msg +=("OBJETO: " + typeof obj[property]+' '+ property + '\n' +inspeccionar3 (obj[property]))+' ;\n';
        }

    }
    else
    {
      msg +=(typeof obj[property])+' '+property+' : '+obj[property]+' ;\n';
    }
  }
  return msg;
}

*/

function log(titulo,datos)
        {
           //alert ("Guardando:" + titulo + "\n" + datos); // Guardar en servidor
            $.ajax(
            {
                type: "POST",
                //url: "./debug/debug.php",
                url: "http://serviciosmedia.net/pruebas/scorm/web/debug/debug.php",
                data: 'titulo=' + titulo + "&" + 'datos=' + datos
                //data: 'datos=' + jsonStr
            });

        }

$(document).ready(function () {
    creaDebug();
});

