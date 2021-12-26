import {Callback, HandlerInterface, HandlerState, KeyAliases, StringKey} from '../types'
import {addBinding, addTarget, handleEvent, removeBinding, removeTarget} from './methods'

export class Handler<Aliases extends KeyAliases> implements HandlerInterface<Aliases> {
  constructor(protected state: HandlerState<Aliases>) {
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.addListener = this.addListener.bind(this)
    this.removeListener = this.removeListener.bind(this)
    this.handle = this.handle.bind(this)
  }

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

  addListener(target: EventTarget) {
    this.state = addTarget(this.state, target, this.handle)
    return this
  }

  removeListener(target: EventTarget) {
    this.state = removeTarget(this.state, target, this.handle)
    return this
  }

  handle(event: KeyboardEvent) {
    this.state = handleEvent(this.state, event)
    return this
  }
}
