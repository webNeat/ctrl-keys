import {codes, aliases} from '../constants'
import {Handler} from './Handler'
import {HandlerState, KeyAliases} from '../types'

const defaultState: HandlerState = {
  codes,
  aliases,
  history: [],
  historySize: 0,
  bindings: new Map(),
}

export function handler<Aliases extends KeyAliases>(state: Partial<HandlerState<Aliases>> = {}) {
  return new Handler<Aliases>({...defaultState, ...state} as HandlerState<Aliases>)
}
