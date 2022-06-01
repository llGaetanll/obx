import * as obx from "./index";

const deepCopyCheck = (a, b) =>
  obx.reduce_r(
    a,
    (acc, [k, v], p) => {
      console.log(acc, b, k, v, p);
      return acc && b[p] !== undefined && b[p] !== v;
    },
    true
  );

describe("eq", () => {
  test("equal empty objects", () => {
    expect(obx.eq({}, {})).toBe(true);
  });

  test("equal simple objects", () => {
    expect(obx.eq({ foo: "bar" }, { foo: "bar" })).toBe(true);
  });

  test("equal different order objects", () => {
    expect(obx.eq({ foo: "bar", bar: "baz" }, { bar: "baz", foo: "bar" })).toBe(
      true
    );
  });

  test("equal empty arrays", () => {
    expect(obx.eq([], [])).toBe(true);
  });

  test("equal simple arrays", () => {
    expect(obx.eq([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test("equal different order arrays", () => {
    // Note that array order matters
    expect(obx.eq([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  test("equal undefined arrays", () => {
    const a = [];
    a[1] = 1;

    const b = [undefined, 1];

    expect(obx.eq(a, b)).toBe(true); // -> false
  });

  test("equal nested objects", () => {
    expect(
      obx.eq(
        { foo: { bar: { baz: [1, 2, 3] } } },
        { foo: { bar: { baz: [1, 2, 3] } } }
      )
    ).toBe(true);
  });

  test("equal nested objects 2", () => {
    expect(obx.eq({ foo: [{ foo: "bar" }] }, { foo: [{ foo: "bar" }] })).toBe(
      true
    );
  });

  test("different empty objects", () => {
    expect(obx.eq({}, [])).toBe(false);
    expect(obx.eq([], {})).toBe(false);
  });

  test("different object keys", () => {
    expect(obx.eq({ foo: "bar" }, { baz: "bar" })).toBe(false);
  });

  test("different object values", () => {
    expect(obx.eq({ foo: "bar" }, { foo: "baz" })).toBe(false);
  });

  test("different objects", () => {
    expect(obx.eq({ foo: "bar" }, { bar: "baz" })).toBe(false);
  });

  test("different arrays", () => {
    // Note that array order matters
    expect(obx.eq([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  test("different nested arrays", () => {
    expect(
      obx.eq(
        { foo: { bar: { baz: [1, 2, 3] } } },
        { foo: { bar: { baz: [3, 2, 1] } } }
      )
    ).toBe(false);
  });

  test("different objects depth 0", () => {
    expect(obx.eq({ foo: "bar" }, { foo: "baz" }, 0)).toBe(true);
  });

  test("different objects depth 1", () => {
    expect(obx.eq({ foo: { bar: "baz" } }, { foo: {} }, 1)).toBe(true);
  });

  test("different objects depth 2", () => {
    expect(obx.eq({ foo: { bar: "baz" } }, { foo: {} }, 2)).toBe(false);
  });

  test("different arrays depth 0", () => {
    expect(obx.eq([1, 2, 3], [3, 2, 1], 0)).toBe(true);
  });

  test("different arrays depth 1", () => {
    expect(obx.eq([[1], [1], [1]], [[], [], []], 1)).toBe(true);
  });

  test("different arrays depth 2", () => {
    expect(
      obx.eq(
        [{ foo: 1, bar: [1, 2, 3] }, {}, {}],
        [{ foo: 1, bar: [4, 5, 6] }, {}, {}],
        2
      )
    ).toBe(true);
  });

  test("functions", () => {
    // Functions are impossible to diff, this test is only here to verify that we don't diff them
    expect(obx.eq({ foo: (x) => x + 1 }, { foo: (x) => x + 2 })).toBe(true);
  });
});

describe("set", () => {
  test("empty object", () => {
    const o = {};
    obx.set(o, "foo", "bar");

    expect(obx.eq(o, { foo: "bar" })).toBe(true);
  });

  test("deep empty object", () => {
    const o = {};
    obx.set(o, "foo.bar.baz", "bar");

    expect(obx.eq(o, { foo: { bar: { baz: "bar" } } })).toBe(true);
  });

  test("empty object with array", () => {
    const o = {};
    obx.set(o, "foo.0", 1);

    expect(obx.eq(o, { foo: [1] })).toBe(true);
  });

  test("empty object with deep array", () => {
    const o = {};
    obx.set(o, "foo.0.bar", "baz");

    expect(obx.eq(o, { foo: [{ bar: "baz" }] })).toBe(true);
  });

  test("empty object with deep array index 2", () => {
    const o = {};
    obx.set(o, "foo.2.bar", "baz");

    const arr = [];
    arr[2] = { bar: "baz" };
    const res = { foo: arr };

    expect(obx.eq(o, res)).toBe(true);
  });

  test("deep undefined array index 2", () => {
    const o = {};
    obx.set(o, "foo.2.bar", "baz");

    const res = { foo: [undefined, undefined, { bar: "baz" }] };

    expect(obx.eq(o, res)).toBe(true);
  });
});

describe("get", () => {
  test("empty object", () => {
    const o = {};

    expect(obx.get(o, "foo")).toBe(null);
    expect(obx.eq(o, {})).toBe(true); // o should not change
  });

  test("simple object", () => {
    const o = { foo: "bar" };

    expect(obx.get(o, "foo")).toBe("bar");
    expect(obx.eq(o, { foo: "bar" })).toBe(true); // o should not change
  });

  test("deep object", () => {
    const o = { foo: { bar: "baz" } };

    expect(obx.get(o, "foo.bar")).toBe("baz");
    expect(obx.eq(o, { foo: { bar: "baz" } })).toBe(true); // o should not change
  });

  test("empty array", () => {
    const o = [];

    expect(obx.get(o, "foo")).toBe(null);
    expect(obx.get(o, "0")).toBe(null);
  });

  test("simple array", () => {
    const o = [1, 2, 3];

    expect(obx.get(o, "1")).toBe(2);
    expect(obx.get(o, "3")).toBe(null); // invalid key
  });

  test("deep array", () => {
    const o = [
      { foo: { bar: "baz" } },
      { foo: { bar: "baz" } },
      { foo: { bar: "baz" } },
    ];

    expect(obx.get(o, "1.foo.bar")).toBe("baz");
    expect(obx.get(o, "0.foo.baz")).toBe(null); // invalid key
  });

  test("simple invalid key", () => {
    const o = [{ foo: "bar" }];

    expect(obx.get(o, "bar")).toBe(null);
  });

  test("deep invalid key", () => {
    const o = [{ foo: "bar" }];

    expect(obx.get(o, "bar.foo.baz.0.haz")).toBe(null);
  });
});

describe("len", () => {
  test("empty object", () => {
    expect(obx.len({})).toBe(0);
  });

  test("simple object", () => {
    expect(obx.len({ foo: "bar" })).toBe(1);
  });

  test("long object", () => {
    expect(
      obx.len({
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
      })
    ).toBe(10);
  });

  test("nested object", () => {
    // remember that this is non-recursive length, so the number of keys is 1
    expect(obx.len({ foo: { bar: "baz" } }, 1)).toBe(1);
  });

  test("empty array", () => {
    expect(obx.len([], 1)).toBe(0);
  });

  test("simple array", () => {
    expect(obx.len([1], 1)).toBe(1);
  });

  test("long array", () => {
    expect(obx.len([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)).toBe(10);
  });

  test("nested array", () => {
    // remember that this is non-recursive length, so the number of values is 2
    expect(
      obx.len(
        [
          [1, 2, 3],
          [1, 2, 3],
        ],
        1
      )
    ).toBe(2);
  });
});

describe("rec len", () => {
  test("empty object", () => {
    expect(obx.len({})).toBe(0);
  });

  test("simple object", () => {
    expect(obx.len({ foo: "bar" })).toBe(1);
  });

  test("deep object", () => {
    // Note that len_r counts the number of *keys* of an object, hence 7
    expect(
      obx.len({
        foo: {
          bar: "baz",
          baz: "bar",
          haz: [1, 2, 3],
        },
      })
    ).toBe(7);
  });

  test("empty array", () => {
    expect(obx.len([])).toBe(0);
  });

  test("simple array", () => {
    expect(obx.len([1, 2, 3])).toBe(3);
  });

  test("deep array", () => {
    // array indicies are counted, hence 12
    expect(
      obx.len([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ])
    ).toBe(12);
  });

  test("object depth 0", () => {
    expect(obx.len({ foo: "bar" }, 0)).toBe(0);
  });

  test("object depth 1", () => {
    expect(obx.len({ foo: "bar", bar: [1, 2, 3] }, 1)).toBe(2);
  });

  test("array depth 0", () => {
    expect(obx.len([1, 2, 3], 0)).toBe(0);
  });

  test("array depth 1", () => {
    expect(
      obx.len(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        1
      )
    ).toBe(3);
  });
});

describe("empty", () => {
  test("empty object", () => {
    expect(obx.empty({})).toBe(true);
  });

  test("empty array", () => {
    // Note that empty only works for object types
    expect(obx.empty([])).toBe(false);
  });

  test("filled object", () => {
    expect(obx.empty({ foo: "bar" })).toBe(false);
  });

  test("filled array", () => {
    expect(obx.empty([1])).toBe(false);
  });

  test("undefined object", () => {
    expect(obx.empty({ foo: undefined })).toBe(false);
  });

  test("undefined array", () => {
    expect(obx.empty([undefined])).toBe(false);
  });
});

describe("cp", () => {
  test("empty object", () => {
    const o = {};
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("simple object", () => {
    const o = { foo: "bar" };
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("deep object", () => {
    const o = { foo: "bar", bar: { baz: "haz" } };
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("empty array", () => {
    const o = [];
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("simple array", () => {
    const o = [1, 2, 3];
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("deep array", () => {
    const o = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("complex object", () => {
    const o = {
      foo: "bar",
      bar: "baz",
      baz: [
        {
          foo: "bar",
          bar: 4,
        },
        {
          foo: "baz",
          baz: {
            foo: 3,
          },
        },
        {
          foo: { bar: { baz: { foo: { baz: 42 } } } },
        },
        [[[12]], 5, [60]],
      ],
    };
    const n = obx.cp(o);

    expect(obx.eq(o, n)).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });
});

describe("map", () => {
  test("empty object", () => {
    const o = {};

    // Note that map will callback on every value of the object, including sub objects!
    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
    const n = obx.map(o, emphasis, 1);

    expect(obx.eq(n, {})).toBe(true);
  });

  test("simple object", () => {
    const o = {
      foo: "bar",
      bar: "baz",
      baz: "foo",
    };

    // Note that map will callback on every value of the object, including sub objects!
    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
    const n = obx.map(o, emphasis, 1);

    expect(
      obx.eq(n, {
        foo: "bar!",
        bar: "baz!",
        baz: "foo!",
      })
    ).toBe(true);
    // expect(deepCopyCheck(n, o)).toBe(true);
  });

  test("deep object", () => {
    const o = {
      foo: "bar",
      bar: {
        baz: "foo",
      },
    };

    // Note that map will callback on every value of the object, including sub objects!
    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
    const n = obx.map(o, emphasis, 1);

    expect(
      obx.eq(n, {
        foo: "bar!",
        bar: {
          baz: "foo",
        },
      })
    ).toBe(true);
  });

  test("empty array", () => {
    const o = [];

    const n = obx.map(o, ([_, v]) => v + 1, 1);

    expect(obx.eq(n, [])).toBe(true);
  });

  test("simple array", () => {
    const o = [1, 2, 3];

    const n = obx.map(o, ([_, v]) => v + 1, 1);

    expect(obx.eq(n, [2, 3, 4])).toBe(true);
  });

  test("deep array", () => {
    const o = [1, [1, 2, 3], 3];

    const n = obx.map(o, ([_, v]) => (v instanceof Object ? v : v + 1), 1);

    expect(obx.eq(n, [2, [1, 2, 3], 4])).toBe(true);
  });
});

describe("rec map", () => {
  test("deep object", () => {
    const o = {
      foo: "bar",
      bar: {
        baz: {
          haz: "wow",
        },
        foo: "bar",
      },
      raz: "faz",
    };

    // Note that map will callback on every value of the object, including sub objects!
    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");

    const n = obx.map(o, emphasis);

    expect(
      obx.eq(n, {
        foo: "bar!",
        bar: {
          baz: {
            haz: "wow!",
          },
          foo: "bar!",
        },
        raz: "faz!",
      })
    ).toBe(true);
  });

  test("complex object", () => {
    const o = {
      foo: "bar",
      bar: [
        { foo: "bar", bar: "baz" },
        { foo: "bar", bar: "baz" },
        { foo: "bar", bar: "baz" },
      ],
      raz: "faz",
    };

    // Note that map will callback on every value of the object, including sub objects.
    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
    const n = obx.map(o, emphasis);

    expect(
      obx.eq(n, {
        foo: "bar!",
        bar: [
          { foo: "bar!", bar: "baz!" },
          { foo: "bar!", bar: "baz!" },
          { foo: "bar!", bar: "baz!" },
        ],
        raz: "faz!",
      })
    ).toBe(true);
  });

  test("simple object depth 0", () => {
    const o = {
      foo: "bar",
      bar: "baz",
    };

    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");

    // depth 0 should have no effect
    const n = obx.map(o, emphasis, 0);

    expect(obx.eq(n, { foo: "bar", bar: "baz" })).toBe(true);
  });

  test("deep object depth 2", () => {
    const o = {
      foo: "bar",
      bar: {
        baz: ["foo", "bar", "baz"],
      },
    };

    const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
    const n = obx.map(o, emphasis, 2);

    expect(
      obx.eq(n, { foo: "bar!", bar: { baz: ["foo", "bar", "baz"] } })
    ).toBe(true);
  });
});

describe("reduce", () => {
  test("empty object", () => {
    const o = {};

    const combineVals = (a, [k, v]) => [...a, v];
    const n = obx.reduce(o, combineVals, [], 1);

    expect(obx.eq(n, [])).toBe(true);
  });

  test("simple object values", () => {
    const o = { foo: "bar", bar: "baz" };

    const combineVals = (a, [k, v]) => [...a, v];
    const n = obx.reduce(o, combineVals, [], 1).join(", ");

    expect(n).toBe("bar, baz");
  });

  test("simple object keys", () => {
    const o = { foo: "bar", bar: "baz" };

    const combineKeys = (a, [k, v]) => [...a, k];
    const n = obx.reduce(o, combineKeys, [], 1).join(", ");

    expect(n).toBe("foo, bar");
  });

  test("empty array", () => {
    const o = [];

    const combineVals = (a, [k, v]) => [...a, v];
    const n = obx.reduce(o, combineVals, [], 1);

    expect(obx.eq(n, [])).toBe(true);
  });

  test("simple array values", () => {
    const o = ["foo", "bar", "baz"];

    const combineVals = (a, [k, v]) => [...a, v];
    const n = obx.reduce(o, combineVals, [], 1).join(", ");

    expect(n).toBe("foo, bar, baz");
  });

  test("simple array keys", () => {
    const o = [1, 2, 3, 4, 5];

    const combineVals = (a, [k, v]) => a + parseInt(k);
    const n = obx.reduce(o, combineVals, 0, 1);

    expect(n).toBe(10);
  });
});

describe("rec reduce", () => {
  test("flatten deep object", () => {
    const o = {
      isActive: true,
      balance: "$3,722.54",
      age: 39,
      friends: [
        {
          id: 0,
          name: "Patrice Meyer",
        },
        {
          id: 1,
          name: "Lee Watson",
        },
        {
          id: 2,
          name: "Strong Munoz",
        },
      ],
    };

    const flatten = (a, [k, v]) =>
      v instanceof Object ? a : k in a ? a : ((a[k] = v), a);

    const n = obx.reduce(o, flatten, {});

    expect(
      obx.eq(n, {
        isActive: true,
        balance: "$3,722.54",
        age: 39,
        id: 0,
        name: "Patrice Meyer",
      })
    ).toBe(true);
  });

  test("invert object", () => {
    const o = {
      isActive: true,
      balance: "$3,722.54",
      age: 39,
      friends: [
        {
          id: 0,
          name: "Patrice Meyer",
        },
        {
          id: 1,
          name: "Lee Watson",
        },
        {
          id: 2,
          name: "Strong Munoz",
        },
      ],
    };

    // this also flattens the object
    const invert = (a, [k, v]) => (v instanceof Object ? a : ((a[v] = k), a));
    const n = obx.reduce(o, invert, {});

    expect(
      obx.eq(n, {
        true: "isActive",
        "$3,722.54": "balance",
        39: "age",
        0: "id",
        "Patrice Meyer": "name",
        1: "id",
        "Lee Watson": "name",
        2: "id",
        "Strong Munoz": "name",
      })
    ).toBe(true);
  });
});

describe("zip", () => {
  test("simple objects", () => {
    const a = {
      foo: "bar",
      bar: "baz",
      baz: "haz",
    };

    const b = [4, 5, 6];

    const z = obx.zip(a, b);

    expect(obx.eq(z.next().value, ["bar", 4])).toBe(true);
    expect(obx.eq(z.next().value, ["baz", 5])).toBe(true);
    expect(obx.eq(z.next().value, ["haz", 6])).toBe(true);
  });

  test("deep objects", () => {
    const a = {
      foo: "bar",
      bar: {
        baz: "haz",
      },
    };

    const b = [4, 5];

    const z = obx.zip(a, b);

    const v1 = z.next().value;
    const v2 = z.next().value;

    expect(obx.eq(v1, ["bar", 4])).toBe(true);
    expect(obx.eq(v2, ["haz", 5])).toBe(true);
    expect(obx.eq(v2, [{ baz: "haz" }, 5])).toBe(false);
  });

  test("many objects", () => {
    const a = ["a", "b", "c"];
    const b = [1, 2, 3];
    const c = ["x", "y", "z"];
    const d = [3, 2, 1];

    const z = obx.zip(a, b, c, d);

    const v1 = z.next().value;
    const v2 = z.next().value;
    const v3 = z.next().value;

    expect(obx.eq(v1, ["a", 1, "x", 3])).toBe(true);
    expect(obx.eq(v2, ["b", 2, "y", 2])).toBe(true);
    expect(obx.eq(v3, ["c", 3, "z", 1])).toBe(true);
  });

  test("stop early", () => {
    const a = ["a", "b", "c"];
    const b = [1];

    const z = obx.zip(a, b);

    const v1 = z.next().value;
    const v2 = z.next().value;

    expect(obx.eq(v1, ["a", 1])).toBe(true);
    expect(v2).toBe(undefined);
  });

  test("only one object", () => {
    const o = {
      foo: "foo",
      bar: "bar",
      baz: [
        {
          id: 0,
          name: "Patrice Meyer",
        },
        {
          id: 1,
          name: "Lee Watson",
        },
        {
          id: 2,
          name: "Strong Munoz",
        },
      ],
    };

    const z = obx.zip(o);

    expect(obx.eq(z.next().value, ["foo"])).toBe(true);
    expect(obx.eq(z.next().value, ["bar"])).toBe(true);
    expect(obx.eq(z.next().value, [0])).toBe(true);
    expect(obx.eq(z.next().value, ["Patrice Meyer"])).toBe(true);
    expect(obx.eq(z.next().value, [1])).toBe(true);
    expect(obx.eq(z.next().value, ["Lee Watson"])).toBe(true);
    expect(obx.eq(z.next().value, [2])).toBe(true);
    expect(obx.eq(z.next().value, ["Strong Munoz"])).toBe(true);
  });
});

describe("sub", () => {
  test("empty object", () => {
    const a = {};
    const b = {};

    obx.sub(a, b);
    expect(obx.eq(a, {})).toBe(true);
  });

  test("simple object", () => {
    const a = {
      foo: "bar",
      bar: "baz",
      list: [1, 2, 3],
    };
    const b = {
      foo: "bar",
      list: [1, 2, 3],
    };

    obx.sub(a, b);
    expect(obx.eq(a, { bar: "baz" })).toBe(true);
  });

  test("empty array", () => {
    const a = [];
    const b = [];

    obx.sub(a, b);
    expect(obx.eq(a, [])).toBe(true);
  });

  test("simple array", () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];

    obx.sub(a, b);
    expect(obx.eq(a, [])).toBe(true);
  });

  test("simple array 2", () => {
    const a = [{ foo: "bar" }, 2, { bar: "baz" }];
    const b = [];
    b[2] = { bar: "baz" };

    obx.sub(a, b);
    expect(obx.eq(a, [{ foo: "bar" }, 2])).toBe(true);
  });

  test("simple array 3", () => {
    const a = [1, 2, 3];
    const b = [1, 2];

    const res = [];
    res[2] = 3;

    obx.sub(a, b);
    expect(obx.eq(a, res)).toBe(true);
  });

  test("complex object", () => {
    const a = {
      foo: "bar",
      bar: "baz",
      baz: {
        haz: "baz",
        gaz: [
          {
            key: "val",
            foo: "bar",
          },
          2,
          3,
        ],
      },
    };
    const b = {
      bar: "baz",
      baz: {
        gaz: [
          {
            key: "var",
            foo: "ball",
          },
          2,
          3,
        ],
      },
    };

    const res = {
      foo: "bar",
      baz: {
        haz: "baz",
        gaz: [
          {
            key: "val",
            foo: "bar",
          },
        ],
      },
    };

    obx.sub(a, b);

    expect(obx.eq(a, res)).toBe(true);
  });
});

describe("add_i", () => {});
