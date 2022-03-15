# ctrl-keys internals documentation

This document explains the structure of the source code to help anyone who wants to understand how this library works internally or wants to contribute to it.

## Contents

## Introduction

...

## Files structure

```bash
src/
  constants.ts      # shared constants
  event.ts          # functions handling events
  Handler.ts        # keybindings handler class
  index.ts          # the entrypoint
  key.ts            # functions handling keys
  sequence.ts       # functions handling sequences
  state.ts          # functions handling state of a handler
  test-utils.ts     # handy functions for tests
  types.ts          # type definitions
```

## keys functions

```mermaid
flowchart LR
  Key(Key)
  NormalizedKey(NormalizedKey)
  EncodedKey(EncodedKey)
  CharCode(CharCode)
  ModifiersCode(ModifiersCode)
  boolean(boolean)
  Key -- normalizeKey --> NormalizedKey
  NormalizedKey -- encodeKey --> EncodedKey
  EncodedKey -- decodeKey --> NormalizedKey
  EncodedKey -- getCharacterCode --> CharCode
  EncodedKey -- getModifiersCode --> ModifiersCode
  EncodedKey -- "shouldOverride(previousKey)" --> boolean
```