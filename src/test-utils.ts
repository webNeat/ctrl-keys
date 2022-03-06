import {normalizeKey} from './key'
import {encodeSequence} from './sequence'
import {Callback, EncodedSequence, Key, Sequence} from './types'

export function encode(...keys: Key[]) {
  return encodeSequence(keys.map(normalizeKey))
}

export function binding(seq: Sequence, ...fns: Callback[]) {
  return [encode(...seq), new Set(fns)] as [EncodedSequence, Set<Callback>]
}

export function bindings(...items: Array<[Sequence, ...Callback[]]>) {
  return new Map(items.map((x) => binding(...x)))
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
