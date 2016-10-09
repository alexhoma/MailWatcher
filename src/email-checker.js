'use strict';

/**
 * Email Checker JS
 *
 * @description Email sanitizer and domain checker
 * @see {@link https://gist.github.com/alexhoma/e3ea1a134dead1671011b4acb55b6522}
 *
 * @author alexhoma <alexcm.14@gmail.com>
 * @version 1.0.3
 *
 * @class
 */
var EmailChecker = function (emailId, settings) {
    this.NAME = 'EmailChecker';
    this.VERSION = '1.0.3';
    this.emailId = emailId;
    this.settings = this.updateDefaults(settings);
};

EmailChecker.prototype = {

    constructor: EmailChecker,

    whitelist: [
        'gmail', 'hotmail', 'yahoo', 'outlook', 'bing', 'icloud', 'googlemail',
        'telefonica', 'terra', 'derecho'
    ],

    blacklist: [
        /*Gmail*/   'gemail', 'gmil', 'gmal', 'emai', 'gmai',
        /*Hotmail*/ 'hotmal', 'hormal', 'hormail', 'homail', 'hitmail', 'hotamail',
        /*Yahoo*/   'yaho', 'yahho', 'yahooo', 'yaaho',
        /*Outlook*/ 'outlok', 'oultook', 'utlook', 'outoolk'
    ],

    validTLDs: [ // TODO: implement checker for TLD's
        'cat', 'es', 'com', 'net', 'org', 'io',
        'barcelona', 'design', 'online', 'tech'
    ],

    accuracy: {
        highest : {min: 1, max: 1},
        high    : {min: 1, max: 2},
        medium  : {min: 1, max: 3},
        low     : {min: 1, max: 4},
        lowest  : {min: 1, max: 5}
    },

    locale: { // TODO: add locales as an external file ?
        'en-EN' : 'Did you mean <%= email %>?',
        'es-ES' : 'Querías decir <%= email %>?',
        'ca-ES' : 'Volies dir <%= email %>?',
        'pt-PT' : 'Você quis dizer <%= email %>?',
        'it-IT' : 'Intendevi <%= email %>?',
        'fr-FR' : 'Vouliez-vous dire <%= email %>?',
        'haw-US': 'La oe i ke ano o <%= email %>?'
    },

    // * Default options
    defaults: {
        mode: 'soft',                           // 'hard' or 'soft' mode
        locale: 'en-EN',                        // english locale
        accuracy: 'medium',                     // medium or high
        distance: 1,                            // 1 - 10 or more..
        copy: undefined
                                                // TODO: update whitelist and blacklist
    },

    /**
     * Initializer
     *
     * @returns {string} correct email || sanitized email
     *  -> bool (true): if the email domain doesn't need correction
     *  -> string: email corrected
     */
    check: function () {
        var email = document.getElementById(this.emailId);
        var e = email.value;
        var restored;

        // remove suggestions
        var suggestionElement = document.getElementById('suggestion');
        if (suggestionElement !== null) {
            suggestionElement.remove();
        }

        // Descomponemos email
        var extracted  = this.splitEmail(e);

        // Validamos el email
        var validation = this.validationApproach(extracted.domain);
        if (!validation) {
            restored = this.repairEmail(extracted.domain);
        }

        // Reconstruimos el email y modificamos el DOM
        if ( typeof restored !== "undefined" ) {
            var correctEmail = extracted.user + '@' + restored + '.' + extracted.tld;

            if ( this.defaults.mode === 'hard' ) {
                return email.value = correctEmail;
            }
            if ( this.defaults.mode === 'soft' ) {
                var suggestion = this.suggest(correctEmail);
                return email.parentNode.insertBefore(suggestion, email.nextSibling);
            }
        } else {
            return email.value = extracted.user + '@' + extracted.domain + '.' + extracted.tld;
        }
    },

    /**
     * Split email
     * Split the variable elements of an email string
     * @example
     *  // returns 'alex.martin', 'derecho', 'com'
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

            domain = e.split('@')[1]; // TODO: support second level tld's --> domain[.co.uk]
            domain = domain.split('.')[0];
            domain = this.sanitize(domain);

            tld = e.substr( indexOfElement, e.length );
            tld = tld.split('.')[1]; // take from the second dot
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
    validationApproach: function (domain) { // TODO: refacor this process
        var isInBlacklist = false;
        var isValidEmail;
        var approach;

        // First approach: Comprobamos si coincide con algun dominio válido al 100%
        for (var i = 0; i < this.whitelist.length; i++) {
            approach = this.levenshtein(this.whitelist[i], domain);
            if (approach == 0) {
                isValidEmail = true;
                break;
            }
        }

        // Second approach: Comprueba si el 'dominio' figura en nuestro "blacklist" de dominios erróneos
        if (typeof isValidEmail == 'undefined') {
            for (i = 0; i < this.blacklist.length; i++) {
                if ( this.blacklist[i] == domain ) {
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
        if (typeof isValidEmail == 'undefined') { // filtro por longitud de cadena para acotar aproximación
            var distance;
            for (i = 0; i < this.whitelist.length; i++) {
                // calculamos la proximidad de cadenas --> máximo un dígito
                debugger;
                distance = Math.round(this.whitelist[i].length - domain.length);
                console.log(distance);
                if (distance >= -this.defaults.distance && distance <= this.defaults.distance) {
                    // calculamos aproximación levenshtein
                    approach = this.levenshtein(this.whitelist[i], domain);
                    if (approach >= this.accuracy[this.defaults.accuracy].min &&
                        approach <= this.accuracy[this.defaults.accuracy].max) {
                        isValidEmail = false;
                        break;
                    }
                }
            }
        }

        // Approach conclusion
        if (typeof isValidEmail == 'undefined') {
            console.log('The email is not on your valid emails list. But it is very likely to be correct.');
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
        for (var i = 0; i < this.whitelist.length; i++) {
            approach = this.levenshtein(this.whitelist[i], toRepair);
            if (approach >= this.accuracy[this.defaults.accuracy].min &&
                approach <= this.accuracy[this.defaults.accuracy].max) {
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
            console.log('No matches for this email.');
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
     */
    sanitize: function (string) {
        var sanitized;
            sanitized = string.trim();
            sanitized = sanitized.replace(' ', '');
            sanitized = sanitized.toLowerCase();

        return sanitized;
    },

    /**
     * Create a suggestion of valid email
     *
     * @param suggestion
     * @returns {Element}
     */
    suggest: function (suggestion) {
        var CCopy = this.defaults.copy;
        var copy;
        // create anchor with the email
        var anchor = '<a href="#" onclick="addEmail()">' + suggestion + '</a>';

        // blend suggestion sentence
        if (typeof CCopy !== 'undefined') {
            if (typeof CCopy === 'string') {
                copy = CCopy;
            } else {
                throw new Error('Custom copy must by type string: ' + CCopy);
            }
        } else {
            copy = this.locale[this.defaults.locale];
        }
        // replace anchor on copy sentence
        copy = copy.replace('<%= email %>', anchor);

        // create div element
        var newSuggestion = document.createElement('div');
            newSuggestion.setAttribute('id', 'suggestion');
            newSuggestion.innerHTML = copy;

        return newSuggestion;
    },

    /**
     * Update defaults with custom settings
     *
     * @param settings
     */
    updateDefaults: function (settings) {
        if (typeof settings === 'undefined') {
            return;
        } else if (typeof settings === 'object') {
            Object.assign(this.defaults, settings);
        } else {
            throw new Error('Email custom settings must be an object: ' + settings);
        }
    }
};

// TODO: do something with this, don't like inline scripts --> onclick: "addEmail()"
function addEmail () {
    var anchor = document.querySelector('#suggestion a');
    var email = document.getElementById('email');
    var suggestion = document.getElementById('suggestion');
    email.value = anchor.text;
    suggestion.remove();
}

// TODO: modularize
/* if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailChecker;
}*/