import {Sequence} from './types'
import {
  addBinding,
  addEventToHistory,
  createState,
  disableSequence,
  enableSequence,
  getMatchingCallbacks,
  handleEvent,
  removeBinding,
  updateHistorySize,
} from './state'
import {bindings, encode, fnMocks} from './test-utils'
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
  it('enables a disabled sequence', () => {
    const seqCode = encode('ctrl+a', 'alt+b')
    let state = createState({
      disabledSequenceCodes: new Set([seqCode]),
    })
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(true)
    state = enableSequence(state, ['ctrl+a', 'alt+b'])
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(false)
  })
  it('does nothing if the sequence is not disabled', () => {
    const seqCode = encode('ctrl+a', 'alt+b')
    let state = createState({
      disabledSequenceCodes: new Set([seqCode]),
    })
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(true)
    state = enableSequence(state, ['ctrl+a', 'alt+c'])
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(true)
  })
})

describe('disableSequence', () => {
  it('disables a sequence', () => {
    const seqCode = encode('ctrl+a', 'alt+b')
    let state = createState()
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(false)
    state = disableSequence(state, ['ctrl+a', 'alt+b'])
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(true)
  })
  it('does nothing if the sequence is already disabled', () => {
    const seqCode = encode('ctrl+a', 'alt+b')
    let state = createState({
      disabledSequenceCodes: new Set([seqCode]),
    })
    state = disableSequence(state, ['ctrl+a', 'alt+b'])
    expect(state.disabledSequenceCodes.has(seqCode)).toBe(true)
  })
})

describe('addEventToHistory', () => {
  it('adds event to history', () => {
    let state = createState({
      historySize: 3,
      history: [],
    })
    state = addEventToHistory(state, createEvent('ctrl+up'))
    expect(state.history).toEqual([encode('ctrl+up')])
    state = addEventToHistory(state, createEvent('ctrl+alt+.'))
    expect(state.history).toEqual([encode('ctrl+up'), encode('ctrl+alt+.')])
  })

  it('removes the oldest event if size becomes > historySize', () => {
    let state = createState({
      historySize: 1,
      history: [],
    })
    state = addEventToHistory(state, createEvent('ctrl+up'))
    expect(state.history).toEqual([encode('ctrl+up')])
    state = addEventToHistory(state, createEvent('ctrl+alt+.'))
    expect(state.history).toEqual([encode('ctrl+alt+.')])
  })
})

describe('getMatchingCallbacks', () => {
  it('returns the matching callbacks', () => {
    const fns = {
      'ctrl+a': () => null,
      'ctrl+alt+a': () => null,
      'ctrl+a ctrl+b': () => null,
      'ctrl ctrl+b': () => null,
    }
    const state = createState({
      bindings: bindings(
        [['ctrl+a'], fns['ctrl+a']],
        [['ctrl+alt+a'], fns['ctrl+alt+a']],
        [['ctrl+a', 'ctrl+b'], fns['ctrl+a ctrl+b']],
        [['ctrl', 'ctrl+b'], fns['ctrl ctrl+b']]
      ),
    })

    state.history = []
    expect(getMatchingCallbacks(state)).toEqual([])

    state.history = [encode('a')]
    expect(getMatchingCallbacks(state)).toEqual([])

    state.history = [encode('ctrl+a')]
    expect(getMatchingCallbacks(state)).toEqual([fns['ctrl+a']])

    state.history = [encode('ctrl+a'), encode('ctrl')]
    expect(getMatchingCallbacks(state)).toEqual([])

    state.history = [encode('ctrl+a'), encode('ctrl+b')]
    expect(getMatchingCallbacks(state)).toEqual([fns['ctrl+a ctrl+b']])

    state.history = [encode('ctrl+alt+a'), encode('ctrl+b')]
    expect(getMatchingCallbacks(state)).toEqual([])

    state.history = [encode('ctrl'), encode('ctrl+b')]
    expect(getMatchingCallbacks(state)).toEqual([fns['ctrl ctrl+b']])

    state.history = [encode('ctrl'), encode('ctrl+alt+a')]
    expect(getMatchingCallbacks(state)).toEqual([fns['ctrl+alt+a']])
  })
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
