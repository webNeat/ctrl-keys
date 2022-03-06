import {encodeEvent, createEvent} from './event'
import {encode} from './test-utils'

describe('createEvent', () => {
  const keyboardEvent = (type: string, e: Partial<KeyboardEvent>): KeyboardEvent =>
    new KeyboardEvent(type, {ctrlKey: false, altKey: false, metaKey: false, shiftKey: false, ...e})

  it('creates an event without modifiers', () => {
    expect(createEvent('a')).toEqual(keyboardEvent('keydown', {key: 'a'}))
    expect(createEvent('up')).toEqual(keyboardEvent('keydown', {key: 'arrowup'}))
    expect(createEvent('-', 'keyup')).toEqual(keyboardEvent('keyup', {key: '-'}))
    expect(createEvent('é' as any)).toEqual(keyboardEvent('keydown', {key: 'é'}))
  })

  it('creates an event with modifiers', () => {
    expect(createEvent('ctrl+a')).toEqual(keyboardEvent('keydown', {ctrlKey: true, key: 'a'}))
    expect(createEvent('ctrl+alt+a', 'keyup')).toEqual(keyboardEvent('keyup', {ctrlKey: true, altKey: true, key: 'a'}))
    expect(createEvent('meta+shift+up')).toEqual(keyboardEvent('keydown', {metaKey: true, shiftKey: true, key: 'arrowup'}))
    expect(createEvent('alt+é' as any)).toEqual(keyboardEvent('keydown', {altKey: true, key: 'é'}))
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
