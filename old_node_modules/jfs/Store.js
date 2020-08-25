'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              Copyright (C) 2012 - 2016 Markus Kohlhase <mail@markus-kohlhase.de>
                                                                                                                                                                                                                                                                               */

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isJSONFile = function isJSONFile(f) {
  return f.substr(-5) === ".json";
};
var removeFileExtension = function removeFileExtension(f) {
  return f.split(".json")[0];
};
var getIDs = function getIDs(a) {
  return a.filter(isJSONFile).map(removeFileExtension);
};
var readIDsSync = function readIDsSync(d) {
  return getIDs(_fs2.default.readdirSync(d));
};
var readIDs = function readIDs(d, cb) {
  return _fs2.default.readdir(d, function (err, ids) {
    return cb(err, getIDs(ids));
  });
};

var getObjectFromFileSync = function getObjectFromFileSync(id) {
  try {
    return JSON.parse(_fs2.default.readFileSync(this._getFileName(id), "utf8"));
  } catch (error) {
    return error;
  }
};

var getObjectFromFile = function getObjectFromFile(id, cb) {
  _fs2.default.readFile(this._getFileName(id), "utf8", function (err, o) {
    if (err) {
      return cb(err);
    }
    try {
      cb(null, JSON.parse(o));
    } catch (error) {
      cb(error);
    }
  });
};

var FILE_EXISTS = _fs2.default.constants ? _fs2.default.constants.F_OK : _fs2.default.F_OK;
var FILE_IS_WRITABLE = _fs2.default.constants ? _fs2.default.constants.W_OK : _fs2.default.W_OK;

var canWriteToFile = function canWriteToFile(file, cb) {
  _fs2.default.access(file, FILE_EXISTS, function (err) {
    if (err) return cb(null);
    _fs2.default.access(file, FILE_IS_WRITABLE, cb);
  });
};

var canWriteToFileSync = function canWriteToFileSync(file) {
  try {
    _fs2.default.accessSync(file, FILE_EXISTS);
  } catch (err) {
    return;
  }

  _fs2.default.accessSync(file, FILE_IS_WRITABLE);
};

var saveObjectToFile = function saveObjectToFile(o, file, cb) {
  var indent = this._pretty ? 2 : void 0;
  var json = void 0;
  try {
    json = JSON.stringify(o, null, indent);
  } catch (error) {
    if (typeof cb === "function") {
      return cb(error);
    } else {
      return error;
    }
  }

  var tmpFileName = file + _uuid2.default.v4() + ".tmp";

  if (typeof cb === "function") {
    canWriteToFile(file, function (err) {
      if (err) return cb(err);

      _fs2.default.writeFile(tmpFileName, json, 'utf8', function (err) {
        if (err) return cb(err);

        _fs2.default.rename(tmpFileName, file, cb);
      });
    });
  } else {
    try {
      canWriteToFileSync(file);
      _fs2.default.writeFileSync(tmpFileName, json, 'utf8');
      _fs2.default.renameSync(tmpFileName, file);
    } catch (error) {
      return error;
    }
  }
};

var id2fileName = function id2fileName(id, dir) {
  return _path2.default.join(dir, id + ".json");
};

var _save = function _save(id, o, cb) {
  var backup = void 0,
      k = void 0,
      data = void 0;
  if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === "object") {
    cb = o;
    o = id;
    id = null;
  }
  if (typeof id !== "string") {
    id = this._idGenerator();
  }
  var file = this._getFileName(id);
  o = (0, _clone2.default)(o);
  if (this._saveId) {
    if (typeof (k = this._saveId) === 'string' && k.length > 0) {
      o[k] = id;
    } else {
      o.id = id;
    }
  }

  if (this._single) {
    backup = this._cache[id];
    this._cache[id] = o;
    data = this._cache;
  } else {
    data = o;
  }

  var done = function done(err) {
    if (err) {
      if (this._single) {
        this._cache[id] = backup;
      }
      if (typeof cb === "function") {
        cb(err);
      } else {
        return err;
      }
    } else {
      this._cache[id] = o;
      if (typeof cb === "function") {
        cb(null, id);
      } else {
        return id;
      }
    }
  };

  if (this._memory) return done.call(this);

  if (typeof cb === "function") {
    saveObjectToFile.call(this, data, file, done.bind(this));
  } else {
    return done.call(this, saveObjectToFile.call(this, data, file));
  }
};

var _get = function _get(id, cb) {
  var o = (0, _clone2.default)(this._cache[id]);
  if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object") {
    return typeof cb === "function" ? cb(null, o) : o;
  }
  var done = function done(err, o) {
    var e = void 0,
        item = void 0;
    if (err) {
      var _e = new Error("could not load data");
      if (typeof cb === "function") {
        return cb(_e);
      } else {
        return _e;
      }
    }
    item = this._single ? o[id] : o;
    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== "object") {
      e = new Error("could not load data");
      if (typeof cb === "function") {
        return cb(e);
      } else {
        return e;
      }
    }
    this._cache[id] = item;
    if (typeof cb === "function") {
      return cb(null, item);
    } else {
      return item;
    }
  };

  if (this._memory) return done.call(this, null, o);

  if (typeof cb === "function") return getObjectFromFile.call(this, id, done.bind(this));

  var err = (o = getObjectFromFileSync.call(this, id)) instanceof Error;

  return done.call(this, err ? o : void 0, !err ? o : void 0);
};

var remove = function remove(id, cb) {
  var e = void 0,
      err = void 0,
      notInCache = void 0,
      o = void 0;
  var file = this._getFileName(id);
  var cacheBackup = this._cache[id];
  if ((typeof cacheBackup === 'undefined' ? 'undefined' : _typeof(cacheBackup)) !== "object") {
    notInCache = new Error(id + " does not exist");
  }
  var done = function done(err) {
    if (err) {
      this._cache[id] = cacheBackup;
      return typeof cb === "function" ? cb(err) : err;
    }
    delete this._cache[id];
    return typeof cb === "function" ? cb() : void 0;
  };

  if (this._single) {
    delete this._cache[id];
    if (this._memory || notInCache !== undefined) {
      return done.call(this, notInCache);
    }

    if (typeof cb === "function") {
      return saveObjectToFile.call(this, this._cache, file, done.bind(this));
    }

    err = (o = saveObjectToFile.call(this, this._cache, file)) instanceof Error;
    return done.call(this, err ? o : void 0, !err ? o : void 0);
  }

  if (this._memory) return done.call(this, notInCache);

  if (typeof cb === "function") return _fs2.default.unlink(file, done.bind(this));

  try {
    return done.call(this, _fs2.default.unlinkSync(file));
  } catch (error) {
    return done.call(this, error);
  }
};

var Store = function () {
  function Store() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Store);

    this.name = name;
    this._single = opt.single === true || opt.type === 'single';
    this._pretty = opt.pretty === true;
    this._memory = opt.memory === true || opt.type === 'memory';
    this._saveId = opt.saveId;
    this._idGenerator = typeof opt.idGenerator === "function" ? opt.idGenerator : _uuid2.default.v4;

    if (isJSONFile(this.name)) {
      this.name = this.name.split(".json")[0];
      this._single = true;
    }

    this._dir = _path2.default.resolve(this.name);

    if (this._single) {
      this._dir = _path2.default.dirname(this._dir);
    }

    this._cache = {};

    if (!this._memory) {
      _mkdirp2.default.sync(this._dir);
    }

    if (this._single) {
      if (!this._memory) {
        var fn = this._getFileName();
        if (!_fs2.default.existsSync(fn)) {
          if (_fs2.default.writeFileSync(fn, "{}", 'utf8')) {
            throw new Error("could not create database");
          }
        }
      }
      this._cache = this.allSync();
    }
  }

  _createClass(Store, [{
    key: '_getFileName',
    value: function _getFileName(id) {
      if (this._single) {
        return _path2.default.join(this._dir, _path2.default.basename(this.name) + ".json");
      } else {
        return id2fileName(id, this._dir);
      }
    }
  }, {
    key: 'save',
    value: function save(id, o) {
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      return _save.call(this, id, o, cb);
    }
  }, {
    key: 'saveSync',
    value: function saveSync(id, o) {
      return _save.call(this, id, o);
    }
  }, {
    key: 'get',
    value: function get(id) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      _get.call(this, id, cb);
    }
  }, {
    key: 'getSync',
    value: function getSync(id) {
      return _get.call(this, id);
    }
  }, {
    key: 'delete',
    value: function _delete(id, cb) {
      remove.call(this, id, cb);
    }
  }, {
    key: 'deleteSync',
    value: function deleteSync(id) {
      return remove.call(this, id);
    }
  }, {
    key: 'all',
    value: function all() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};


      if (this._memory) return cb(null, this._cache);

      if (this._single) {
        return getObjectFromFile.call(this, void 0, cb);
      }
      readIDs(this._dir, function (err, ids) {
        var _this = this;

        if (typeof err !== "undefined" && err !== null) {
          return cb(err);
        }

        var all = {};
        var loaders = ids.map(function (id) {
          return function (cb) {
            return this.get(id, function (err, o) {
              if (!err) {
                all[id] = o;
              }
              return cb(err);
            });
          }.bind(_this);
        });

        _async2.default.parallel(loaders, function (err) {
          return cb(err, all);
        });
      }.bind(this));
    }
  }, {
    key: 'allSync',
    value: function allSync() {
      var _this2 = this;

      if (this._memory) return this._cache;

      if (this._single) {
        var db = getObjectFromFileSync.call(this);
        if ((typeof db === 'undefined' ? 'undefined' : _typeof(db)) !== "object") {
          throw new Error("could not load database");
        }
        return db;
      }

      var objects = {};
      readIDsSync(this._dir).forEach(function (f) {
        var item = getObjectFromFileSync.call(_this2, f);
        if (item !== undefined) {
          objects[f] = item;
        } else {
          console.error("could not load '" + f + "'");
        }
      });

      return objects;
    }
  }]);

  return Store;
}();

module.exports = Store;
