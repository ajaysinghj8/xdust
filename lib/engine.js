var Duster = require('./duster');

class Engine {
  static getSrc(name) {
    if ([].indexOf.call(name, ':') === -1) return undefined;
    var src = name.split(':')[0];
    if ([].indexOf.call(Engine.otherLocations || [], src) !== -1) return src;
    return undefined;
  }
  static isOfOtherLocation(name) {
    if ([].indexOf.call(name, ':') === -1) return false;
    var src = name.split(':')[0];
    if ([].indexOf.call(Engine.otherLocations || [], src) !== -1) return true;
    return false;
  }
  static init(app, reader, otherLocations) {
    Duster.__init(reader);
    Engine.otherLocations = otherLocations;
    app.set('view').prototype.lookup_internal = app.set('view').prototype.lookup;
    app.set('view').prototype.lookup = function (name) {
      if (Engine.isOfOtherLocation(name)) return name; // returns path of the file
      return this.lookup_internal(name);
    };
    return Engine.__express;
  }
  static __express(templatePath, options, callback) {
    if (!Duster.views) Duster.views = options.settings.views;
    return Duster.render(templatePath, options, callback);
  }
}

module.exports = Engine.init;