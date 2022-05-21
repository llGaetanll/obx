"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_i = exports.sub_i = exports.reduce_r = exports.reduce = exports.map_r = exports.map = exports.cp = exports.empty = exports.len_r = exports.len = exports.set = exports.get = exports.eq = exports.id = void 0;
/* type checker */
var t = function (d) {
    return d instanceof Function
        ? "f" // function
        : d instanceof Array
            ? "a" // array
            : d instanceof Object
                ? "o" // object
                : "p";
}; // primitive
/**
 * Assert that 2 objects are identical with same keys, in the same order
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 */
var id = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
exports.id = id;
// create iterator from object/array
// this ensures we aren't missing any keys
var iterObj = function (o) {
    if (o instanceof Array)
        // for arrays, iterate keys, return generator
        return (function arrayIter() {
            var c, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < o.length)) return [3 /*break*/, 4];
                        c++;
                        return [4 /*yield*/, i];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, c];
                }
            });
        })();
    if (o instanceof Object)
        return Object.keys(o);
    throw new Error("Object must be passed to iterObj");
};
/**
 * Assert that 2 objects are equal
 * Objects are equal if they have the same keys.
 *
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 * @param {number=} d Depth of equality check. Defaults to infinity
 */
var eq = function (a, b, d) {
    var e_1, _a, e_2, _b, e_3, _c;
    if (d === void 0) { d = -1; }
    if (d === 0)
        return true;
    // check for same root object type
    if (t(a) !== t(b))
        return false;
    if (t(a) === "o") {
        try {
            // assert that b is in a
            // and that a is in b
            for (var _d = __values(Object.keys(b)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var k = _e.value;
                if (!(k in a))
                    return false;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _f = __values(Object.keys(a)), _g = _f.next(); !_g.done; _g = _f.next()) {
                var k = _g.value;
                if (!(k in b))
                    return false;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    // objects and arrays are iterated differently
    var keys = iterObj(a);
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var k = keys_1_1.value;
            // type check
            if (t(a[k]) !== t(b[k]))
                return false;
            // asserting function equality is basically impossible
            if (t(a[k]) === "f")
                continue;
            // objects or arrays
            if ("oa".includes(t(a[k])))
                return (0, exports.eq)(a[k], b[k], d - 1);
            // primitive types
            if (t(a[k]) === "p" && a[k] !== b[k])
                return false;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_c = keys_1.return)) _c.call(keys_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return true;
};
exports.eq = eq;
/**
 * Get value from object
 *
 * @param {Object} o The object
 * @param {String} p Value path
 *
 * @example <caption>Get a deep key</caption>
 * obx.get("foo.bar", {
 *    foo: {
 *      bar: "baz"
 *    }
 * });
 * // -> "baz"
 *
 * @example <caption>Also works with arrays</caption>
 * obx.get("foo.2.baz", {
 *    foo: [
 *      {
 *        foo: 'foo'
 *      },
 *      {
 *        bar: 'bar'
 *      },
 *      {
 *        baz: 'baz'
 *      }
 *    ]
 * });
 * // -> "baz"
 *
 * @example <caption>No key? No problem.</caption>
 * obx.get("foo.2.baz", {
 *    foo: 'bar'
 * })
 * // -> null
 *
 */
var get = function (o, p) {
    var e_4, _a;
    var path = p.split(".");
    try {
        for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
            var d = path_1_1.value;
            if (!(d in o))
                return null;
            o = o[d];
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return o;
};
exports.get = get;
/**
 * Set value in object
 *
 * @param {Object} o The object
 * @param {String} p Value path
 * @param {Object} v Value to set
 *
 * @example <caption>Set deep key</caption>
 * const o = {}
 * obx.set(o, "foo.2.foo", 'bar')
 * // o -> {
 * //    foo: [<2 empty slots>, {
 * //      foo: 'bar'
 * //    }]
 * // }
 *
 */
var set = function (o, p, v) {
    var path = p.split(".");
    for (var i = 0; i < path.length; i++) {
        var d = path[i];
        if (i + 1 === path.length)
            return (o[d] = v);
        var n = path[i + 1];
        // deepen object
        if (!(d in o))
            o[d] = isNaN(n) ? {} : [];
        o = o[d];
    }
};
exports.set = set;
/**
 * Find the number of keys of an object.
 *
 * @param {Object} o Object to find length of
 *
 * @example <caption>Simple object</caption>
 * obx.len({ foo: 'bar', bar: 'baz' }) // -> 2
 *
 * @example <caption>Recursive object</caption>
 * // Note: use `len_r` for recursive length
 * obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }) // -> 2
 */
var len = function (o) { return Object.keys(o).length; };
exports.len = len;
/**
 * Recursively find the number of keys of an object.
 *
 * @param {Object} o Object to find length of
 * @param {number=} d Depth of len. Defaults to infinity
 *
 * @example <caption>Recursive object</caption>
 * // Note: array keys are counted
 * obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }) // -> 7
 */
var len_r = function (o, d) {
    if (d === void 0) { d = -1; }
    return (0, exports.reduce_r)(o, function (a) { return a + 1; }, 0, d);
};
exports.len_r = len_r;
/**
 * Assert that an object type is empty.
 *
 * @param {Object} o Object to find length of
 *
 * @example
 * obx.empty({}) // -> true
 *
 * @example
 * obx.empty({ foo: 'bar' }) // -> false
 *
 * @example
 * // only works for objects
 * obx.empty([]) // -> false
 */
var empty = function (o) { return (0, exports.eq)(o, {}); };
exports.empty = empty;
/**
 * Deep copy an object
 * @param {Object} o Object to copy
 * @param {number=} d Depth of copy. Defaults to infinity
 *
 * @example <caption>Copy by value, not by reference</caption>
 * const a = {
 *    foo: {
 *      bar: 'baz'
 *    }
 * }
 * const b = obx.cp(a)
 *
 * a.foo.bar = 'bar'
 * console.log(b)
 * // object remains the same
 * // -> {
 * //   foo: {
 * //     bar: 'baz'
 * //   }
 * // }
 */
var cp = function (o, d) {
    if (d === void 0) { d = -1; }
    // this type check could be removed with TS
    var type = t(o);
    if (!"ao".includes(type))
        throw new Error("Object must be passed to cp");
    var fn = function (a, _a, p) {
        var _b = __read(_a, 2), _ = _b[0], v = _b[1];
        // init object
        if (t(v) === "o")
            (0, exports.set)(a, p, {});
        // init array
        if (t(v) === "a")
            (0, exports.set)(a, p, []);
        // copy functions
        if (t(v) === "f")
            (0, exports.set)(a, p, v.bind);
        // copy primitives
        if (t(v) === "p")
            (0, exports.set)(a, p, v);
        return a;
    };
    return (0, exports.reduce_r)(o, fn, type === "a" ? [] : {}, d);
};
exports.cp = cp;
/**
 * Map though all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 *
 * @example <caption>Basic mapping</caption>
 *  const o = {
 *    foo: "bar",
 *    bar: "baz",
 *    baz: "foo",
 *  };
 *
 *  // Note that map will callback on every value of the object, including sub objects!
 *  const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 *
 *  obx.map(o, emphasis);
 *  // -> {
 *  //     foo: "bar!",
 *  //     bar: "baz!",
 *  //     baz: "foo!",
 *  // }
 */
var map = function (o, fn) { return (0, exports.map_r)(o, fn, 1); };
exports.map = map;
/**
 * Recursively map though all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {number=} d Depth of map. Defaults to infinity
 */
var map_r = function (o, fn, d) {
    if (d === void 0) { d = -1; }
    // this type check could be removed with TS
    var type = t(o);
    if (!"ao".includes(type))
        throw new Error("Object must be passed to map");
    // n: new object
    // p: current object path
    // r: root object
    var aux = function (o, fn, n, d, p, r) {
        var e_5, _a;
        try {
            for (var _b = __values(Object.entries(o)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                // path string
                var _p = __spreadArray(__spreadArray([], __read(p), false), [k], false).join(".");
                // callback is ran on all value types
                // n is mutated here
                (0, exports.set)(n, _p, d !== 0 ? fn([k, v], _p, r) : v);
                // objects or arrays: recurse
                if (d !== 0 && "oa".includes(t(v)))
                    aux(v, fn, n, d - 1, __spreadArray(__spreadArray([], __read(p), false), [k], false), r);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return n;
    };
    return aux(o, fn, type === "a" ? [] : {}, d, [], o);
};
exports.map_r = map_r;
/**
 * Reduce all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 */
var reduce = function (o, fn, a) { return (0, exports.reduce_r)(o, fn, a, 1); };
exports.reduce = reduce;
/**
 * Recursively reduce all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 * @param {number=} d Reduce depth. Defaults to infinity
 */
var reduce_r = function (o, fn, a, d) {
    if (d === void 0) { d = -1; }
    // p: current object path
    // r: root object
    var aux = function (o, fn, a, d, p, r) {
        var e_6, _a;
        if (d === 0)
            return a;
        try {
            for (var _b = __values(Object.entries(o)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                // callback is ran on all value types
                // accumulator is mutated here
                a = fn(a, [k, v], __spreadArray(__spreadArray([], __read(p), false), [k], false).join("."), r);
                // objects or arrays
                if ("oa".includes(t(v)))
                    a = aux(v, fn, a, d - 1, __spreadArray(__spreadArray([], __read(p), false), [k], false), r);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return a;
    };
    return aux(o, fn, a, d, [], o);
};
exports.reduce_r = reduce_r;
/**
 * Group multiple objects into a single iterator
 * @param {...Object} objects - Objects to be zipped together
 */
var zip = function () {
    var o = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        o[_i] = arguments[_i];
    }
};
/**
 * Recursive object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
var sub = function (o, s, d) {
    if (d === void 0) { d = -1; }
};
/**
 * Recursive, in-place object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
var sub_i = function (o, s, d) {
    var e_7, _a;
    if (d === void 0) { d = -1; }
    if (d === 0)
        return;
    try {
        for (var _b = __values(Object.keys(o)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var k = _c.value;
            if (t(o[k]) !== t(o[k]))
                continue;
            // we don't diff functions
            if (t(o[k]) === "f")
                continue;
            // objects or arrays
            if ("oa".includes(t(o[k]))) {
                (0, exports.sub_i)(o[k], s[k], d - 1);
                if ((0, exports.len)(o[k]) < 1)
                    delete o[k];
            }
            // primitive types
            if (t(o[k]) === "p" &&
                k in s &&
                s[k] === o[k])
                delete o[k];
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_7) throw e_7.error; }
    }
};
exports.sub_i = sub_i;
/**
 * Recursive object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
var add = function (o, s, d) {
    if (d === void 0) { d = -1; }
};
/**
 * Recursive, in-place object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
var add_i = function (o, a, d) {
    var e_8, _a;
    if (d === void 0) { d = -1; }
    if (d === 0)
        return;
    try {
        for (var _b = __values(Object.keys(a)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var k = _c.value;
            var type = t(a[k]);
            // objects or arrays
            if ("ao".includes(type)) {
                // init empty obj/arr
                if (!(k in o))
                    o[k] = type === "o" ? {} : [];
                (0, exports.add_i)(o[k], a[k], d - 1);
            }
            if (type === "p" && !(k in o))
                o[k] = a[k];
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_8) throw e_8.error; }
    }
};
exports.add_i = add_i;
//# sourceMappingURL=index.js.map