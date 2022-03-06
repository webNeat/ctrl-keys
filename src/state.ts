import {encodeEvent} from './event'
import {shouldOverride} from './key'
import {Callback, State, Sequence} from './types'
import {encodeSequence, getEncodedSequencesFromHistory, getSequenceSize, normalizeSequence} from './sequence'

export function createState(data: Partial<State> = {}): State {
  return {
    history: [],
    historySize: 0,
    bindings: new Map(),
    disabledSequenceCodes: new Set(),
    ...data,
  }
}

export function addBinding(state: State, sequence: Sequence, fn: Callback): State {
  const sequenceCode = encodeSequence(normalizeSequence(sequence))
  if (!state.bindings.has(sequenceCode)) {
    state.bindings.set(sequenceCode, new Set())
  }
  state.bindings.get(sequenceCode)!.add(fn)
  return updateHistorySize(state)
}

export function removeBinding(state: State, sequence: Sequence, fn: Callback): State {
  const sequenceCode = encodeSequence(normalizeSequence(sequence))
  const fns = state.bindings.get(sequenceCode)
  if (fns) {
    fns.delete(fn)
    if (fns.size == 0) {
      state.bindings.delete(sequenceCode)
    }
  }
  return updateHistorySize(state)
}

export function enableSequence(state: State, sequence: Sequence): State {
  const sequenceCode = encodeSequence(normalizeSequence(sequence))
  state.disabledSequenceCodes.delete(sequenceCode)
  return state
}

export function disableSequence(state: State, sequence: Sequence): State {
  const sequenceCode = encodeSequence(normalizeSequence(sequence))
  state.disabledSequenceCodes.add(sequenceCode)
  return state
}

export function addEventToHistory(state: State, event: KeyboardEvent): State {
  const key = encodeEvent(event)
  const previousKey = state.history.at(-1)
  if (shouldOverride(previousKey, key)) {
    state.history.pop()
  }
  state.history.push(key)
  if (state.history.length > state.historySize) {
    state.history.shift()
  }
  return state
}

export function getMatchingCallbacks(state: State): Callback[] {
  const callbacks = []
  for (const sequenceCode of getEncodedSequencesFromHistory(state.history)) {
    if (state.disabledSequenceCodes.has(sequenceCode)) {
      continue
    }
    callbacks.push(...(state.bindings.get(sequenceCode) || []))
  }
  return callbacks
}

export function handleEvent(state: State, event: KeyboardEvent): [State, Callback[]] {
  state = addEventToHistory(state, event)
  const fns = getMatchingCallbacks(state)
  for (const fn of fns) fn(event)
  return [state, fns]
}

export function updateHistorySize(state: State): State {
  state.historySize = 0
  for (const code of state.bindings.keys()) {
    state.historySize = Math.max(state.historySize, getSequenceSize(code))
  }
  return state
}
