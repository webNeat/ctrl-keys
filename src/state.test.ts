import {Sequence} from './types'
import {addBinding, createState, handleEvent, removeBinding, updateHistorySize} from './state'
import {bindings, fnMocks} from './test-utils'
import {createEvent} from './event'

describe('addBinding', () => {
  it(`adds a binding to a new key`, () => {
    const before = createState()
    const sequence: Sequence = ['ctrl+tab']
    const fn = () => {}
    const after = createState({
      historySize: 1,
      bindings: bindings([sequence, fn]),
    })
    expect(addBinding(before, sequence, fn)).toEqual(after)
  })

  it(`adds a binding to an existing key`, () => {
    const sequence: Sequence = ['ctrl+tab']
    const fn1 = () => {}
    const before = createState({
      historySize: 1,
      bindings: bindings([sequence, fn1]),
    })

    const fn2 = () => {}
    const after = createState({
      historySize: 1,
      bindings: bindings([sequence, fn1, fn2]),
    })
    expect(addBinding(before, sequence, fn2)).toEqual(after)
  })
})

describe('removeBinding', () => {
  it(`removes a binding from a key`, () => {
    const sequence1: Sequence = ['alt+a']
    const sequence2: Sequence = ['ctrl', 'meta+ ']
    const fn1 = () => {}
    const fn2 = () => {}
    const fn3 = () => {}
    const before = createState({
      historySize: 2,
      bindings: bindings([sequence1, fn1], [sequence2, fn2, fn3]),
    })
    const after = createState({
      historySize: 2,
      bindings: bindings([sequence1, fn1], [sequence2, fn3]),
    })
    expect(removeBinding(before, sequence2, fn2)).toEqual(after)
  })
  it(`removes the key if no functions left and updates the historySize`, () => {
    const sequence1: Sequence = ['alt+a']
    const sequence2: Sequence = ['ctrl', 'meta+ ']
    const fn1 = () => {}
    const fn2 = () => {}
    const before = createState({
      historySize: 2,
      bindings: bindings([sequence1, fn1], [sequence2, fn2]),
    })
    const after = createState({
      historySize: 1,
      bindings: bindings([sequence1, fn1]),
    })
    expect(removeBinding(before, sequence2, fn2)).toEqual(after)
  })
})

describe('enableSequence', () => {
  // TODO ...
})

describe('disableSequence', () => {
  // TODO ...
})

describe('addEventToHistory', () => {
  // TODO ...
})

describe('getMatchingCallbacks', () => {
  // TODO ...
})

describe('handleEvent', () => {
  it(`runs matching single key sequence`, () => {
    const fns = fnMocks('a', 'alt+b', 'ctrl+a', 'meta')
    const theState = createState({
      historySize: 1,
      bindings: bindings([['a'], fns.get('a')], [['alt+b'], fns.get('alt+b')], [['ctrl+a'], fns.get('ctrl+a')], [['meta'], fns.get('meta')]),
    })

    handleEvent(theState, createEvent('a'))
    fns.call('a').checkCalls()

    handleEvent(theState, createEvent('ctrl+a'))
    fns.call('ctrl+a').checkCalls()

    handleEvent(theState, createEvent('ctrl+b'))
    fns.checkCalls()

    handleEvent(theState, createEvent('alt+b'))
    fns.call('alt+b').checkCalls()

    handleEvent(theState, createEvent('meta'))
    fns.call('meta').checkCalls()

    handleEvent(theState, createEvent('ctrl+meta'))
    fns.checkCalls()
  })

  it(`runs matching two keys sequence`, () => {
    const fns = fnMocks('a ctrl+b', 'ctrl+b alt', 'ctrl alt')
    const theState = createState({
      historySize: 2,
      bindings: bindings(
        [['a', 'ctrl+b'], fns.get('a ctrl+b')],
        [['ctrl+b', 'alt'], fns.get('ctrl+b alt')],
        [['ctrl', 'alt'], fns.get('ctrl alt')]
      ),
    })

    handleEvent(theState, createEvent('a'))
    fns.checkCalls()

    handleEvent(theState, createEvent('ctrl+b'))
    fns.call('a ctrl+b').checkCalls()

    handleEvent(theState, createEvent('alt'))
    fns.call('ctrl+b alt').checkCalls()

    handleEvent(theState, createEvent('ctrl'))
    fns.checkCalls()

    handleEvent(theState, createEvent('alt'))
    fns.call('ctrl alt').checkCalls()
  })
})

describe('updateHistorySize', () => {
  it(`sets the historySize to the maximum size of sequences`, () => {
    const fn = jest.fn()
    const theBindings = bindings([['ctrl+a'], fn], [['alt+a', 'meta'], fn], [['meta++', 'arrowup', 'enter'], fn])
    const before = createState({historySize: 1, bindings: theBindings})
    const after = createState({historySize: 3, bindings: theBindings})
    expect(updateHistorySize(before)).toEqual(after)
  })
})
