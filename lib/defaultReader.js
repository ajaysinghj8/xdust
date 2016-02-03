'use strict';
var fs = require('fs');

class DefaultReader {
  static fileRead(path, fn) {
    fs.readFile(path, 'utf8', (err, str) => {
      if (err) return fn(err);
      str = str.replace(/^\uFEFF/, '');
      fn(null, str);
    });
  }
  static read(filePath, fileName, source, fn) {
    switch (source) {
      default:
        return DefaultReader.fileRead(filePath, fn);
    }
  }
}

module.exports = DefaultReader;