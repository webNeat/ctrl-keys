import {keyCode, seqCode} from './test-utils'
import {KeyValue, EncodedKey, Modifiers} from './types'
import {encodeEvent, encodeKey, encodeSequence, getCharacterCode, getModifiersCode, getSequencesCodes, getSequenceSize} from './encode'

const codes = {
  '0': 0b1,
  a: 0b10,
  '-': 0b11,
}

describe('encodeEvent', () => {
  const event = (key: string, ...modifiers: Array<Modifiers[number]>) => {
    const e: any = {key}
    for (const modifier of modifiers) {
      e[(modifier + 'Key') as keyof KeyboardEvent] = true
    }
    return e as KeyboardEvent
  }

  it('encodes an event without modifiers', () => {
    expect(encodeEvent(codes, event('0'))).toBe(0b0000000010000)
    expect(encodeEvent(codes, event('a'))).toBe(0b0000000100000)
    expect(encodeEvent(codes, event('-'))).toBe(0b0000000110000)
  })
  it('encodes an event with modifiers', () => {
    expect(encodeEvent(codes, event('a', 'ctrl'))).toBe(0b0000000101000)
    expect(encodeEvent(codes, event('a', 'alt'))).toBe(0b0000000100100)
    expect(encodeEvent(codes, event('a', 'meta'))).toBe(0b0000000100010)
    expect(encodeEvent(codes, event('a', 'shift'))).toBe(0b0000000100001)

    expect(encodeEvent(codes, event('-', 'ctrl'))).toBe(0b0000000111000)
    expect(encodeEvent(codes, event('-', 'alt'))).toBe(0b0000000110100)
    expect(encodeEvent(codes, event('-', 'meta'))).toBe(0b0000000110010)
    expect(encodeEvent(codes, event('-', 'shift'))).toBe(0b0000000110001)

    expect(encodeEvent(codes, event('a', 'ctrl', 'alt', 'shift'))).toBe(0b0000000101101)
    expect(encodeEvent(codes, event('a', 'alt', 'meta'))).toBe(0b0000000100110)
    expect(encodeEvent(codes, event('a', 'ctrl', 'meta'))).toBe(0b0000000101010)
    expect(encodeEvent(codes, event('a', 'ctrl', 'alt', 'shift', 'meta'))).toBe(0b0000000101111)
  })
  it('encodes a modifier key event', () => {
    expect(encodeEvent(codes, event('ctrl', 'ctrl', 'alt'))).toBe(0b0000000001100)
    expect(encodeEvent(codes, event('alt', 'ctrl', 'alt'))).toBe(0b0000000001100)
    expect(encodeEvent(codes, event('meta', 'meta', 'alt'))).toBe(0b0000000000110)
  })
  it('encodes unknown key event', () => {
    expect(encodeEvent(codes, event('%'))).toBe(0b0000000000000)
    expect(encodeEvent(codes, event('%', 'ctrl', 'alt'))).toBe(0b0000000001100)
  })
})

describe('encodeKey', () => {
  it('encodes an event without modifiers', () => {
    expect(encodeKey(codes, ['0'])).toBe(0b0000000010000)
    expect(encodeKey(codes, ['a'])).toBe(0b0000000100000)
    expect(encodeKey(codes, ['-'])).toBe(0b0000000110000)
  })
  it('encodes an event with modifiers', () => {
    expect(encodeKey(codes, ['ctrl', 'a'])).toBe(0b0000000101000)
    expect(encodeKey(codes, ['alt', 'a'])).toBe(0b0000000100100)
    expect(encodeKey(codes, ['meta', 'a'])).toBe(0b0000000100010)
    expect(encodeKey(codes, ['shift', 'a'])).toBe(0b0000000100001)

    expect(encodeKey(codes, ['ctrl', '-'])).toBe(0b0000000111000)
    expect(encodeKey(codes, ['alt', '-'])).toBe(0b0000000110100)
    expect(encodeKey(codes, ['meta', '-'])).toBe(0b0000000110010)
    expect(encodeKey(codes, ['shift', '-'])).toBe(0b0000000110001)

    expect(encodeKey(codes, ['ctrl', 'alt', 'shift', 'a'])).toBe(0b0000000101101)
    expect(encodeKey(codes, ['alt', 'meta', 'a'])).toBe(0b0000000100110)
    expect(encodeKey(codes, ['ctrl', 'meta', 'a'])).toBe(0b0000000101010)
    expect(encodeKey(codes, ['ctrl', 'alt', 'meta', 'shift', 'a'])).toBe(0b0000000101111)
  })
  it('encodes a modifier key event', () => {
    expect(encodeKey(codes, ['ctrl', 'alt', 'ctrl' as KeyValue])).toBe(0b0000000001100)
    expect(encodeKey(codes, ['ctrl', 'alt', 'alt' as KeyValue])).toBe(0b0000000001100)
    expect(encodeKey(codes, ['alt', 'meta', 'meta' as KeyValue])).toBe(0b0000000000110)
  })
  it('encodes unknown key event', () => {
    expect(encodeKey(codes, ['%'])).toBe(0b0000000000000)
    expect(encodeKey(codes, ['ctrl', 'alt', '%'])).toBe(0b0000000001100)
  })
})

describe('encodeSequence', () => {
  it('encodes single key sequence', () => {
    expect(encodeSequence(codes, [['0']])).toBe(0b0000000010000)
    expect(encodeSequence(codes, [['ctrl', 'a']])).toBe(0b0000000101000)
    expect(encodeSequence(codes, [['alt', 'meta', '-']])).toBe(0b0000000110110)
  })
  it('encodes multiple keys sequence', () => {
    expect(
      encodeSequence(codes, [
        ['ctrl', 'a'],
        ['alt', '-'],
      ])
    ).toBe(0b00000001010000000000110100)
    expect(
      encodeSequence(codes, [
        ['meta', 'a'],
        ['shift', 'a'],
      ])
    ).toBe(0b00000001000100000000100001)
    expect(
      encodeSequence(codes, [
        ['alt', '-'],
        ['meta', 'a'],
        ['shift', 'a'],
      ])
    ).toBe(0b000000011010000000001000100000000100001)
    expect(
      encodeSequence(codes, [
        ['meta', 'a'],
        ['shift', 'a'],
        ['ctrl', 'a'],
        ['alt', '-'],
      ])
    ).toBe(0b0000000100010000000010000100000001010000000000110100)
  })
  it('fails if the sequence contains more than 4 keys', () => {
    expect(() => encodeSequence(codes, [['a'], ['a'], ['a'], ['a'], ['a']])).toThrow(`Can't encode sequence of more than 4 keys!`)
  })
})

describe('getCharacterCode', () => {
  it('extracts the character code from a key code without modifiers', () => {
    expect(getCharacterCode(0b01011100000)).toBe(0b0101110)
    expect(getCharacterCode(0b10000)).toBe(0b1)
  })
  it('extracts the character code from a key code with modifiers', () => {
    expect(getCharacterCode(0b01011100110)).toBe(0b0101110)
    expect(getCharacterCode(0b10101)).toBe(0b1)
  })
})

describe('getModifiersCode', () => {
  it('extracts the modifiers code from a key code', () => {
    expect(getModifiersCode(0b01011100000)).toBe(0b0)
    expect(getModifiersCode(0b01011100110)).toBe(0b0110)
    expect(getModifiersCode(0b10101)).toBe(0b0101)
  })
})

describe('getSequenceSize', () => {
  it('gets the number of keys on a sequence', () => {
    expect(getSequenceSize(encodeSequence(codes, [['ctrl', 'a']]))).toBe(1)
    expect(
      getSequenceSize(
        encodeSequence(codes, [
          ['ctrl', 'a'],
          ['alt', '-'],
        ])
      )
    ).toBe(2)
    expect(getSequenceSize(encodeSequence(codes, [['ctrl', 'a'], ['-'], ['alt', '-']]))).toBe(3)
    expect(getSequenceSize(encodeSequence(codes, [['ctrl', 'a'], ['a'], ['alt', '-'], ['0']]))).toBe(4)
  })
})

describe('getSequencesCodes', () => {
  it(`returns an empty array if the history is empty`, () => {
    const history: EncodedKey[] = []
    expect(getSequencesCodes(history)).toEqual([])
  })
  it(`returns a single code if the history contains one item`, () => {
    const history: EncodedKey[] = [keyCode('ctrl+a')]
    expect(getSequencesCodes(history)).toEqual([seqCode('ctrl+a')])
  })
  it(`returns a multiple codes if the history contains many items`, () => {
    const history: EncodedKey[] = [keyCode('ctrl'), keyCode('alt+a'), keyCode('alt+enter')]
    expect(getSequencesCodes(history)).toEqual([seqCode('alt+enter'), seqCode('alt+a', 'alt+enter'), seqCode('ctrl', 'alt+a', 'alt+enter')])
  })
})
