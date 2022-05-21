declare type OA = Object | Array<any>;
/**
 * Assert that 2 objects are identical with same keys, in the same order
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 */
export declare const id: (a: OA, b: OA) => boolean;
/**
 * Assert that 2 objects are equal
 * Objects are equal if they have the same keys.
 *
 * @param {Object} a Object 1
 * @param {Object} b Object 2
 * @param {number=} d Depth of equality check. Defaults to infinity
 */
export declare const eq: (a: OA, b: OA, d?: number) => boolean;
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
export declare const get: (o: Object, p: string) => Object | null;
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
export declare const set: (o: Object, p: string, v: Object) => Object | undefined;
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
export declare const len: (o: Object) => number;
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
export declare const len_r: (o: Object, d?: number) => any;
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
export declare const empty: (o: Object) => boolean;
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
export declare const cp: (o: Object, d?: number) => any;
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
export declare const map: (o: Object, fn: (keyValuePair: [key: string, value: any], path: string, o: Object) => void) => any;
/**
 * Recursively map though all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains [k, v] pair, path, object
 * @param {number=} d Depth of map. Defaults to infinity
 */
export declare const map_r: (o: Object, fn: (keyValuePair: [key: string, value: any], path: string, o: Object) => void, d?: number) => any;
/**
 * Reduce all top layer entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 */
export declare const reduce: (o: Object, fn: (accumulator: any, keyValuePair: [key: string, value: any], path: string, o: Object) => void, a: Object) => any;
/**
 * Recursively reduce all entries of an object
 * @param {Object} o Object to map through
 * @param {Function} fn Callback function. Contains accumulator, [k, v] pair, path, object
 * @param {Object} a Accumulator
 * @param {number=} d Reduce depth. Defaults to infinity
 */
export declare const reduce_r: (o: Object, fn: (accumulator: any, keyValuePair: [key: string, value: any], path: string, o: Object) => void, a: Object, d?: number) => any;
/**
 * Recursive, in-place object subtraction
 * @param {Object} o The object to be subtracted from. This object is mutated.
 * @param {Object} s The object to subtract with
 * @param {number=} d Depth of the subtraction. Defaults to infinity
 */
export declare const sub_i: (o: Object, s: Object, d?: number) => void;
/**
 * Recursive, in-place object addition. If both objects contain the same key, defaults to o
 * @param {Object} o The object to be added to.
 * @param {Object} a The object to add with
 * @param {number=} d Depth of the addition. Defaults to infinity
 */
export declare const add_i: (o: Object, a: Object, d?: number) => void;
export {};
//# sourceMappingURL=index.d.ts.map