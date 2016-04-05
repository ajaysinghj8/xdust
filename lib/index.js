'use strict';

var Engine = require('./engine');

var singleInstance;

module.exports = (a, r, c) => {
    return singleInstance ? singleInstance : singleInstance = new Engine(a, r, c);
};