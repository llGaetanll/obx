/* type checker */
const t = (d) =>
  d instanceof Function
    ? "f" // function
    : d instanceof Array
    ? "a" // array
    : d instanceof Object
    ? "o" // object
    : "p"; // primitive

// create iterator from object/array
// this ensures we aren't missing any keys
const iterObj = (o) => {
  const type = t(o);
  if (!"ao".includes(type)) throw new Error("Object must be passed to iterObj");

  if (type === "o") return Object.keys(o);

  // for arrays, iterate keys, return generator
  return (function* arrayIter() {
    let c = 0;
    for (let i = 0; i < o.length; i++) {
      c++;
      yield i;
    }

    return c;
  })();
};

/**
 * Assert that 2 objects are equal
 * Objects are equal if they have the same keys.
 *
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 * @param {number=} d Depth of equality check. Defaults to infinity
 */
export const eq = (a, b, d = -1) => {
  if (d === 0) return true;

  // check for same root object type
  if (t(a) !== t(b)) return false;

  if (t(a) === "o") {
    // assert that b is in a
    // and that a is in b
    for (const k of Object.keys(b)) if (!(k in a)) return false;
    for (const k of Object.keys(a)) if (!(k in b)) return false;
  }

  // objects and arrays are iterated differently
  const keys = iterObj(a);
  for (const k of keys) {
    // type check
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
 * Recursively find the number of keys of an object.
 *
 * @param {Object} o Object to find length of
 * @param {number=} d Depth of len. Defaults to infinity
 *
 * @example <caption>Simple object</caption>
 * obx.len({ foo: 'bar', bar: 'baz' }) // -> 2
 *
 * @example <caption>Recursive object, low depth</caption>
 * // Here depth is only computed at the top level
 * obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }, 1) // -> 2
 *
 * @example <caption>Recursive object, high depth</caption>
 * // Note: array keys are counted
 * obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }) // -> 7
 */
export const len = (o, d = -1) => reduce(o, (a) => a + 1, 0, d);

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
export const empty = (o) => eq(o, {});

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

  return reduce(o, fn, type === "a" ? [] : {}, d);
};

/**
 * Recursively map though all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {number=} d Depth of map. Defaults to infinity
 *
 * @example <caption>Basic Mapping</caption>
 *  const o = {
 *    foo: "bar",
 *    bar: "baz",
 *    baz: "foo",
 *  };
 *
 *  // Note that map will callback on every value of the object, including sub objects!
 *  const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 *
 *  obx.map(o, emphasis, 1);
 *  // -> {
 *  //     foo: "bar!",
 *  //     bar: "baz!",
 *  //     baz: "foo!",
 *  // }
 *
 * @example <caption>Recursive Mapping, low depth</caption>
 * // TODO
 *
 * @example <caption>Recursive Mapping, high depth</caption>
 * const o = {
 *    foo: "bar",
 *    bar: [
 *      { foo: "bar", bar: "baz" },
 *      { foo: "bar", bar: "baz" },
 *      { foo: "bar", bar: "baz" },
 *    ],
 *    raz: "faz",
 *  };
 *
 *  // Note that map will callback on every value of the object, including sub objects.
 *  const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 *  obx.map_r(o, emphasis);
 *  // -> {
 *  //       foo: "bar!",
 *  //       bar: [
 *  //         { foo: "bar!", bar: "baz!" },
 *  //         { foo: "bar!", bar: "baz!" },
 *  //         { foo: "bar!", bar: "baz!" },
 *  //       ],
 *  //       raz: "faz!",
 *  //    }
 */
export const map = (o, fn, d = -1) => {
  // this type check could be removed with TS
  const type = t(o);
  if (!"ao".includes(type)) throw new Error("Object must be passed to map");

  // n: new object
  // p: current object path
  // r: root object
  const aux = (o, fn, n, d, p, r) => {
    for (const [k, v] of Object.entries(o)) {
      // path string
      const _p = [...p, k].join(".");

      // callback is ran on all value types
      // n is mutated here
      set(n, _p, d !== 0 ? fn([k, v], _p, r) : v);

      // objects or arrays: recurse
      if (d !== 0 && "oa".includes(t(v))) aux(v, fn, n, d - 1, [...p, k], r);
    }

    return n;
  };

  return aux(o, fn, type === "a" ? [] : {}, d, [], o);
};

/**
 * Recursively reduce all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 * @param {number=} d Reduce depth. Defaults to infinity
 *
 * @example <caption>Basic Reduce</caption>
 * const o = { foo: "bar", bar: "baz" };
 *
 * const combineVals = (a, [k, v]) => [...a, v];
 * obx.reduce(o, combineVals, []).join(", ");
 * // -> "bar, baz"
 *
 * @example <caption>Recursive Reduce, low depth</caption>
 * // TODO
 *
 * @example <caption>Recursive Reduce, high depth</caption>
 *
 *  const o = {
 *    foo: "bar",
 *    bar: {
 *      baz: "haz",
 *    },
 *  };
 *
 *  const combineVals = (a, [k, v]) => (v instanceof Object ? a : [...a, v]);
 *  obx.reduce(o, combineVals, []).join(", ");
 *  // -> "bar, haz"
 */
export const reduce = (o, fn, a, d = -1) => {
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

// Object inorder traversal iterator
function* inorder(o) {
  for (const v of Object.values(o)) {
    if ("oa".includes(t(v))) yield* inorder(v);
    else yield v;
  }
}

/**
 * Group multiple objects into a single iterator
 * @param {...Object} o - Objects to be zipped together
 *
 * @example <caption>Stops at the first null value</caption>
 * const a = ["a", "b", "c"];
 * const b = [1];
 *
 * // loop runs only once
 * for (const z of obx.zip(a, b))
 *  console.log(z)
 * // -> ["a", 1]
 *
 * @example <caption>Recusive</caption>
 *  const a = {
 *   foo: "bar",
 *   bar: {
 *     baz: "haz",
 *   },
 * };
 *
 * const b = [4, 5];
 *
 * for (const z of obx.zip(a, b))
 *  console.log(z)
 * // -> ["bar", 4]
 * // -> ["haz", 5]
 *
 * @example <caption>More than 2 Objects</caption>
 * const a = ["a", "b", "c"];
 * const b = [1, 2, 3];
 * const c = ["x", "y", "z"];
 * const d = [3, 2, 1];
 *
 * for (const z of obx.zip(a, b, c, d))
 *  console.log(z)
 * // -> ["a", 1, "x", 3]
 * // -> ["b", 2, "y", 2]
 * // -> ["c", 3, "z", 1]
 */
export function* zip(...o) {
  const gens = [];

  // TODO: custom iterator: right now it's inorder traversal
  for (const _o of o) gens.push(inorder(_o));

  while (true) {
    const vals = [];
    for (const g of gens) {
      const n = g.next();

      // return as soon as one object is fully iterated
      if (n.done) return;

      vals.push(n.value);
    }

    yield vals;
  }
}

/**
 * Recursive, in-place object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
export const sub = (o, s, d = -1) => {
  if (d === 0) return;

  for (const k of Object.keys(o)) {
    if (t(o[k]) !== t(s[k])) continue;

    // we don't diff functions
    if (t(o[k]) === "f") continue;

    // objects or arrays
    if ("oa".includes(t(o[k]))) {
      sub(o[k], s[k], d - 1);
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
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
export const add = (o, a, d = -1) => {
  if (d === 0) return;

  for (const k of Object.keys(a)) {
    const type = t(a[k]);

    // objects or arrays
    if ("ao".includes(type)) {
      // init empty obj/arr
      if (!(k in o)) o[k] = type === "o" ? {} : [];
      add(o[k], a[k], d - 1);
    }

    if (type === "p" && !(k in o)) o[k] = a[k];
  }
};
