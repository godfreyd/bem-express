
(function (global) {
    var __i18n__ = ((function () {
            var data;

            /**
             * @exports
             * @param {String} keyset
             * @param {String} key
             * @param {Object} [params]
             * @returns {String}
             */
            function i18n(keyset, key, params) {
                if(!data) throw Error('i18n need to be filled with data');
                var val = data[keyset] && data[keyset][key];
                return typeof val === 'undefined'?
                keyset + ':' + key :
                    typeof val === 'string'?
                        val :
                        val.call(i18n, params, i18n);
            }

            i18n.decl = function(i18nData) {
                if(!data) {
                    data = i18nData;
                    return this;
                }

                for(var ks in i18nData) {
                    var dataKs = data[ks] || (data[ks] = {}),
                        i18nDataKs = i18nData[ks];

                    for(var k in i18nDataKs)
                        dataKs[k] = i18nDataKs[k];
                }

                return this;
            };

            return i18n;
        })()).decl({"lang-switcher":{"ru":"Русский","en":"Английский"},"page-about":{"about":"О нас"}}),
        defineAsGlobal = true;

    // CommonJS
    if (typeof exports === "object") {
        module.exports = __i18n__;

    }

    // YModules
    if (typeof modules === "object") {
        modules.define("i18n", function (provide) {
            provide(__i18n__);
        });

    }


})(typeof window !== "undefined" ? window : global);