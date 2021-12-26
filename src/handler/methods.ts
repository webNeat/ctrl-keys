import {normalizeSequence} from '../normalize'
import {Callback, HandlerState, KeyAliases, StringKey} from '../types'
import {encodeEvent, encodeSequence, getSequencesCodes, getSequenceSize} from '../encode'
import {KeyboardEventListener} from '..'

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

export function handleEvent<Aliases extends KeyAliases>(state: HandlerState<Aliases>, event: KeyboardEvent) {
  const key = encodeEvent(state.codes, event)
  state.history.push(key)
  if (state.history.length > state.historySize) {
    state.history.shift()
  }
  for (const sequenceCode of getSequencesCodes(state.history)) {
    for (const fn of state.bindings.get(sequenceCode) || []) fn()
  }
  return state
}

export function updateHistorySize<Aliases extends KeyAliases>(state: HandlerState<Aliases>) {
  state.historySize = 0
  for (const code of state.bindings.keys()) {
    state.historySize = Math.max(state.historySize, getSequenceSize(code))
  }
  return state
}

export function addTarget<Aliases extends KeyAliases>(state: HandlerState<Aliases>, target: EventTarget, handle: KeyboardEventListener) {
  target.addEventListener('keyup', handle as EventListener)
  state.targets.add(target)
  return state
}

export function removeTarget<Aliases extends KeyAliases>(state: HandlerState<Aliases>, target: EventTarget, handle: KeyboardEventListener) {
  target.removeEventListener('keyup', handle as EventListener)
  state.targets.delete(target)
  return state
}
