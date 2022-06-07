<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/llGaetanll/obx">
    <img src="docs/img/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">@almela/obx</h3>

  <p align="center">
    obx - objects extended
    <br />
    <a href="https://github.com/llGaetanll/obx#docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@almela/obx">View on NPM</a>
    ·
    <a href="https://github.com/llGaetanll/obx/issues">Report Bug</a>
    ·
    <a href="https://github.com/llGaetanll/obx/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about">About</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#usage">Usage</a></li>
    </ul>
    <li><a href="#docs">Docs</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About
obx is a super fast, tiny, well documented, and battle-tested object manipulation library for Javascript.



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- INSTALLATION -->
## Getting Started

### Installation
Install with npm
   ```sh
   npm i @almela/obx
   ```
or with yarn
   ```sh
  yarn add @almela/obx 
   ```

### Usage
In your file, simply add
```js
import * as obx from '@almela/obx'
```
or simply import select functions
```js
import { eq, cp } from '@almela/obx'
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Docs
For even more examples, see the [tests](https://github.com/llGaetanll/obx/blob/master/src/index.test.js).

### Functions

* [eq(a, b, params)](#eq)
* [cp(o, params)](#cp)
* [get(o, p)](#get)
* [set(o, p, v)](#set)
* [len(o, params)](#len)
* [map(o, fn, params)](#map)
* [reduce(o, fn, a, params)](#reduce)
* [zip(objs, params)](#zip)
* [sub(o, s, params)](#sub)
* [add(o, a, params)](#add)
* [isEmptyObj(o)](#isEmptyObj)
* [isEmptyArr(a)](#isEmptyArr)

### `eq`
Assert that two objects are equal.
Objects are equal if they have the same keys and values.

**Params**

- `a`  : <code>Object</code> - *Object 1* 
- `b`  : <code>Object</code> - *Object 2* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of equality check. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Object order doesn&#x27;t matter
```js
obx.eq(
  { foo: "bar", bar: "baz" },
  { bar: "baz", foo: "bar" }
)
// -> true
```
With Arrays
```js
obx.eq([1, 2, 3], [1, 2, 3])
// -> true
```
Array order does matter!
```js
obx.eq([1, 2, 3], [3, 2, 1])
// -> false
```
Custom depth
```js
obx.eq({ foo: "bar" }, { foo: "baz" }, { depth: 0 })
// -> true
```

```js
obx.eq({ foo: { bar: "baz" } }, { foo: {} }, { depth: 1 })
// -> true
```

```js
obx.eq({ foo: { bar: "baz" } }, { foo: {} }, { depth: 2 })
// -> false
```
Functions
```js
// Unfortunately, functions are basically impossible to
// diff. `eq` assumes that all functions are the same.
obx.eq({ foo: (x) => x + 1 }, { foo: (x) => x + 2 })
// -> true
```
</details>

### `cp`
Deep copy an object.

**Params**

- `o`  : <code>Object</code> - *Object to copy* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of copy. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Copy by value, not by reference
```js
const a = {
   foo: {
     bar: 'baz'
   }
}
const b = obx.cp(a)

a.foo.bar = 'bar'
console.log(b)
// object remains the same
// -> {
//   foo: {
//     bar: 'baz'
//   }
// }
```
</details>

### `get`
Get value from object.

**Params**

- `o`  : <code>Object</code> - *The object* 
- `p`  : <code>String</code> - *Value path* 




<details>
<summary><b>Examples</b></summary>

Get a deep key
```js
obx.get("foo.bar", {
   foo: {
     bar: "baz"
   }
});
// -> "baz"
```
Also works with arrays
```js
obx.get("foo.2.baz", {
   foo: [
     {
       foo: 'foo'
     },
     {
       bar: 'bar'
     },
     {
       baz: 'baz'
     }
   ]
});
// -> "baz"
```
No key? No problem.
```js
obx.get("foo.2.baz", {
   foo: 'bar'
})
// -> null
```
</details>

### `set`
Set value in object.

**Params**

- `o`  : <code>Object</code> - *The object to be mutated* 
- `p`  : <code>String</code> - *Value path* 
- `v`  : <code>Object</code> - *Value to set* 




<details>
<summary><b>Examples</b></summary>


```js
const o = {}
obx.set(o, "foo.bar.baz.haz", "hello")
// -> {
//   foo: {
//     bar: {
//       baz: {
//         haz: "hello"
//       }
//     }
//   }
// }
```

```js
const o = {}
obx.set(o, "foo.2.foo", 'bar')
// o -> {
//    foo: [<2 empty slots>, {
//      foo: 'bar'
//    }]
// }
```
</details>

### `len`
Recursively find the number of keys of an object.
Note that this includes object-valued keys.

**Params**

- `o`  : <code>Object</code> - *Object to find length of* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of len check. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Simple object
```js
obx.len({ foo: 'bar', bar: 'baz' }) // -> 2
```
Recursive object, depth 1
```js
// Here depth is only computed at the top level
obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }, { depth: 1 }) // -> 2
```
Recursive object, infinite depth
```js
// Note: array keys are counted
obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }) // -> 7
```
</details>

### `map`
Recursively map though all entries of an object.
Note that map will also iterate through object-valued keys.

**Params**

- `o`  : <code>Object</code> - *Object to map through* 
- `fn`  : <code>function</code> - *Callback function. Contains [k, v] pair, path, object* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of map. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Basic Mapping
```js
 const o = {
   foo: "bar",
   bar: "baz",
   baz: "foo",
 };

 // Note that map will callback on every value of the object, including sub objects!
 const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");

 // Note that depth could be anything here, since this is just a flat object.
 obx.map(o, emphasis, { depth: 1 });
 // -> {
 //      foo: "bar!",
 //      bar: "baz!",
 //      baz: "foo!",
 //    }
```
Recursive Mapping, low depth
```js
 const o = {
   foo: "bar",
   bar: {
     baz: "foo",
   },
 };

 // Note that map will callback on every value of the object, including sub objects!
 const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 obx.map(o, emphasis, { depth: 1 });
 // -> {
 //      foo: "bar!",
 //      bar: {
 //        baz: "foo",
 //      }
 //    }
 //
 //    Note that the inner key is unchanged.
```
Recursive Mapping, high depth
```js
const o = {
   foo: "bar",
   bar: [
     { foo: "bar", bar: "baz" },
     { foo: "bar", bar: "baz" },
     { foo: "bar", bar: "baz" },
   ],
   raz: "faz",
 };

 // Note that map will callback on every value of the object, including sub objects!
 const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 obx.map(o, emphasis);
 // -> {
 //       foo: "bar!",
 //       bar: [
 //         { foo: "bar!", bar: "baz!" },
 //         { foo: "bar!", bar: "baz!" },
 //         { foo: "bar!", bar: "baz!" },
 //       ],
 //       raz: "faz!",
 //    }
```
</details>

### `reduce`
Recursively reduce through all entries of an object.
Note that reduce will also iterate through object-valued keys.

**Params**

- `o`  : <code>Object</code> - *Object to map through* 
- `fn`  : <code>function</code> - *Callback function* 
- `a`  : <code>Object</code> - *Accumulator* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of reduce. Defaults to infinity* 
    - `[.iter]`  : <code>function</code> - *Iterator used by reduce. Defaults to inorder traversal.* 




<details>
<summary><b>Examples</b></summary>

Flat object
```js
const o = { foo: "bar", bar: "baz" };

const combineVals = (a, [k, v]) => [...a, v];
obx.reduce(o, combineVals, []).join(", ");
// -> "bar, baz"
```
Deeper object
```js
const o = {
  foo: "bar",
  bar: {
    baz: "haz",
  },
};

const combineVals = (a, [k, v]) => (v instanceof Object ? a : [...a, v]);
obx.reduce(o, combineVals, []).join(", ");
// -> "bar, haz"
```
Custom depth
```js
const o = {
  foo: "bar",
  bar: {
    baz: {
      haz: "wow",
    },
    foo: "bar",
  },
  raz: {
    faz: "maz",
    gaz: 'haz',
    haz: [
      { maz: 'waz' },
      { foo: 'moo' }
    ]
  },
}

const combineVals = (a, [k, v]) => (v instanceof Object ? a : [...a, v]);
obx.reduce(o, combineVals, [], { depth: 2 }).join(", ");
// -> "bar, bar, maz, haz"
// Only gets keys down to depth 2
```
</details>

### `zip`
Group multiple objects into a single iterator.
Note that zip will also iterate through object-valued keys.

**Params**

- `objs`  : <code>Array</code> - *Array of objects to be zipped together.* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of zip. Defaults to infinity* 
    - `[.key]`  : <code>Boolean</code> - *Whether zip should return object keys. Defaults to `false`* 
    - `[.val]`  : <code>Boolean</code> - *Whether zip should return object values. Defaults to `true`* 
    - `[.last]`  : <code>Boolean</code> - *Whether zip should stop iterating when the last object is done, as opposed to the first. Defaults to `false`* 
    - `[.iter]`  : <code>function</code> - *Iterator used by zip. Defaults to inorder traversal.* 




<details>
<summary><b>Examples</b></summary>

Stops at the first null value
```js
const a = ["a", "b", "c"];
const b = [1];

// loop runs only once
for (const z of obx.zip([a, b]))
 console.log(z)
// -> ["a", 1]
```
Recursive
```js
 const a = {
  foo: "bar",
  bar: {
    baz: "haz",
  },
};

const b = [4, 5];

for (const z of obx.zip([a, b]))
 console.log(z)
// -> ["bar", 4]
// -> ["haz", 5]
```
More than 2 Objects
```js
const a = ["a", "b", "c"];
const b = [1, 2, 3];
const c = ["x", "y", "z"];
const d = [3, 2, 1];

for (const z of obx.zip([a, b, c, d]))
 console.log(z)
// -> ["a", 1, "x", 3]
// -> ["b", 2, "y", 2]
// -> ["c", 3, "z", 1]
```
</details>

### `sub`
Recursive, in-place object subtraction.

**Params**

- `o`  : <code>Object</code> - *The object to be subtracted from. This object is mutated.* 
- `s`  : <code>Object</code> - *The object to subtract with* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of subtraction. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Simple subtraction
```js
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
console.log(a)
// -> { bar: "baz" }
```
With arrays
```js
const a = [1, 2, 3];
const b = [1, 2, 3];

obx.sub(a, b);
console.log(a)
// -> []
```
</details>

### `add`
Recursive, in-place object addition.
If both objects contain the same key, defaults to o

**Params**

- `o`  : <code>Object</code> - *The object to be added to. This object is mutated.* 
- `a`  : <code>Object</code> - *The object to add with* 
- `params`  : <code>Object</code> - *Parameters object* 
    - `[.depth]`  : <code>number</code> - *Depth of addition. Defaults to infinity* 




<details>
<summary><b>Examples</b></summary>

Simple addition
```js
const a = {
  foo: "bar",
  bar: "baz",
  list: [1, 2, 3],
};

const b = {
  foo: "bar",
  haz: 5,
};

obx.add(a, b);
console.log(a)
// -> { foo: "bar", bar: "baz", list: [1, 2, 3], haz: 5 }
```
</details>

### `isEmptyObj`
Assert that an object type is empty.

**Params**

- `o`  : <code>Object</code> - *Object to assert is empty* 




<details>
<summary><b>Examples</b></summary>


```js
obx.isEmptyObj({}) // -> true
```

```js
obx.isEmptyObj({ foo: 'bar' }) // -> false
```
Only works for objects
```js
obx.isEmptyObj([]) // -> false
```
</details>

### `isEmptyArr`
Assert that an array type is empty.

**Params**

- `a`  : <code>Array</code> - *The array to assert is empty* 




<details>
<summary><b>Examples</b></summary>


```js
obx.isEmptyArr([]) // -> true
```

```js
obx.isEmptyArr([1, 2, 3]) // -> false
```
Only works for arrays
```js
obx.isEmptyArr({}) // -> false
```
</details>


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Write docs
- [ ] Write `eq` in terms of a list of objects?
  - [ ] Rewrite `eq` using inorder iterator
- [x] Implement `zip`
- [ ] Create new file of opinionated functions with nicer signatures based on existing functions 
  - Other helpful functions like `isEmptyObj` and `isEmptyArr` could go in there too
- [x] Add traversal options to
  - [x] `reduce`
  - [x] `zip`
- [x] Complete test coverage
  - [x] Test `add`
- [ ] Transition to TS

<!-- See the [open issues](https://github.com/llGaetanll/obx/issues)
for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
<!--

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

-->



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

**Twitter**: [@GaetanAlmela](https://twitter.com/GaetanAlmela)

**Email**: npm@almela.io

**GitHub Repo**: [llGaetanll/obx](https://github.com/llGaetanll/obx)

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/llGaetanll/obx.svg?style=for-the-badge
[contributors-url]: https://github.com/llGaetanll/obx/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/llGaetanll/obx.svg?style=for-the-badge
[forks-url]: https://github.com/llGaetanll/obx/network/members
[stars-shield]: https://img.shields.io/github/stars/llGaetanll/obx.svg?style=for-the-badge
[stars-url]: https://github.com/llGaetanll/obx/stargazers
[issues-shield]: https://img.shields.io/github/issues/llGaetanll/obx.svg?style=for-the-badge
[issues-url]: https://github.com/llGaetanll/obx/issues
[license-shield]: https://img.shields.io/github/license/llGaetanll/obx.svg?style=for-the-badge
[license-url]: https://github.com/llGaetanll/obx/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/gaetan-almela-092973162

