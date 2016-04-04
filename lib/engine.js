'use strict';
var path = require('path');
var Duster = require('./duster');
var DefaultReader = require('./defaultReader');
var CacheSys = require('./cachesys');
var SourceDelimiter = ':';


class Engine {
    constructor(express, readers, cacheClient, delimiter) {
        if (delimiter) {
            SourceDelimiter = delimiter;
        }
        this._cache = new CacheSys(cacheClient);
        this.__app = express;
        this.extendExpress(express);
        this._duster = new Duster(new DefaultReader(readers), this._cache, SourceDelimiter);
    }
    extendExpress(express) {
        var lookup = express.set('view').prototype.lookup_internal = express.set('view').prototype.lookup;
        var self = this;
        express.set('view').prototype.lookup = (name) => {
            if (self.isOfOtherLocation(name)) return name; // returns path of the file
            return lookup.call(express.set('view'), name);
        };
    }
    __express(templatePath, options, callback) {
        return engine_instanse._duster.render(templatePath, options, callback);
    }
    isOfOtherLocation(name) {
        if ([].indexOf.call(name, SourceDelimiter) === -1) return false;
        var src = name.split(SourceDelimiter)[0];
        return this._duster.reader.isInSource(src);
    }
}

var engine_instanse;


module.exports = (a, r, c) => {
    return engine_instanse ? engine_instanse : engine_instanse = new Engine(a, r, c);
};
