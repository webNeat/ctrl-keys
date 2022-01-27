import {KeyValue} from '.'
import {codes} from './constants'
import {encodeKey, encodeSequence} from './encode'
import {normalizeKey, normalizeSequence} from './normalize'
import {Callback, EncodedSequence, HandlerState, Modifiers, StringKey} from './types'

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
    key: keys[keys.length - 1] as string,
  })
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
