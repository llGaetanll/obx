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

<h3 align="center">almela/obx</h3>

  <p align="center">
    obx - objects extended
    <br />
    <a href="https://github.com/llGaetanll/obx#docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/llGaetanll/obx">View Demo</a>
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
   npm i almela/obx
   ```
or with yarn
   ```sh
  yarn add almela/obx 
   ```

### Usage
In your file, simply add
```js
import obx from '@almela/obx'
```
or simply import select functions
```js
import { eq, cp } from '@almela/obx'
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Documentation

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.


### `id`
Assert that 2 objects are identical.

Identical objects have the same keys, in the same order

**Params**

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Object 1 |
| b | <code>Object</code> | Object 2 |

### `eq`
Assert that 2 objects are equal
Objects are equal if they have the same keys.

Note: for arrays, order matters.
i.e.
 eq([1, 2, 3], [3, 2, 1]) // -&gt; false

**Params**

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Object 1 |
| b | <code>Object</code> | Object 2 |
| [d] | <code>number</code> | Depth of equality check. Defaults to infinity |

### `get`
Get value from object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object |
| p | <code>String</code> | Value path |

**Example**  
```js
obx.get("foo.bar", {
   foo: {
     bar: "baz"
   }
});
// -> "baz"
```
**Example**  
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
**Example**  
```js
obx.get("foo.2.baz", {
   foo: 'bar'
})
// -> null
```
### `set`
Set value in object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object |
| p | <code>String</code> | Value path |
| v | <code>Object</code> | Value to set |

### `len`
Find length of an object.

The length of an object is determined by its number of keys.

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to find length of |

### `len_r`
Recursively find the length of an object.

The length of an object is determined by its number of keys.

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to find length of |
| [d] | <code>number</code> | Depth of len. Defaults to infinity |

### `empty`
Assert that an object type is empty.

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to find length of |

### `cp`
Deep copy an object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to copy |
| [d] | <code>number</code> | Depth of copy. Defaults to infinity |

### `map`
Map though all top layer entries of an object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to map through |
| fn | <code>function</code> | Callback function. Contains [k, v] pair, path, object |

### `map_r`
Recursively map though all entries of an object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to map through |
| fn | <code>function</code> | Callback function. Contains [k, v] pair, path, object |
| [d] | <code>number</code> | Depth of map. Defaults to infinity |

### `reduce`
Reduce all top layer entries of an object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to map through |
| fn | <code>function</code> | Callback function. Contains [k, v] pair, path, object |
| a | <code>Object</code> | Accumulator |

### `reduce_r`
Recursively reduce all entries of an object

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | Object to map through |
| fn | <code>function</code> | Callback function. Contains accumulator, [k, v] pair, path, object |
| a | <code>Object</code> | Accumulator |
| [d] | <code>number</code> | Reduce depth. Defaults to infinity |

### `sub_i`
Recursive, in-place object subtraction

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object to be subtracted from. This object is mutated. |
| s | <code>Object</code> | The object to subtract with |
| [d] | <code>number</code> | Depth of the subtraction. Defaults to infinity |

### `add_i`
Recursive, in-place object addition. If both objects contain the same key, defaults to o

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object to be added to. |
| a | <code>Object</code> | The object to add with |
| [d] | <code>number</code> | Depth of the addition. Defaults to infinity |

### `zip`
Group multiple objects into a single iterator

**Params**

| Param | Type | Description |
| --- | --- | --- |
| ...objects | <code>Object</code> | Objects to be zipped together |

### `sub`
Recursive object subtraction

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object to be subtracted from. This object is mutated. |
| s | <code>Object</code> | The object to subtract with |
| [d] | <code>number</code> | Depth of the subtraction. Defaults to infinity |

### `add`
Recursive object addition. If both objects contain the same key, defaults to o

**Params**

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | The object to be added to. |
| a | <code>Object</code> | The object to add with |
| [d] | <code>number</code> | Depth of the addition. Defaults to infinity |


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Change function name convention?
- [ ] Write docs
- [ ] Implement `zip`
- [ ] Add traversal options to
  - [ ] `map_r`
  - [ ] `reduce_r`
  - [ ] `zip`
- [ ] Improve test coverage
  - [ ] Test `add_i`
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
