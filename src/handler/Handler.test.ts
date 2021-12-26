import {codes} from '../constants'
import {event, fnMocks} from '../test-utils'
import {Handler} from './Handler'

describe('Handler', () => {
  const handler = new Handler({
    codes,
    aliases: {
      space: ' ',
      plus: '+',
    },
    history: [],
    historySize: 0,
    bindings: new Map(),
    targets: new Set(),
  })

  const fns = fnMocks('ctrl+a1', 'ctrl+a2', 'ctrl+alt plus', 'ctrl+shift+space c')

  it(`adds bindings`, () => {
    handler.add('ctrl+a', fns.get('ctrl+a1'))
    handler.add('ctrl+a', fns.get('ctrl+a2'))

    handler.handle(event('ctrl', 'a'))
    fns.call('ctrl+a1', 'ctrl+a2').checkCalls()

    handler.handle(event('ctrl', 'b'))
    fns.checkCalls()
  })

  it(`removes bindings`, () => {
    handler.remove('ctrl+a', fns.get('ctrl+a2'))

    handler.handle(event('ctrl', 'a'))
    fns.call('ctrl+a1').checkCalls()
  })

  it(`handles multi-keys sequences`, () => {
    handler.add(['ctrl+alt', 'plus'], fns.get('ctrl+alt plus'))
    handler.add(['ctrl+shift+space', 'c'], fns.get('ctrl+shift+space c'))

    handler.handle(event('ctrl', 'alt'))
    handler.handle(event('+'))
    fns.call('ctrl+alt plus').checkCalls()

    handler.handle(event('ctrl', 'shift', ' '))
    handler.handle(event('c'))
    fns.call('ctrl+shift+space c').checkCalls()
  })
})
