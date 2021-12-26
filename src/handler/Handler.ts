import {Callback, HandlerInterface, HandlerState, KeyAliases, StringKey} from '../types'
import {addBinding, handleEvent, removeBinding} from './methods'

export class Handler<Aliases extends KeyAliases> implements HandlerInterface<Aliases> {
  constructor(protected state: HandlerState<Aliases>) {}

  add(keys: StringKey<Aliases> | Array<StringKey<Aliases>>, fn: Callback): this {
    if (typeof keys === 'string') {
      keys = [keys]
    }
    this.state = addBinding(this.state, keys, fn)
    return this
  }

  remove(keys: StringKey<Aliases> | Array<StringKey<Aliases>>, fn: Callback): this {
    if (typeof keys === 'string') {
      keys = [keys]
    }
    this.state = removeBinding(this.state, keys, fn)
    return this
  }

  handle(event: KeyboardEvent) {
    this.state = handleEvent(this.state, event)
    return this
  }
}
