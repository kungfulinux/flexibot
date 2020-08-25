'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();

describe("The jfs module", function () {

  var NAME = ".specTests";

  afterEach(function (done) {
    _fs2.default.unlink(NAME + '.json', function (err) {
      (0, _child_process.exec)("rm -rf ./" + NAME, function (err, out) {
        console.log(out);
        if (err !== null) {
          console.error(err);
        }
        done();
      });
    });
  });

  it("is a class", function () {
    _Store2.default.should.be.a["function"];
  });

  it("resolves the path correctly", function () {
    var x1 = new _Store2.default("./foo/bar", {
      type: 'memory'
    });
    x1._dir.should.equal(process.cwd() + '/foo/bar');
    var x2 = new _Store2.default(__dirname + "/foo/bar", {
      type: 'memory'
    });
    x2._dir.should.equal(process.cwd() + '/foo/bar');
  });

  describe("save method", function () {

    it("can save an object", function (done) {
      var store = new _Store2.default(NAME);
      var data = {
        x: 56
      };
      store.save("id", data, function (err) {
        should.not.exist(err);
        _fs2.default.readFile("./" + NAME + "/id.json", "utf-8", function (err, content) {
          content.should.equal('{"x":56}');
          store.save("emptyObj", {}, function (err) {
            should.not.exist(err);
            store.get("emptyObj", function (err, o) {
              should.not.exist(err);
              o.should.eql({});
              done();
            });
          });
        });
      });
    });

    it("can autosave the id", function (done) {
      var store = new _Store2.default(NAME, {
        saveId: true
      });
      store.save({}, function (err, id) {
        store.get(id, function (err, o) {
          o.id.should.equal(id);
          done();
        });
      });
    });

    it("can autosave the id with a custom key", function (done) {
      var store = new _Store2.default(NAME, {
        saveId: 'myCustomKey'
      });
      store.save({}, function (err, id) {
        store.get(id, function (err, o) {
          o.myCustomKey.should.equal(id);
          done();
        });
      });
    });

    it("can autosave the id with a custom generator", function (done) {
      var store = new _Store2.default(NAME, {
        idGenerator: function idGenerator() {
          return "customId";
        },
        saveId: true
      });
      store.save({}, function (err, id) {
        store.get(id, function (err, o) {
          o.id.should.equal("customId");
          done();
        });
      });
    });

    it("can save an object synchronously", function () {
      var store = new _Store2.default(NAME);
      var data = {
        s: "ync"
      };
      var id = store.saveSync("id", data);
      id.should.equal("id");
      var content = _fs2.default.readFileSync("./" + NAME + "/id.json", "utf-8");
      content.should.equal('{"s":"ync"}');
    });

    it("creates a deep copy for the cache", function (done) {
      var store = new _Store2.default(NAME + '.json');
      var z = [];
      var y = {
        z: z
      };
      var data = {
        x: 56,
        y: y
      };
      store.save(data, function (err, id) {
        store.get(id, function (err, res) {
          res.should.eql(data);
          res.should.not.equal(data);
          res.y.should.eql(y);
          res.y.should.not.equal(y);
          res.y.z.should.eql(z);
          res.y.z.should.not.equal(z);
          done();
        });
      });
    });
  });

  describe("get method", function () {

    it("can load an object", function (done) {
      var store = new _Store2.default(NAME);
      var data = {
        x: 87
      };
      store.save(data, function (err, id) {
        store.get(id, function (err, o) {
          o.x.should.equal(87);
          done();
        });
      });
    });

    it("returns an error if it cannot load an object", function (done) {
      var store = new _Store2.default(NAME);
      store.get("foobarobject", function (err, o) {
        err.should.be.truthy;
        err.message.should.equal("could not load data");
        store = new _Store2.default(NAME, {
          type: "memory"
        });
        store.get("foobarobject", function (err, o) {
          err.message.should.equal("could not load data");
          store = new _Store2.default(NAME, {
            type: "single"
          });
          store.get("foobarobject", function (err, o) {
            err.message.should.equal("could not load data");
            done();
          });
        });
      });
    });
  });

  describe("getSync method", function () {

    it("can load an object synchronously", function () {
      var store = new _Store2.default(NAME);
      var data = {
        x: 87
      };
      var id = store.saveSync(data);
      var o = store.getSync(id);
      o.x.should.equal(87);
    });

    it("returns an error if it cannot load an object", function () {
      var store = new _Store2.default(NAME);
      var err = store.getSync("foobarobject");
      err.should.be.truthy;
      err.message.should.equal("could not load data");
      store = new _Store2.default(NAME, {
        type: "memory"
      });
      err = store.getSync("foobarobject");
      err.message.should.equal("could not load data");
      store = new _Store2.default(NAME, {
        type: "single"
      });
      err = store.getSync("foobarobject");
      err.message.should.equal("could not load data");
    });
  });

  describe("getAll method", function () {

    it("can load all objects", function (done) {
      var store = new _Store2.default(NAME);
      var x1 = {
        j: 3
      };
      var x2 = {
        k: 4
      };
      store.save(x1, function (err, id1) {
        store.save(x2, function (err, id2) {
          store.all(function (err, all) {
            should.not.exist(err);
            all[id1].j.should.equal(3);
            all[id2].k.should.equal(4);
            done();
          });
        });
      });
    });

    it("can load all objects synchronously", function () {
      var store = new _Store2.default(NAME);
      var x1 = {
        j: 3
      };
      var x2 = {
        k: 4
      };
      var id1 = store.saveSync(x1);
      var id2 = store.save(x2);
      var all = store.allSync();
      (all instanceof Error).should.be.falsy;
      all[id1].j.should.equal(3);
      all[id2].k.should.equal(4);
    });
  });

  describe("delete method", function () {

    it("can delete an object", function (done) {
      var store = new _Store2.default(NAME);
      var data = {
        y: 88
      };
      store.save(data, function (err, id) {
        _fs2.default.readFile("./" + NAME + "/" + id + ".json", "utf-8", function (err, content) {
          content.should.not.eql("");
          store["delete"](id, function (err) {
            _fs2.default.readFile("./" + NAME + "/" + id + ".json", "utf-8", function (err, content) {
              err.should.exist;
              done();
            });
          });
        });
      });
    });

    it("returns an error if the record does not exist", function (done) {
      var store = new _Store2.default(NAME);
      store["delete"]("blabla", function (err) {
        (err instanceof Error).should.be["true"];
        store = new _Store2.default(NAME, {
          type: "single"
        });
        store["delete"]("blabla", function (err) {
          (err instanceof Error).should.be["true"];
          store = new _Store2.default(NAME, {
            type: "memory"
          });
          store["delete"]("blabla", function (err) {
            (err instanceof Error).should.be["true"];
            done();
          });
        });
      });
    });
  });

  describe("deleteSync method", function () {

    it("can delete an object synchonously", function () {
      var store = new _Store2.default(NAME);
      var data = {
        y: 88
      };
      var id = store.saveSync(data);
      var content = _fs2.default.readFileSync("./" + NAME + "/" + id + ".json", "utf-8");
      content.should.not.eql("");
      var err = store.deleteSync(id);
      should.not.exist(err);
      (function () {
        return _fs2.default.readFileSync("./" + NAME + "/" + id + ".json", "utf-8");
      }).should["throw"]();
    });

    it("returns an error if the record does not exist", function () {
      var store = new _Store2.default(NAME);
      var err = store.deleteSync("blabla");
      (err instanceof Error).should.be["true"];
      store = new _Store2.default(NAME, {
        type: "single"
      });
      err = store.deleteSync("blabla");
      (err instanceof Error).should.be["true"];
      store = new _Store2.default(NAME, {
        type: "memory"
      });
      err = store.deleteSync("12345");
      (err instanceof Error).should.be["true"];
    });
  });

  it("can pretty print the file content", function () {
    var store = new _Store2.default(NAME, {
      pretty: true
    });
    var id = store.saveSync("id", {
      p: "retty"
    });
    var content = _fs2.default.readFileSync("./" + NAME + "/id.json", "utf-8");
    content.should.equal("{\n  \"p\": \"retty\"\n}");
  });

  describe("'single' mode", function () {

    it("stores data in a single file", function (done) {
      var store = new _Store2.default(NAME, {
        type: 'single',
        pretty: true
      });

      _fs2.default.readFile("./" + NAME + ".json", "utf-8", function (err, content) {
        content.should.equal("{}");
        var d1 = {
          x: 0.6
        };
        var d2 = {
          z: -3
        };
        store.save("d1", d1, function (err) {
          should.not.exist(err);
          store.save("d2", d2, function (err) {
            should.not.exist(err);
            var f = _path2.default.join(process.cwd(), NAME + ".json");
            _fs2.default.readFile(f, "utf-8", function (err, content) {
              should.not.exist(err);
              content.should.equal("{\n  \"d1\": {\n    \"x\": 0.6\n  },\n  \"d2\": {\n    \"z\": -3\n  }\n}");
              done();
            });
          });
        });
      });
    });

    /*
    fs.rename 'overrides' an existing file
    even if its write protected
     */
    it("it checks for write protection", function (done) {
      var f = _path2.default.resolve(NAME + "/mydb.json");
      var store = new _Store2.default(f, {
        type: 'single'
      });
      store.saveSync('id', {
        some: 'data'
      });
      _fs2.default.chmodSync(f, '0444');
      store.save('foo', {
        bar: 'baz'
      }, function (err, id) {
        should.exist(err);
        _fs2.default.chmodSync(f, '0644');
        done();
      });
    });

    it("loads an existing db", function (done) {
      var store = new _Store2.default(NAME, {
        single: true
      });
      store.save("id1", {
        foo: "bar"
      }, function (err) {
        store = new _Store2.default(NAME, {
          single: true
        });
        _fs2.default.readFile("./" + NAME + ".json", "utf-8", function (err, content) {
          content.should.equal('{"id1":{"foo":"bar"}}');
          store.all(function (err, items) {
            should.not.exist(err);
            items.id1.should.eql({
              foo: "bar"
            });
            done();
          });
        });
      });
    });

    it("get data from a single file", function (done) {
      var store = new _Store2.default(NAME, {
        single: true
      });
      var data = {
        foo: "asdlöfj"
      };
      store.save(data, function (err, id) {
        store.get(id, function (err, o) {
          o.foo.should.equal("asdlöfj");
          done();
        });
      });
    });

    it("can delete an object", function (done) {
      var store = new _Store2.default(NAME, {
        single: true
      });
      var data = {
        y: 88
      };
      var f = _path2.default.join(process.cwd(), NAME + ".json");
      store.save(data, function (err, id) {
        _fs2.default.readFile(f, "utf-8", function (err, content) {
          (content.length > 7).should.be.truthy;
          store["delete"](id, function (err) {
            _fs2.default.readFile(f, "utf-8", function (err, content) {
              should.not.exist(err);
              content.should.equal("{}");
              done();
            });
          });
        });
      });
    });

    it("can be defined if the name is a file", function (done) {
      var store = new _Store2.default('./' + NAME + '/foo.json');
      store._single.should.be["true"];
      var f = _path2.default.join(process.cwd(), "./" + NAME + "/foo.json");
      return _fs2.default.readFile(f, "utf-8", function (err, content) {
        should.not.exist(err);
        content.should.equal("{}");
        return done();
      });
    });
  });

  describe("'memory' mode", function () {

    it("does not write the data to a file", function (done) {
      var store = new _Store2.default(NAME, {
        type: 'memory'
      });
      var data = {
        y: 78
      };
      store.save("id", data, function (err, id) {
        should.not.exist(err);
        _fs2.default.readFile("./" + NAME + "/id.json", "utf-8", function (err, content) {
          should.exist(err);
          should.not.exist(content);
          store.allSync().should.eql({
            id: {
              y: 78
            }
          });
          store.saveSync('foo', {
            bar: 'baz'
          });
          store.all(function (err, d) {
            should.not.exist(err);
            d.should.eql({
              foo: {
                bar: 'baz'
              },
              id: {
                y: 78
              }
            });
            store.deleteSync('id');
            store.allSync().should.eql({
              foo: {
                bar: 'baz'
              }
            });
            should["throw"](function () {
              return _fs2.default.readFileSync("./" + NAME + "/id.json", "utf-8");
            });
            done();
          });
        });
      });
    });
  });
});
