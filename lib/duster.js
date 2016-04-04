'use strict';

var path = require('path'),
    DefaultReader = require('./defaultReader');

var dust;
try {
    dust = require('dust');
} catch (err) {
    try {
        dust = require('dustjs-helpers');
    } catch (err) {
        try {
            dust = require('dustjs-linkedin');
        } catch (err) {
            throw new Error(' Please install dustjs-linkedin npm package.');
        }
    }
}


class Duster {
    constructor(reader, cache, delimeter, options) {
        this.reader = reader;
        this.delimeter = delimeter;
        this.cache = cache;
        this.options = options || {};
        this.setDust();
    }
    setDust() {
        if (dust) {
            this._overrideDust();
        }
    }
    _overrideDust() {
        dust.onLoad = (template, cb) => {
            if (path.extname(template) !== '.dust') {
                template = path.join(this.views, template) + '.dust';
            }
            return this.reader.read(template, this.getFileName(template), this.getSrc(template), (err, htmlString) => {
                return cb(err, htmlString);
            });
        };
    }

    render(template, options, callback) {
        this.views = options.settings.views;
        this.cache.getAll((err, cached) => {
           dust.cache = cached || {};
           dust.render(template, options, (err, compiledTmpl) => {
                if (err) return callback(err);
                if (options.settings.cache || options.settings['view cache']) {
                    for (var k in dust.cache) {
                        this.cache.set(k, dust.cache[k]);
                    }
                }
                callback(null, compiledTmpl);

            });
        });

    }

    getSrc(name) {
        name = path.basename(name, '.dust');
        if ([].indexOf.call(name, this.delimeter) === -1) return undefined;
        var src = name.split(this.delimeter)[0];
        if (this.reader.isInSource(src)) return src;
        return undefined;
    }
    getFileName(filePath) {
        var fileName = path.basename(filePath, '.dust');
        return fileName.split(this.delimeter).pop();
    }
}

module.exports = Duster;
