import {Callback, HandlerInterface, HandlerState, KeyAliases, StringKey} from '../types'
import {addBinding, disableSequence, enableSequence, handleEvent, removeBinding} from './methods'

export class Handler<Aliases extends KeyAliases> implements HandlerInterface<Aliases> {
  constructor(protected state: HandlerState<Aliases>) {
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
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

  enable(keys: StringKey<Aliases> | Array<StringKey<Aliases>>): this {
    if (typeof keys === 'string') {
      keys = [keys]
    }
    this.state = enableSequence(this.state, keys)
    return this
  }

  disable(keys: StringKey<Aliases> | Array<StringKey<Aliases>>): this {
    if (typeof keys === 'string') {
      keys = [keys]
    }
    this.state = disableSequence(this.state, keys)
    return this
  }

  handle(event: KeyboardEvent) {
    const [state, foundMatchingSequence] = handleEvent(this.state, event)
    this.state = state
    return foundMatchingSequence
  }
}
