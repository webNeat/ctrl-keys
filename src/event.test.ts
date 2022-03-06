import {encodeEvent, createEvent} from './event'
import {encode} from './test-utils'

describe('createEvent', () => {
  const expectEventsEqual = (event: KeyboardEvent, type: string, data: Partial<KeyboardEvent>) => {
    const expectedEvent = new KeyboardEvent(type, {ctrlKey: false, altKey: false, metaKey: false, shiftKey: false, ...data})
    expect(event).toBeInstanceOf(KeyboardEvent)
    expect(event.type).toBe(type)
    expect(event.ctrlKey).toBe(expectedEvent.ctrlKey)
    expect(event.altKey).toBe(expectedEvent.altKey)
    expect(event.metaKey).toBe(expectedEvent.metaKey)
    expect(event.shiftKey).toBe(expectedEvent.shiftKey)
    expect(event.key).toBe(expectedEvent.key)
  }

  it('creates an event without modifiers', () => {
    expectEventsEqual(createEvent('a'), 'keydown', {key: 'a'})
    expectEventsEqual(createEvent('up'), 'keydown', {key: 'arrowup'})
    expectEventsEqual(createEvent('-', 'keyup'), 'keyup', {key: '-'})
    expectEventsEqual(createEvent('é' as any), 'keydown', {key: 'é'})
  })

  it('creates an event with modifiers', () => {
    expectEventsEqual(createEvent('ctrl+a'), 'keydown', {ctrlKey: true, key: 'a'})
    expectEventsEqual(createEvent('ctrl+alt'), 'keydown', {ctrlKey: true, altKey: true, key: 'Alt'})
    expectEventsEqual(createEvent('ctrl+alt+a', 'keyup'), 'keyup', {ctrlKey: true, altKey: true, key: 'a'})
    expectEventsEqual(createEvent('meta+shift+up'), 'keydown', {metaKey: true, shiftKey: true, key: 'arrowup'})
    expectEventsEqual(createEvent('alt+é' as any), 'keydown', {altKey: true, key: 'é'})
  })
})

describe('encodeEvent', () => {
  it('encodes an event without modifiers', () => {
    expect(encodeEvent(createEvent('0'))).toBe(encode('0'))
    expect(encodeEvent(createEvent('a'))).toBe(encode('a'))
    expect(encodeEvent(createEvent('-'))).toBe(encode('-'))
  })
  it('encodes an event with modifiers', () => {
    expect(encodeEvent(createEvent('ctrl+a'))).toBe(encode('ctrl+a'))
    expect(encodeEvent(createEvent('alt+a'))).toBe(encode('alt+a'))
    expect(encodeEvent(createEvent('meta+a'))).toBe(encode('meta+a'))
    expect(encodeEvent(createEvent('shift+a'))).toBe(encode('shift+a'))

    expect(encodeEvent(createEvent('alt+meta'))).toBe(encode('alt+meta'))
    expect(encodeEvent(createEvent('ctrl+meta+a'))).toBe(encode('ctrl+meta+a'))
    expect(encodeEvent(createEvent('ctrl+alt+shift+a'))).toBe(encode('ctrl+alt+shift+a'))
    expect(encodeEvent(createEvent('ctrl+alt+meta+shift+a'))).toBe(encode('ctrl+alt+meta+shift+a'))
  })
  it('encodes a modifier key event', () => {
    expect(encodeEvent(createEvent('ctrl+alt'))).toBe(encode('ctrl+alt'))
    expect(encodeEvent(createEvent('ctrl+alt'))).toBe(encode('ctrl+alt'))
    expect(encodeEvent(createEvent('alt+meta'))).toBe(encode('alt+meta'))
  })
  it('encodes unknown key event', () => {
    expect(encodeEvent(createEvent('é' as any))).toBe(0)
    expect(encodeEvent(createEvent('ctrl+alt+é' as any))).toBe(encode('ctrl+alt'))
  })
})
