type OA = Object | Array<any>;

/* type checker */
const t = (d: any) =>
    d instanceof Function
        ? "f" // function
        : d instanceof Array
        ? "a" // array
        : d instanceof Object
        ? "o" // object
        : "p"; // primitive

/**
 * Assert that 2 objects are identical with same keys, in the same order
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 */
export const id = (a: OA, b: OA) => JSON.stringify(a) === JSON.stringify(b);

// create iterator from object/array
// this ensures we aren't missing any keys
const iterObj = (o: OA) => {
    if (o instanceof Array)
        // for arrays, iterate keys, return generator
        return (function* arrayIter() {
            let c = 0;
            for (let i = 0; i < o.length; i++) {
                c++;
                yield i;
            }

            return c;
        })();
    if (o instanceof Object) return Object.keys(o);
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
export const eq = (a: OA, b: OA, d = -1): boolean => {
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
        if (t((a as any)[k]) !== t((b as any)[k])) return false;

        // asserting function equality is basically impossible
        if (t((a as any)[k]) === "f") continue;

        // objects or arrays
        if ("oa".includes(t((a as any)[k])))
            return eq((a as any)[k], (b as any)[k], d - 1);

        // primitive types
        if (t((a as any)[k]) === "p" && (a as any)[k] !== (b as any)[k])
            return false;
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
export const get = (o: Object, p: string) => {
    const path = p.split(".");

    for (let d of path) {
        if (!(d in o)) return null;

        o = (o as any)[d];
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
export const set = (o: Object, p: string, v: Object) => {
    const path = p.split(".");

    for (let i = 0; i < path.length; i++) {
        const d = path[i];

        if (i + 1 === path.length) return ((o as any)[d] = v);

        const n = path[i + 1];

        // deepen object
        if (!(d in o)) (o as any)[d] = isNaN(n as any) ? {} : [];

        o = (o as any)[d];
    }
};

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
export const len = (o: Object) => Object.keys(o).length;

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
export const len_r = (o: Object, d = -1) =>
    reduce_r(o, (a: number) => a + 1, 0, d);

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
export const empty = (o: Object) => eq(o, {});

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
export const cp = (o: Object, d = -1) => {
    // this type check could be removed with TS
    const type = t(o);
    if (!"ao".includes(type)) throw new Error("Object must be passed to cp");

    const fn = (a: any, [_, v]: any, p: any) => {
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
export const map = (
    o: Object,
    fn: (
        keyValuePair: [key: string, value: any],
        path: string,
        o: Object
    ) => void
) => map_r(o, fn, 1);

/**
 * Recursively map though all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {number=} d Depth of map. Defaults to infinity
 */
export const map_r = (
    o: Object,
    fn: (
        keyValuePair: [key: string, value: any],
        path: string,
        o: Object
    ) => void,
    d = -1
) => {
    // this type check could be removed with TS
    const type = t(o);
    if (!"ao".includes(type)) throw new Error("Object must be passed to map");

    // n: new object
    // p: current object path
    // r: root object
    const aux = (o: any, fn: any, n: any, d: any, p: any, r: any) => {
        for (const [k, v] of Object.entries(o)) {
            // path string
            const _p = [...p, k].join(".");

            // callback is ran on all value types
            // n is mutated here
            set(n, _p, d !== 0 ? fn([k, v], _p, r) : v);

            // objects or arrays: recurse
            if (d !== 0 && "oa".includes(t(v)))
                aux(v, fn, n, d - 1, [...p, k], r);
        }

        return n;
    };

    return aux(o, fn, type === "a" ? [] : {}, d, [], o);
};

/**
 * Reduce all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 */
export const reduce = (
    o: Object,
    fn: (
        accumulator: any,
        keyValuePair: [key: string, value: any],
        path: string,
        o: Object
    ) => void,
    a: Object
) => reduce_r(o, fn, a, 1);

/**
 * Recursively reduce all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 * @param {number=} d Reduce depth. Defaults to infinity
 */
export const reduce_r = (
    o: Object,
    fn: (
        accumulator: any,
        keyValuePair: [key: string, value: any],
        path: string,
        o: Object
    ) => void,
    a: Object,
    d = -1
) => {
    // p: current object path
    // r: root object
    const aux = (o: any, fn: any, a: any, d: any, p: any, r: any) => {
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
 * @param {...Object} objects - Objects to be zipped together
 */
const zip = (...o: Object[]) => {};

/**
 * Recursive object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
const sub = (o: Object, s: Object, d = -1) => {};

/**
 * Recursive, in-place object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
export const sub_i = (o: Object, s: Object, d = -1) => {
    if (d === 0) return;

    for (const k of Object.keys(o)) {
        if (t((o as any)[k]) !== t((o as any)[k])) continue;

        // we don't diff functions
        if (t((o as any)[k]) === "f") continue;

        // objects or arrays
        if ("oa".includes(t((o as any)[k]))) {
            sub_i((o as any)[k], (s as any)[k], d - 1);
            if (len((o as any)[k]) < 1) delete (o as any)[k];
        }

        // primitive types
        if (
            t((o as any)[k]) === "p" &&
            k &&
            s &&
            k in s &&
            (s as any)[k] === (o as any)[k]
        )
            delete (o as any)[k];
    }
};

/**
 * Recursive object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
const add = (o: Object, s: Object, d = -1) => {};

/**
 * Recursive, in-place object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
export const add_i = (o: Object, a: Object, d = -1) => {
    if (d === 0) return;

    for (const k of Object.keys(a)) {
        const type = t((a as any)[k]);

        // objects or arrays
        if ("ao".includes(type)) {
            // init empty obj/arr
            if (!(k in o)) (o as any)[k] = type === "o" ? {} : [];
            add_i((o as any)[k], (a as any)[k], d - 1);
        }

        if (type === "p" && !(k in o)) (o as any)[k] = (a as any)[k];
    }
};
