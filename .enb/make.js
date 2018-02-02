var langs = ['ru', 'en'],
    techs = {
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),
        fileCopy: require('enb/techs/file-copy'),
        borschik: require('enb-borschik/techs/borschik'),
        postcss: require('enb-postcss/techs/enb-postcss'),
        postcssPlugins: [
            require('postcss-import')(),
            require('postcss-each'),
            require('postcss-for'),
            require('postcss-simple-vars')(),
            require('postcss-calc')(),
            require('postcss-nested'),
            require('rebem-css'),
            require('postcss-url')({ url: 'inline' }),
            require('autoprefixer')()
        ],
        browserJs: require('enb-js/techs/browser-js'),
        prependYm: require('enb-modules/techs/prepend-modules'),
        keysets: require('enb-bem-i18n/techs/keysets'),
        i18n: require('enb-bem-i18n/techs/i18n'),
        bemtree: require('enb-bemxjst-i18n/techs/bemtree-i18n'),
        bemhtml: require('enb-bemxjst-i18n/techs/bemhtml-i18n')
    },
    enbBemTechs = require('enb-bem-techs'),
    libLevels = [
        { path: 'node_modules/bem-core/common.blocks', check: false },
        { path: 'node_modules/bem-core/desktop.blocks', check: false },
        { path: 'node_modules/bem-components/common.blocks', check: false },
        { path: 'node_modules/bem-components/desktop.blocks', check: false },
        { path: 'node_modules/bem-components/design/common.blocks', check: false },
        { path: 'node_modules/bem-components/design/desktop.blocks', check: false }
    ];

function configNodes(config, bundle, levels) {

    var isProd = process.env.YENV === 'production';
    isProd || levels.push('blocks/development.blocks');

    config.nodes(bundle, function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: libLevels.concat(levels) }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.postcss, {
                target: '?.css',
                oneOfSourceSuffixes: ['post.css', 'css'],
                plugins: techs.postcssPlugins
            }],

            // i18n
            [techs.keysets, { lang: '{lang}' }],
            [techs.i18n, {
                exports: { ym: true, commonJS: true },
                lang: '{lang}'
            }],

            // bemtree
            [techs.bemtree, { sourceSuffixes: ['bemtree', 'bemtree.js'],
            target: '?.{lang}.bemtree.js',
            lang: '{lang}'
            }],

            // templates
            [techs.bemhtml, {
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                forceBaseTemplates: true,
                engineOptions: { elemJsInstances: true },
                target: '?.{lang}.bemhtml.js',
                lang: '{lang}'
            }],

            // client templates
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.tmpl.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.tmpl.deps.js',
                bemdeclFile: '?.tmpl.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.tmpl.deps.js',
                filesTarget: '?.tmpl.files',
                dirsTarget: '?.tmpl.dirs'
            }],
            [techs.bemhtml, {
                lang: '{lang}',
                target: '?.browser.{lang}.bemhtml.js',
                filesTarget: '?.tmpl.files',
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                engineOptions: { elemJsInstances: true }
            }],

            // js
            [techs.browserJs, { includeYM: true }],
            [techs.fileMerge, {
                target: '?.pre.{lang}.js',
                sources: ['?.browser.js',
                '?.lang.{lang}.js', '?.browser.{lang}.bemhtml.js'],
                lang: '{lang}'
            }],

            [techs.prependYm, {
                source: '?.pre.{lang}.js',
                target: '?.{lang}.js'
            }],

            // borschik
            [techs.borschik, { source: '?.{lang}.js', target: '?.{lang}.min.js', minify: isProd }],
            [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }],

            [techs.fileCopy, { source: '?.{lang}.min.js', target: '../../../static/?.{lang}.min.js' }],
            [techs.fileCopy, { source: '?.min.css', target: '../../../static/?.min.css' }]
        ]);

        nodeConfig.addTargets(['?.{lang}.bemtree.js', '?.{lang}.bemhtml.js', '../../../static/?.{lang}.min.js', '../../../static/?.min.css']);
    });

}

module.exports = function(config) {

    config.setLanguages(langs);

    configNodes(config, 'bundles/*.bundles/index', [ 'blocks/common.blocks', 'blocks/index.blocks' ]);

    configNodes(config, 'bundles/*.bundles/about', [ 'blocks/common.blocks', 'blocks/about.blocks' ]);

};
