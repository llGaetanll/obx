/* type checker */
const t = (d) =>
  d instanceof Function
    ? "f" // function
    : d instanceof Array
    ? "a" // array
    : d instanceof Object
    ? "o" // object
    : "p"; // primitive

/**
 * Assert that 2 objects are identical.
 *
 * Identical objects have the same keys, in the same order
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 */
export const id = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Assert that 2 objects are equal
 * Objects are equal if they have the same keys.
 *
 * Note: for arrays, order matters.
 * i.e.
 *  eq([1, 2, 3], [3, 2, 1]) // -> false
 *
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 * @param {Object} d Depth of equality check. Defaults to infinity
 */
export const eq = (a, b, d = -1) => {
  if (d === 0) return true;

  // check for same root object type
  if (t(a) !== t(b)) return false;

  // assert that b is in a
  // and that a is in b
  for (const k of Object.keys(b)) if (!(k in a)) return false;
  for (const k of Object.keys(a)) if (!(k in b)) return false;

  for (const k of Object.keys(a)) {
    // check for same key type
    if (t(a[k]) !== t(b[k])) return false;

    // asserting function equality is basically impossible
    if (t(a[k]) === "f") continue;

    // objects or arrays
    if ("oa".includes(t(a[k]))) return eq(a[k], b[k], d - 1);

    // primitive types
    if (t(a[k]) === "p" && a[k] !== b[k]) return false;
  }

  return true;
};

// const path = "foo.0.path.test.deep.4.thing";

/**
 * Get value from object
 *
 * @param {Object} o The object
 * @param {String} p Value path
 */
export const get = (o, p) => {
  const path = p.split(".");

  for (let i = 0; i < path.length; i++) {
    const d = path[i];

    if (!(d in o)) return null;

    o = o[d];
  }

  return o;
};

/**
 * Set value in object
 *
 * @param {Object} o The object
 * @param {String} p Value path
 * @param {Object} v Value to set
 */
export const set = (o, p, v) => {
  const path = p.split(".");

  for (let i = 0; i < path.length; i++) {
    const d = path[i];

    if (i + 1 === path.length) return (o[d] = v);

    const n = path[i + 1];

    // deepen object
    if (!(d in o)) o[d] = isNaN(n) ? {} : [];

    o = o[d];
  }
};

/**
 * Find length of an object.
 *
 * The length of an object is determined by its number of keys.
 * @param {Object} o Object to find length of
 */
export const len = (o) => reduce(o, (a) => a + 1, 0);

/**
 * Recursively find the length of an object.
 *
 * The length of an object is determined by its number of keys.
 * @param {Object} o Object to find length of
 * @param {Object} d Depth of len. Defaults to infinity
 */
export const len_r = (o, d = -1) => reduce_r(o, (a) => a + 1, 0, d);

/**
 * Assert that an object type is empty.
 *
 * @param {Object} o Object to find length of
 */
export const empty = (o) => eq(o, {});

/**
 * Deep copy an object
 * @param {Object} o Object to copy
 * @param {Object} d Depth of copy. Defaults to infinity
 */
export const cp = (o, d = -1) => {
  // this type check could be removed with TS
  const type = t(o);
  if (!"ao".includes(type)) throw new Error("Object must be passed to cp");

  const fn = (a, [_, v], p) => {
    // init object
    if (t(v) === "o") set(a, p, {});

    // init array
    if (t(v) === "a") set(a, p, []);

    // copy functions
    if (t(v) === "f") set(a, p, v.bind);

    // copy primitives
    if (t(v) === "p") set(a, p, v);

    return a;
  };

  return reduce_r(o, fn, type === "a" ? [] : {}, d);
};

/**
 * Map though all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 */
export const map = (o, fn) => map_r(o, fn, 1);

/**
 * Recursively map though all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {Object} d Depth of map. Defaults to infinity
 */
export const map_r = (o, fn, d = -1) => {
  // p: current object path
  // r: root object
  const aux = (o, fn, d, p, r) => {
    if (d === 0 || len(o) === 0) return;

    for (const [k, v] of Object.entries(o)) {
      // objects or arrays
      if ("oa".includes(t(v))) aux(v, fn, d - 1, [...p, k], r);

      fn([k, v], p.join("."), r);
    }
  };

  return aux(o, fn, d, [], o);
};

/**
 * Reduce all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {Object} a Accumulator
 */
export const reduce = (o, fn, a) => reduce_r(o, fn, a, 1);

/**
 * Recursively reduce all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 * @param {Object} d Reduce depth. Defaults to infinity
 */
export const reduce_r = (o, fn, a, d = -1) => {
  // p: current object path
  // r: root object
  const aux = (o, fn, a, d, p, r) => {
    if (d === 0) return a;

    for (const [k, v] of Object.entries(o)) {
      // callback is ran on all value types
      // accumulator is mutated here
      a = fn(a, [k, v], [...p, k].join("."), r);

      // objects or arrays
      if ("oa".includes(t(v))) a = aux(v, fn, a, d - 1, [...p, k], r);
    }

    return a;
  };

  return aux(o, fn, a, d, [], o);
};

/**
 * Group multiple objects into a single iterator
 * TODO
 */
export const zip = (...d) => {};

/**
 * Recursive, in-place object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {Object} d Depth of the subtraction. Defaults to infinity
 */
export const sub_i = (o, s, d = -1) => {
  if (d === 0) return;

  for (const k of Object.keys(o)) {
    if (t(o[k]) !== t(s[k])) continue;

    // we don't diff functions
    if (t(o[k]) === "f") continue;

    // objects or arrays
    if ("oa".includes(t(o[k]))) {
      sub_i(o[k], s[k], d - 1);
      if (len(o[k]) < 1) delete o[k];
    }

    // primitive types
    if (t(o[k]) === "p" && k in s && s[k] === o[k]) delete o[k];
  }
};

/**
 * Recursive, in-place object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {Object} d Depth of the addition. Defaults to infinity
 */
export const add_i = (o, a, d = -1) => {
  if (d === 0) return;

  for (const k of Object.keys(a)) {
    const type = t(a[k]);

    // objects or arrays
    if ("ao".includes(type)) {
      // init empty obj/arr
      if (!(k in o)) o[k] = type === "o" ? {} : [];
      add_i(o[k], a[k], d - 1);
    }

    if (type === "p" && !(k in o)) o[k] = a[k];
  }
};
