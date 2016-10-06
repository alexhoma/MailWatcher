/**
 * Email Checker JS
 *
 * @description Validador y corrector de emails para Derecho.com
 * @see {@link https://gist.github.com/alexhoma/e3ea1a134dead1671011b4acb55b6522}
 *
 * @author alexhoma <alexcm.14@gmail.com>
 * @version 1.0.3
 */

var EmailChecker = function () {
    this.NAME = 'EmailChecker';
    this.VERSION = '1.0.3';
}

EmailChecker.prototype = {
    // Arrays con los dominios y tld's correctos
    whitelist: [
        'gmail', 'hotmail', 'yahoo', 'outlook', 'derecho'
    ],
    blacklist: [
        /*Gmail*/   'gemail', 'gmil', 'gmal', 'emai', 'gmai',
        /*Hotmail*/ 'hotmal', 'hormal', 'hormail', 'homail', 'hitmail', 'hotamail',
        /*Yahoo*/   'yaho', 'yahho', 'yahooo', 'yaaho',
        /*Outlook*/ 'outlok', 'oultook', 'utlook', 'outoolk'
    ],
    validTLDs: [ // TODO: implementar correcciones para los TLD's
        'es', 'com'
    ],

    /**
     * Initializer
     *
     * @param email
     * @returns {bool/string}
     *  -> bool (true): si el email no necdesita corrección
     *  -> string: email corregido
     */
    check: function (email) {
        var e = email.value;
        var restored;

        // Descomponemos email
        var extracted  = this.splitEmail(e);
        var user   = extracted.user;
        var domain = extracted.domain;
        var tld    = extracted.tld;

        // Validamos el email
        var validation = this.validationApproach(domain);
        if (validation) {
            return true;
        } else {
            restored = this.repairEmail(domain);
        }

        // Reconstruimos el email y modificamos el DOM
        if ( typeof restored !== "undefined" ) {
            var correctEmail = user + '@' + restored + '.' + tld;
            var putFinalEmail = email.value = correctEmail;
            return putFinalEmail;
        } else {
            return true;
        }
    },

    /**
     * Split email
     * Descompone los elementos variables de un correo email
     * @example
     *  // returns 'alex.martin', 'derecho', 'com'
     *
     * @param {string} e - email completo para que queremos separar
     * @returns {{
     *     user: string,
     *     domain: string,
     *     tld: string
     *   }} - email separado y serializado
     */
    splitEmail: function (e) {
        var domain;
        var tld;
        var user;
        var indexOfElement = e.indexOf("@");

        if (indexOfElement > -1) {
            user = e.split('@')[0];
            user = this.sanitize(user);

            domain = e.split('@')[1];
            domain = domain.split('.')[0];
            domain = this.sanitize(domain);

            tld = e.substr( indexOfElement, e.length );
            tld = tld.split('.')[1];
            tld = this.sanitize(tld);
        }

        return {
            user: user,
            domain: domain,
            tld: tld
        }
    },

    /**
     * Validation Approach
     * Comprobamos la validez del dominio obtenido
     *  -> 1st: Si coincide con un dominio de la whitelist
     *  -> 2nd: Si coincide con un dominio de la blacklist
     *  -> 3rd: Si tiene algun parecido con un dominio de la whitelist
     *
     * @param domain
     * @returns {bool} isValidEmail
     *  -> true:  es válido
     *  -> false: es inválido
     */
    validationApproach: function (domain) { // TODO: Es necesario refactorizar este proceso
        var blacklist = this.blacklist;
        var whitelist = this.whitelist;
        var isInBlacklist = false;
        var isValidEmail;
        var approach;

        // First approach: Comprobamos si coincide con algun dominio válido al 100%
        for (i = 0; i < whitelist.length; i++) {
            approach = this.levenshtein(whitelist[i], domain);
            if (approach == 0) {
                isValidEmail = true;
                break;
            }
        }

        // Second approach: Comprueba si el 'dominio' figura en nuestro "blacklist" de dominios erróneos
        if (typeof isValidEmail == 'undefined') {
            for (i = 0; i < blacklist.length; i++) {
                if ( blacklist[i] == domain ) {
                    isValidEmail = false;
                    isInBlacklist = true;
                    break;
                }
            }
        }

        // Third approach: Comprueba si el email tiene alguna coincidencia con los posibles emails válidos
        // TODO: Esta aproximación puede generar conflictos al corregir emails que no tienen por qué ser erróneos
        //       Añadir un recomendador en estos casos en vez de sanearlo directamente
        //       "Quizás quiso decir.."
        if (typeof isValidEmail == 'undefined' && domain.length > 5) { // filtro por longitud de cadena para acotar aproximación
            var distance;
            for (i = 0; i < whitelist.length; i++) {
                // calculamos la proximidad de cadenas --> máximo un dígito
                distance = Math.round(whitelist[i].length - domain.length);
                if (distance >= -1 && distance <= 1) {
                    // calculamos aproximación levenshtein
                    approach = this.levenshtein(whitelist[i], domain);
                    if (approach >= 1 && approach <= 2) {
                        isValidEmail = false;
                        break;
                    }
                }
            }
        }

        // Approach conclusion
        if (typeof isValidEmail == 'undefined') {
            console.log('El email no figura en nustra lista de emails válidos. Pero es muy probable que sea correcto.');
            return isValidEmail = true;
        } else {
            return isValidEmail;
        }
    },

    /**
     * Corrector de emails
     * Compara el dominio con el más parecido
     * de la whitelist y lo sustituye.
     *
     * @param   {string} toRepair - email a reparar
     * @returns {string} restored - email reparado
     */
    repairEmail: function (toRepair) {
        var restored;
        var approach;
        var matches = [];

        // Comparamos el email a reparar contra los emails válidos para sustituirlo
        for (i = 0; i < this.whitelist.length; i++) {
            approach = this.levenshtein(this.whitelist[i], toRepair);
            if (approach >= 1 && approach <= 2) {
                matches.push(this.whitelist[i]);
            }
        }

        // Comprobamos si hay más de un matching con los emails válidos
        if (!matches.length == 0) {
            if (matches.length == 1) {
                restored = matches[0];
            } else {
                // TODO: implementar un matching más preciso para que no ocurran estos casos.
                console.log('Hay más de un email válido que coincide con la corrección. Por tanto no lo vamos a corregir.')
            }
        } else {
            throw new Error('Unknown error: no matches for this email.');
        }

        return restored;
    },

    /**
     * Distancia de Levenshtein
     * Comparación por similitud de cadenas
     * Core de la funcionalidad
     * @see {@link https://es.wikipedia.org/wiki/Distancia_de_Levenshtein}
     *
     * @param s
     * @param t
     * @returns {int}
     *  -> numero de operaciones que necesita la función
     *     para que las dos strings sean iguales
     *  -> cuanto más grande, menos parecidas son
     */
    levenshtein: function(s, t) {
        var d = []; //2d matrix

        // Step 1
        var n = s.length;
        var m = t.length;

        if (n == 0) return m;
        if (m == 0) return n;

        //Create an array of arrays in javascript
        for (var i = n; i >= 0; i--) d[i] = [];

        // Step 2
        for (var i = n; i >= 0; i--) d[i][0] = i;
        for (var j = m; j >= 0; j--) d[0][j] = j;

        // Step 3
        for (var i = 1; i <= n; i++) {
            var s_i = s.charAt(i - 1);

            // Step 4
            for (var j = 1; j <= m; j++) {

                //Check the jagged ld total so far
                if (i == j && d[i][j] > 4) return n;

                var t_j = t.charAt(j - 1);
                var cost = (s_i == t_j) ? 0 : 1; // Step 5

                //Calculate the minimum
                var mi = d[i - 1][j] + 1;
                var b = d[i][j - 1] + 1;
                var c = d[i - 1][j - 1] + cost;

                if (b < mi) mi = b;
                if (c < mi) mi = c;

                d[i][j] = mi; // Step 6

                //Damerau transposition
                if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
                }
            }
        }

        return d[n][m];
    },

    /**
     * Sanitize elements
     *
     * @param string
     * @returns {XML|void|string|*}
     * // TODO: toLowerCase() ?
     * // TODO: sólo sanea si el email es inválido, si no no. --> Debria aplicarse a todo.
     */
    sanitize: function (string) {
        var sanitized;
        sanitized = string.trim();
        sanitized = sanitized.replace(' ', '');

        return sanitized;
    }
};