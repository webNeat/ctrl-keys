import {ArrayKey, EncodedKey, KeyValue} from '.'
import {chars, codes} from './constants'
import {encodeKey, encodeSequence, getCharacterCode, getModifiersCode} from './encode'
import {normalizeKey, normalizeSequence} from './normalize'
import {Callback, EncodedSequence, HandlerState, Modifiers, StringKey} from './types'

const CTRL_MASK = 0b1000
const ALT_MASK = 0b0100
const META_MASK = 0b0010
const SHIFT_MASK = 0b0001

export function keyCode(key: StringKey) {
  return encodeKey(codes, normalizeKey({}, key))
}

export function seqCode(...sequence: StringKey[]) {
  return encodeSequence(codes, normalizeSequence({}, sequence))
}

export function bind(code: EncodedSequence, ...fns: Callback[]) {
  return [code, new Set(fns)] as [EncodedSequence, Set<Callback>]
}

export function bindings(...binds: Array<[EncodedSequence, Set<Callback>]>) {
  return new Map(binds)
}

export function state(value: Partial<HandlerState> = {}): HandlerState {
  return {
    codes,
    aliases: {},
    history: [],
    historySize: 0,
    bindings: new Map(),
    disabledSequenceCodes: new Set(),
    ...value,
  }
}

export function event(...keys: Array<Modifiers[keyof Modifiers] | KeyValue>): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    ctrlKey: keys.includes('ctrl'),
    altKey: keys.includes('alt'),
    metaKey: keys.includes('meta'),
    shiftKey: keys.includes('shift'),
    key: keys.at(-1) as string,
  })
}

export function decodeKey(encodedKey: EncodedKey): ArrayKey {
  const charCode = getCharacterCode(encodedKey)
  const modifiersCode = getModifiersCode(encodedKey)
  const key = []
  if (modifiersCode & CTRL_MASK) key.push('ctrl')
  if (modifiersCode & ALT_MASK) key.push('alt')
  if (modifiersCode & META_MASK) key.push('meta')
  if (modifiersCode & SHIFT_MASK) key.push('shift')
  const c = chars[charCode]
  if (c) key.push(c)
  return key as any
}

export function decodeSequence(sequence: EncodedSequence): ArrayKey[] {
  const keys = []
  while (sequence > 0) {
    keys.unshift(decodeKey(sequence % 2 ** 13))
    sequence = sequence >> 13
  }
  return keys
}

export function fnMocks<Name extends string>(...names: Name[]) {
  const fns = new Map()
  const callsCounts = new Map()
  for (const name of names) {
    fns.set(name, jest.fn())
    callsCounts.set(name, 0)
  }
  return {
    get(name: Name) {
      return fns.get(name)
    },
    call(...names: Name[]) {
      for (const name of names) {
        callsCounts.set(name, callsCounts.get(name) + 1)
      }
      return this
    },
    checkCalls() {
      for (const [name, fn] of fns) {
        const callsCount = callsCounts.get(name)
        try {
          expect(fn).toBeCalledTimes(callsCount)
        } catch {
          throw `Expected function '${name}' to be called ${callsCount} times, but it was called ${fn.mock.calls} times!`
        }
      }
    },
  }
}
