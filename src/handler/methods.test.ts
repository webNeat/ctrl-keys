import {bind, bindings, event, fnMocks, keyCode, seqCode, state} from '../test-utils'
import {StringKey} from '../types'
import {addBinding, handleEvent, removeBinding, shouldReplaceKey, updateHistorySize} from './methods'

describe('addBinding', () => {
  it(`adds a binding to a new key`, () => {
    const before = state()
    const sequence: StringKey[] = ['ctrl+tab']
    const fn = () => {}
    const after = state({
      historySize: 1,
      bindings: bindings(bind(seqCode(...sequence), fn)),
    })
    expect(addBinding(before, sequence, fn)).toEqual(after)
  })

  it(`adds a binding to an existing key`, () => {
    const sequence: StringKey[] = ['ctrl+tab']
    const fn1 = () => {}
    const before = state({
      historySize: 1,
      bindings: bindings(bind(seqCode(...sequence), fn1)),
    })

    const fn2 = () => {}
    const after = state({
      historySize: 1,
      bindings: bindings(bind(seqCode(...sequence), fn1, fn2)),
    })
    expect(addBinding(before, sequence, fn2)).toEqual(after)
  })
})

describe('removeBinding', () => {
  it(`removes a binding from a key`, () => {
    const sequence1: StringKey[] = ['alt+a']
    const sequence2: StringKey[] = ['ctrl', 'meta+ ']
    const fn1 = () => {}
    const fn2 = () => {}
    const fn3 = () => {}
    const before = state({
      historySize: 2,
      bindings: bindings(bind(seqCode(...sequence1), fn1), bind(seqCode(...sequence2), fn2, fn3)),
    })
    const after = state({
      historySize: 2,
      bindings: bindings(bind(seqCode(...sequence1), fn1), bind(seqCode(...sequence2), fn3)),
    })
    expect(removeBinding(before, sequence2, fn2)).toEqual(after)
  })
  it(`removes the key if no functions left and updates the historySize`, () => {
    const sequence1: StringKey[] = ['alt+a']
    const sequence2: StringKey[] = ['ctrl', 'meta+ ']
    const fn1 = () => {}
    const fn2 = () => {}
    const before = state({
      historySize: 2,
      bindings: bindings(bind(seqCode(...sequence1), fn1), bind(seqCode(...sequence2), fn2)),
    })
    const after = state({
      historySize: 1,
      bindings: bindings(bind(seqCode(...sequence1), fn1)),
    })
    expect(removeBinding(before, sequence2, fn2)).toEqual(after)
  })
})

describe('handleEvent', () => {
  it(`runs matching single key sequence`, () => {
    const fns = fnMocks('a', 'alt+b', 'ctrl+a', 'meta')
    const theState = state({
      historySize: 1,
      bindings: bindings(
        bind(seqCode('a'), fns.get('a')),
        bind(seqCode('alt+b'), fns.get('alt+b')),
        bind(seqCode('ctrl+a'), fns.get('ctrl+a')),
        bind(seqCode('meta'), fns.get('meta'))
      ),
    })

    handleEvent(theState, event('a'))
    fns.call('a').checkCalls()

    handleEvent(theState, event('ctrl', 'a'))
    fns.call('ctrl+a').checkCalls()

    handleEvent(theState, event('ctrl', 'b'))
    fns.checkCalls()

    handleEvent(theState, event('alt', 'b'))
    fns.call('alt+b').checkCalls()

    handleEvent(theState, event('meta'))
    fns.call('meta').checkCalls()

    handleEvent(theState, event('ctrl', 'meta'))
    fns.checkCalls()
  })

  it(`runs matching two keys sequence`, () => {
    const fns = fnMocks('a ctrl+b', 'ctrl+b alt', 'ctrl alt')
    const theState = state({
      historySize: 2,
      bindings: bindings(
        bind(seqCode('a', 'ctrl+b'), fns.get('a ctrl+b')),
        bind(seqCode('ctrl+b', 'alt'), fns.get('ctrl+b alt')),
        bind(seqCode('ctrl', 'alt'), fns.get('ctrl alt'))
      ),
    })

    handleEvent(theState, event('a'))
    fns.checkCalls()

    handleEvent(theState, event('ctrl', 'b'))
    fns.call('a ctrl+b').checkCalls()

    handleEvent(theState, event('alt'))
    fns.call('ctrl+b alt').checkCalls()

    handleEvent(theState, event('ctrl'))
    fns.checkCalls()

    handleEvent(theState, event('alt'))
    fns.call('ctrl alt').checkCalls()
  })
})

describe('updateHistorySize', () => {
  it(`sets the historySize to the maximum size of sequences`, () => {
    const fn = jest.fn()
    const theBindings = bindings(
      bind(seqCode('ctrl+a'), fn),
      bind(seqCode('alt+a', 'meta'), fn),
      bind(seqCode('meta++', 'arrowup', 'enter'), fn)
    )
    const before = state({historySize: 1, bindings: theBindings})
    const after = state({historySize: 3, bindings: theBindings})
    expect(updateHistorySize(before)).toEqual(after)
  })
})

describe('shouldReplaceKey', () => {
  it(`returns false if the old key has a character`, () => {
    expect(shouldReplaceKey(keyCode('a'), keyCode('alt+a'))).toBe(false)
    expect(shouldReplaceKey(keyCode('a'), keyCode('alt+b'))).toBe(false)
    expect(shouldReplaceKey(keyCode('a'), keyCode('ctrl'))).toBe(false)
    expect(shouldReplaceKey(keyCode('alt+a'), keyCode('alt+a'))).toBe(false)
    expect(shouldReplaceKey(keyCode('ctrl+a'), keyCode('alt+a'))).toBe(false)
    expect(shouldReplaceKey(keyCode('ctrl+a'), keyCode('a'))).toBe(false)
  })
  it(`returns true if all modifiers on the old key are present in the new key`, () => {
    expect(shouldReplaceKey(keyCode('ctrl'), keyCode('ctrl+a'))).toBe(true)
    expect(shouldReplaceKey(keyCode('ctrl'), keyCode('ctrl+alt+a'))).toBe(true)
    expect(shouldReplaceKey(keyCode('alt'), keyCode('ctrl+alt'))).toBe(true)
    expect(shouldReplaceKey(keyCode('ctrl+shift'), keyCode('ctrl+alt+shift+a'))).toBe(true)
  })
  it(`returns false if some modifier on the old key is not present in the new key`, () => {
    expect(shouldReplaceKey(keyCode('alt'), keyCode('ctrl+a'))).toBe(false)
    expect(shouldReplaceKey(keyCode('alt'), keyCode('ctrl+shift'))).toBe(false)
    expect(shouldReplaceKey(keyCode('ctrl+shift'), keyCode('alt+shift+a'))).toBe(false)
    expect(shouldReplaceKey(keyCode('ctrl+alt'), keyCode('ctrl+shift+a'))).toBe(false)
  })
})
