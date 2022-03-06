import {fnMocks} from './test-utils'
import {Handler} from './Handler'
import {createEvent} from './event'

describe('Handler', () => {
  const handler = new Handler({
    history: [],
    historySize: 0,
    bindings: new Map(),
    disabledSequenceCodes: new Set(),
  })

  const fns = fnMocks('ctrl+a1', 'ctrl+a2', 'ctrl+alt ctrl+plus', 'ctrl+shift+space c')

  it(`adds bindings`, () => {
    handler.add('ctrl+a', fns.get('ctrl+a1'))
    handler.add('ctrl+a', fns.get('ctrl+a2'))

    handler.handle(createEvent('ctrl+a'))
    fns.call('ctrl+a1', 'ctrl+a2').checkCalls()

    handler.handle(createEvent('ctrl+b'))
    fns.checkCalls()
  })

  it(`removes bindings`, () => {
    handler.remove('ctrl+a', fns.get('ctrl+a2'))

    handler.handle(createEvent('ctrl+a'))
    fns.call('ctrl+a1').checkCalls()
  })

  it(`handles multi-keys sequences`, () => {
    handler.add('ctrl+alt', 'ctrl+plus', fns.get('ctrl+alt ctrl+plus'))
    handler.add('ctrl+shift+space', 'c', fns.get('ctrl+shift+space c'))

    handler.handle(createEvent('ctrl+alt'))
    handler.handle(createEvent('ctrl++'))
    fns.call('ctrl+alt ctrl+plus').checkCalls()

    handler.handle(createEvent('ctrl+shift+ '))
    handler.handle(createEvent('c'))
    fns.call('ctrl+shift+space c').checkCalls()
  })
})
