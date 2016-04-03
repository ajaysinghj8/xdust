'use strict';
var fs = require('fs');

class DefaultReader {
    constructor(readers) {
        this.sources = [];
        for (var r of readers) {
            if (!this.sources[r.source]) {
                this.sources.push(r.source);
            }
            this[r.source + 'Read'] = r.read;
        }
    }
    isInSource(source){
        return this.sources.indexOf(source) !== -1;
    }
    fileRead(path, fn) {
        fs.readFile(path, 'utf8', (err, str) => {
            if (err) return fn(err);
            str = str.replace(/^\uFEFF/, '');
            fn(null, str);
        });
    }
    read(filePath, fileName, source, fn) {
        if (!source) return DefaultReader.fileRead(filePath, fn);
        if (typeof this[source + 'Read'] === 'function') return this[source + 'Read'](filePath, fileName, fn);
        throw new Error('Reader not defined for "' + source + '" type. Please define reader "' + source + 'Read" and pass it to xDust(app, [{source:' + source + ',Read:function(){}}])');
    }
}

module.exports = DefaultReader;
