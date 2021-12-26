import {codes, aliases} from '../constants'
import {Handler} from './Handler'
import {KeyAliases} from '../types'

type DefaultAliases = typeof aliases

export function createHandler<Aliases extends KeyAliases = DefaultAliases>(customAliases?: Aliases) {
  return new Handler<Aliases>({
    codes,
    aliases: (customAliases || aliases) as Aliases,
    history: [],
    historySize: 0,
    bindings: new Map(),
    targets: new Set(),
  })
}
