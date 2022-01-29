import {codes, aliases} from '../constants'
import {Handler} from './Handler'

export function createHandler() {
  return new Handler({
    codes,
    aliases,
    history: [],
    historySize: 0,
    bindings: new Map(),
    disabledSequenceCodes: new Set(),
  })
}
