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

### Constants

* [eq](#eq)
* [get](#get)
* [set](#set)
* [len](#len)
* [empty](#empty)
* [cp](#cp)
* [map](#map)
* [reduce](#reduce)
* [sub](#sub)
* [add](#add)

### Functions

* [zip(objects, params)](#zip)

### `eq`
Assert that 2 objects are equal
Objects are equal if they have the same keys.

**Params**

- `a`  : <code>Object</code> - *Object 1* 
- `b`  : <code>Object</code> - *Object 2* 
- `[d]`  : <code>number</code> - *Depth of equality check. Defaults to infinity* 


**Examples**

### `get`
Get value from object

**Params**

- `o`  : <code>Object</code> - *The object* 
- `p`  : <code>String</code> - *Value path* 


**Examples**

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
### `set`
Set value in object

**Params**

- `o`  : <code>Object</code> - *The object* 
- `p`  : <code>String</code> - *Value path* 
- `v`  : <code>Object</code> - *Value to set* 


**Examples**

Set deep key
```js
const o = {}
obx.set(o, "foo.2.foo", 'bar')
// o -> {
//    foo: [<2 empty slots>, {
//      foo: 'bar'
//    }]
// }
```
### `len`
Recursively find the number of keys of an object.

**Params**

- `o`  : <code>Object</code> - *Object to find length of* 
- `[d]`  : <code>number</code> - *Depth of len. Defaults to infinity* 


**Examples**

Simple object
```js
obx.len({ foo: 'bar', bar: 'baz' }) // -> 2
```
Recursive object, low depth
```js
// Here depth is only computed at the top level
obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }, 1) // -> 2
```
Recursive object, high depth
```js
// Note: array keys are counted
obx.len({ foo: 'bar', bar: { bar: 'baz', baz: [1, 2, 3] } }) // -> 7
```
### `empty`
Assert that an object type is empty.

**Params**

- `o`  : <code>Object</code> - *Object to find length of* 


**Examples**


```js
obx.empty({}) // -> true
```

```js
obx.empty({ foo: 'bar' }) // -> false
```

```js
// only works for objects
obx.empty([]) // -> false
```
### `cp`
Deep copy an object

**Params**

- `o`  : <code>Object</code> - *Object to copy* 
- `[d]`  : <code>number</code> - *Depth of copy. Defaults to infinity* 


**Examples**

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
### `map`
Recursively map though all entries of an object

**Params**

- `o`  : <code>Object</code> - *Object to map through* 
- `fn`  : <code>function</code> - *Callback function. Contains [k, v] pair, path, object* 
- `[d]`  : <code>number</code> - *Depth of map. Defaults to infinity* 


**Examples**

Basic Mapping
```js
 const o = {
   foo: "bar",
   bar: "baz",
   baz: "foo",
 };

 // Note that map will callback on every value of the object, including sub objects!
 const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");

 obx.map(o, emphasis, 1);
 // -> {
 //     foo: "bar!",
 //     bar: "baz!",
 //     baz: "foo!",
 // }
```
Recursive Mapping, low depth
```js
// TODO
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

 // Note that map will callback on every value of the object, including sub objects.
 const emphasis = ([_, v]) => (v instanceof Object ? v : v + "!");
 obx.map_r(o, emphasis);
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
### `reduce`
Recursively reduce all entries of an object

**Params**

- `o`  : <code>Object</code> - *Object to map through* 
- `fn`  : <code>function</code> - *Callback function. Contains accumulator, [k, v] pair, path, object* 
- `a`  : <code>Object</code> - *Accumulator* 
- `[d]`  : <code>number</code> - *Reduce depth. Defaults to infinity* 


**Examples**

Basic Reduce
```js
const o = { foo: "bar", bar: "baz" };

const combineVals = (a, [k, v]) => [...a, v];
obx.reduce(o, combineVals, []).join(", ");
// -> "bar, baz"
```
Recursive Reduce, low depth
```js
// TODO
```
Recursive Reduce, high depth
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
### `sub`
Recursive, in-place object subtraction

**Params**

- `o`  : <code>Object</code> - *The object to be subtracted from. This object is mutated.* 
- `s`  : <code>Object</code> - *The object to subtract with* 
- `[d]`  : <code>number</code> - *Depth of the subtraction. Defaults to infinity* 


**Examples**

### `add`
Recursive, in-place object addition. If both objects contain the same key, defaults to o

**Params**

- `o`  : <code>Object</code> - *The object to be added to.* 
- `a`  : <code>Object</code> - *The object to add with* 
- `[d]`  : <code>number</code> - *Depth of the addition. Defaults to infinity* 


**Examples**

### `zip`
Group multiple objects into a single iterator.

**Params**

- `objects`  : <code>Array</code> - *An array of Objects to be zipped together.* 
- `params`  : <code>Object</code> - *Object of parameters (depth, key, val, last, itter)* 


**Examples**

Stops at the first null value
```js
const a = ["a", "b", "c"];
const b = [1];

// loop runs only once
for (const z of obx.zip([a, b]))
 console.log(z)
// -> ["a", 1]
```
Recusive
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

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Write docs
- [ ] Write `eq` in terms of a list of objects?
- [x] Implement `zip`
- [ ] Add traversal options to
  - [ ] `map`
  - [ ] `reduce`
  - [x] `zip`
- [ ] Complete test coverage
  - [ ] Test `add`
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
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: docs/img/screenshot.png
