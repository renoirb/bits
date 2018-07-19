# Renoir’s [bits](https://bitsrc.io/renoirb)

A workspace where I develop Bit components/packages.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Use locally

1. Ensure you have [Node.js](https://nodejs.org/en/download/), [yarn](https://yarnpkg.com/lang/en/docs/install/), and [bit](https://docs.bitsrc.io/docs/installation.html) installed
2. Clone the repository
    ```console
    git clone https://github.com/renoirb/bits.git
    cd bits
    ```

3. Setup
  * If you also have `make`
    ```console
    make
    ```

  * Or manually
    ```console
    yarn
    bit install
    bit import --force
    bit build
    ```


# Reference

* Follow [Standard.js](https://standardjs.com/) conventions
* [ESLint](https://eslint.org/docs/user-guide/)
* [JSDoc](http://usejsdoc.org/#block-tags) comment annotations
  * [JSDoc documentation style guide](https://github.com/shri/JSDoc-Style-Guide)
* Describe features using [ChaiJS](http://chaijs.com/) ([*BDD* expectations](http://chaijs.com/), [assertions](http://chaijs.com/api/assert/), etc.)
