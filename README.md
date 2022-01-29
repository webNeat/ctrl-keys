# ctrl-keys

A Typescript library to handle keybindings efficiently.

[![Bundle size](https://img.shields.io/bundlephobia/minzip/ctrl-keys?style=flat-square)](https://bundlephobia.com/result?p=ctrl-keys)
[![Tests Status](https://img.shields.io/github/workflow/status/webneat/ctrl-keys/Tests?style=flat-square)](https://github.com/webneat/ctrl-keys/actions?query=workflow:"Tests")
[![Coverage Status](https://img.shields.io/coveralls/github/webNeat/ctrl-keys/master?style=flat-square)](https://coveralls.io/github/webNeat/ctrl-keys?branch=master)
[![Code Quality](https://img.shields.io/lgtm/grade/javascript/github/webNeat/ctrl-keys?style=flat-square)](https://lgtm.com/projects/g/webNeat/ctrl-keys/context:javascript)
[![Rank](https://img.shields.io/librariesio/sourcerank/npm/ctrl-keys?style=flat-square)](https://libraries.io/npm/ctrl-keys)
[![Version](https://img.shields.io/npm/v/ctrl-keys?style=flat-square)](https://www.npmjs.com/package/ctrl-keys)
[![MIT](https://img.shields.io/npm/l/ctrl-keys?style=flat-square)](LICENSE)

# Contents
- 

# Features
- Zero dependencies.
- **1.15 Kb** bundle size.
- Super fast performance.
- Fully typed, offers autocomplete and avoids typos in keybindings.
- Handles multi-keys sequences like `ctrl+k ctrl+b` (Inspired by [vscode keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-rules)).
- Does not add listeners to the `window`, instead it lets you create multiple handlers and bind them to any DOM elements.
- Dynamically add, remove, enable, and disable keybindings.

# Installation

You can install it using `npm` or `yarn`
```bash
npm i ctrl-keys
// or
yarn add ctrl-keys
```

Or use it directly on modern browsers
```html
<script type="module">
  import keys from 'https://unpkg.com/ctrl-keys/dist/index.mjs'
  // ...
</script>
```

_if you need to use this library on an old browser that doesn't support es modules, please open an issue and I will add a CDN that works for you_

# Getting started

```ts
import keys from 'ctrl-keys'

// 1. Create a handler
const handler = keys()

// 2. Add keybindings
handler
  .add('ctrl+up', () => {/* do something ... */})
  .add(['ctrl+shift+space', 'ctrl+shift+c'], () => {/* do something ... */})

// 3. Handle events
window.addEventListener('keydown', handler.handle)
```

That's the basic usage of `ctrl-keys`.

# Using `ctrl-keys`

The default export of `ctrl-keys` is a function that takes no argument and returns a keybindings handler:

```ts
function keys(): Handler
```

The handler has the following interface

```ts
interface HandlerInterface {
  add(keys: Keys, fn: Callback): this
  remove(keys: Keys, fn: Callback): this
  enable(keys: Keys): this
  disable(keys: Keys): this
  handle(event: KeyboardEvent): boolean
}
```

## Adding new keybindings

The `add` method lets you add new key bindings to the handler

```ts
const handler = keys()
  .add('ctrl+up', fn)  // add single key binding
  .add(['ctrl+left', 'ctrl+up', 'ctrl+right'], fn)  // add multi keys binding
  .add('tab', event => {
    // You can access the keyboard event inside the callbacks
  })
```

