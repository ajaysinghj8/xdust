'use strict';
var fs = require('fs');

function extend(a, b) {
  for (var x in b) {
    a[x] = b[x];
  }
}

class DefaultReader {
  static __init(extended) {
    extend(DefaultReader, extended);
    return DefaultReader;
  }
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