import {normalizeSequence} from '../normalize'
import {EncodedKey, Callback, HandlerState, KeyAliases, StringKey} from '../types'
import {encodeEvent, encodeSequence, getCharacterCode, getModifiersCode, getSequencesCodes, getSequenceSize} from '../encode'

export function addBinding<Aliases extends KeyAliases>(state: HandlerState<Aliases>, sequence: Array<StringKey<Aliases>>, fn: Callback) {
  const sequenceCode = encodeSequence(state.codes, normalizeSequence(state.aliases, sequence))
  if (!state.bindings.has(sequenceCode)) {
    state.bindings.set(sequenceCode, new Set())
  }
  state.bindings.get(sequenceCode)!.add(fn)
  return updateHistorySize(state)
}

export function removeBinding<Aliases extends KeyAliases>(state: HandlerState<Aliases>, sequence: Array<StringKey<Aliases>>, fn: Callback) {
  const sequenceCode = encodeSequence(state.codes, normalizeSequence(state.aliases, sequence))
  const fns = state.bindings.get(sequenceCode)
  if (fns) {
    fns.delete(fn)
    if (fns.size == 0) {
      state.bindings.delete(sequenceCode)
    }
  }
  return updateHistorySize(state)
}

export function enableSequence<Aliases extends KeyAliases>(state: HandlerState<Aliases>, sequence: Array<StringKey<Aliases>>) {
  const sequenceCode = encodeSequence(state.codes, normalizeSequence(state.aliases, sequence))
  state.disabledSequenceCodes.delete(sequenceCode)
  return state
}

export function disableSequence<Aliases extends KeyAliases>(state: HandlerState<Aliases>, sequence: Array<StringKey<Aliases>>) {
  const sequenceCode = encodeSequence(state.codes, normalizeSequence(state.aliases, sequence))
  state.disabledSequenceCodes.add(sequenceCode)
  return state
}

export function handleEvent<Aliases extends KeyAliases>(state: HandlerState<Aliases>, event: KeyboardEvent) {
  const key = encodeEvent(state.codes, event)
  const previousKey = state.history.at(-1)
  if (shouldReplace(previousKey, key)) {
    state.history.pop()
  }
  state.history.push(key)
  if (state.history.length > state.historySize) {
    state.history.shift()
  }
  let foundMatchingSequence = false
  for (const sequenceCode of getSequencesCodes(state.history)) {
    if (state.disabledSequenceCodes.has(sequenceCode)) {
      continue
    }
    for (const fn of state.bindings.get(sequenceCode) || []) {
      foundMatchingSequence = true
      fn(event)
    }
  }
  return [state, foundMatchingSequence] as const
}

export function updateHistorySize<Aliases extends KeyAliases>(state: HandlerState<Aliases>) {
  state.historySize = 0
  for (const code of state.bindings.keys()) {
    state.historySize = Math.max(state.historySize, getSequenceSize(code))
  }
  return state
}

function shouldReplace(previousKey: EncodedKey | undefined, newKey: EncodedKey) {
  if (previousKey === undefined) return false
  if (getCharacterCode(previousKey) > 0) return false
  const previousModifiers = getModifiersCode(previousKey)
  return (previousModifiers & getModifiersCode(newKey)) === previousModifiers
}
