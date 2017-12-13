const fs = require('fs'),
    path = require('path'),
    nodeEval = require('node-eval'),
    config = require('./config'),

    isDev = process.env.NODE_ENV === 'development',
    LANGUAGES = process.env.LANGUAGES ? process.env.LANGUAGES.split(',') : ['en', 'ru'],
    useCache = !isDev,
    cacheTTL = config.cacheTTL,
    cache = {};

function render(req, res, data, context) {
    var query = req.query,
        user = req.user,
        cacheKey = req.originalUrl + (context ? JSON.stringify(context) : '') + (user ? JSON.stringify(user) : ''),
        cached = cache[cacheKey],
        templates = getTemplates(data.page, data.bundle, data.lang);

    if (useCache && cached && (new Date() - cached.timestamp < cacheTTL)) {
        return res.send(cached.html);
    }

    if (isDev && query.json) return res.send('<pre>' + JSON.stringify(data, null, 4) + '</pre>');

    var bemtreeCtx = {
        block: 'root',
        context: context,
        // extend with data needed for all routes
        data: Object.assign({}, {
            url: req._parsedUrl,
            csrf: req.csrfToken()
        }, data)
    };

    try {
        var bemjson = templates.BEMTREE.apply(bemtreeCtx);
    } catch(err) {
        console.error('BEMTREE error', err.stack);
        console.trace('server stack');
        return res.sendStatus(500);
    }

    if (isDev && query.bemjson) return res.send('<pre>' + JSON.stringify(bemjson, null, 4) + '</pre>');

    try {
        var html = templates.BEMHTML.apply(bemjson);
    } catch(err) {
        console.error('BEMHTML error', err.stack);
        return res.sendStatus(500);
    }

    useCache && (cache[cacheKey] = {
        timestamp: new Date(),
        html: html
    });

    res.send(html);
}

function dropCache() {
    cache = {};
}

function evalFile(filename) {
    return nodeEval(fs.readFileSync(filename, 'utf8'), filename);
}

function getTemplates(bundleName = 'index', level = 'desktop', lang = 'ru') {

    var pathToBundle = path.resolve('bundles/' + level + '.bundles', bundleName);

    return {
        BEMTREE: evalFile(path.join(pathToBundle, bundleName + '.' + lang + '.bemtree.js')).BEMTREE,
        BEMHTML: evalFile(path.join(pathToBundle, bundleName + '.' + lang + '.bemhtml.js')).BEMHTML
    };
}

module.exports = {
    render: render,
    dropCache: dropCache
};
