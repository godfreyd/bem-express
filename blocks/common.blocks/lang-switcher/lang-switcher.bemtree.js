block('lang-switcher').content()(function() {
    var data = this.data,
        lang = data.lang.toLowerCase();

  return applyCtx({
        block: 'select',
        mods: {
            mode: 'radio-check',
            theme: 'islands',
            size: 'm'
        },
        val: lang,
        text: this.i18n(this.block, lang),
        options: [
            {
                val: 'ru',
                text: this.i18n(this.block, 'ru')
            },
            {
                val: 'en',
                text: this.i18n(this.block, 'en')
            }
        ]
    });
});

