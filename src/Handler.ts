import {Callback, HandlerInterface, State, Binding, Sequence} from './types'
import {addBinding, disableSequence, enableSequence, handleEvent, removeBinding} from './state'

export class Handler implements HandlerInterface {
  constructor(protected state: State) {
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.handle = this.handle.bind(this)
  }

  add(...args: Binding): this {
    const keys = args.slice(0, -1) as Sequence
    const fn = args.at(-1) as Callback
    this.state = addBinding(this.state, keys, fn)
    return this
  }

  remove(...args: Binding): this {
    const keys = args.slice(0, -1) as Sequence
    const fn = args.at(-1) as Callback
    this.state = removeBinding(this.state, keys, fn)
    return this
  }

  enable(...keys: Sequence): this {
    this.state = enableSequence(this.state, keys)
    return this
  }

  disable(...keys: Sequence): this {
    this.state = disableSequence(this.state, keys)
    return this
  }

  handle(event: KeyboardEvent) {
    const [state, fns] = handleEvent(this.state, event)
    this.state = state
    return fns.length > 0
  }
}
