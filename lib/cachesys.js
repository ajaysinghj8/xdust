'use strict';

class BaseCaching {
    constructor() {
        this._collection = {};
    }
    get(key, cb) {
        var val = this._collection[key];
        if (typeof cb === 'function') {
            return val ? cb(null, val) : cb(new Error('miss'));
        }
        return val;
    }
    getAll(cb) {
        if (typeof cb === 'function') {
            return cb(null, this._collection);
        }
        return this._collection;
    }
    set(key, val, cb) {
        this._collection[key] = val;
        if (typeof cb === 'function') {
            return cb(null);
        }
    }
    flush(key, cb) {
        delete this._collection[key];
        if (typeof cb === 'function') {
            return cb(null);
        }
    }
    flushAll(cb) {
        this._collection = {};
        if (typeof cb === 'function') {
            return cb(null);
        }
    }
}

class Caching extends BaseCaching {
    constructor(client) {
        super();
        this.cacheNamed = 'dustCache2';
        this.client = client;
    }
    get(key, cb) {
        if (this.client) {
            return this.client.hget(this.cacheNamed, key, (err, response) => {
                if (response) response = this._toTemplateFn(response);
                cb(err, response);
            });
        }
        return super.get(key, cb);

    }
    set(key, val, cb) {
        if (this.client) {
           var stringObj = {
               __dustBody: val.__dustBody,
               templateName: val.templateName,
               fn: val.toString()
           };
            return this.client.hset(this.cacheNamed, key, JSON.stringify(stringObj), cb);
        }
        return super.get(key, cb);
    }
    getAll(cb) {
        if (this.client) {
            return this.client.hgetall(this.cacheNamed, (err, response) => {
                var _coverted = {};
                if (!err && response) {
                    for (var k in response) {
                        _coverted[k] = this._toTemplateFn(response[k]);
                    }
                    return cb(err, _coverted)
                }
                return cb(err, response);
            });
        }
        return super.getAll(cb);
    }
    flush(key, cb) {
        if (this.client) {
            return this.client.hdel(this.cacheNamed, key, cb);
        }
        return super.flushAll(cb);
    }
    flushAll(cb) {
        if (this.client) {
            return this.client.del(this.cacheNamed, cb);
        }
        return super.flushAll(cb);
    }
    _toTemplateFn(stringObject) {
        var ob = JSON.parse(stringObject);
        var fn = (new Function('return ' + ob.fn))();
        fn.__dustBody = ob.__dustBody;
        fn.templateName = ob.templateName;
        return fn;
    }


}
module.exports = Caching;