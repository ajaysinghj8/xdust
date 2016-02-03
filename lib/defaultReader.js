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
     if(!source) return DefaultReader.fileRead(filePath, fn);
     if(typeof DefaultReader[source+'Read'] === 'function') return DefaultReader[source+'Read'](filePath,fileName,fn);
     throw new Error('Reader not defined for "'+source+'" type. Please define reader "'+source+'Read" and pass it to xDust(app, {'+source+'Read:function},["'+source+'""])');
  }
}

module.exports = DefaultReader;
