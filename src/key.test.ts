import {codes} from './constants'
import {decodeKey, encodeKey, getCharacterCode, getModifiersCode, normalizeKey, shouldOverride} from './key'
import {NormalizedKey} from './types'

describe('normalizeKey', () => {
  it(`handles keys without modifiers`, () => {
    expect(normalizeKey('a')).toEqual(['a'])
    expect(normalizeKey('.')).toEqual(['.'])
    expect(normalizeKey('+')).toEqual(['+'])
    expect(normalizeKey(' ')).toEqual([' '])
    expect(normalizeKey('enter')).toEqual(['enter'])
  })
  it(`handles keys with modifiers`, () => {
    expect(normalizeKey('ctrl+a')).toEqual(['ctrl', 'a'])
    expect(normalizeKey('alt+.')).toEqual(['alt', '.'])
    expect(normalizeKey('meta++')).toEqual(['meta', '+'])
    expect(normalizeKey('shift+ ')).toEqual(['shift', ' '])
    expect(normalizeKey('ctrl+alt+enter')).toEqual(['ctrl', 'alt', 'enter'])
    expect(normalizeKey('ctrl+alt++')).toEqual(['ctrl', 'alt', '+'])
  })
  it(`applies aliases`, () => {
    expect(normalizeKey('ctrl+up')).toEqual(['ctrl', 'arrowup'])
    expect(normalizeKey('ctrl+alt+space')).toEqual(['ctrl', 'alt', ' '])
    expect(normalizeKey('ctrl+alt+plus')).toEqual(['ctrl', 'alt', '+'])
  })
})

describe('encodeKey', () => {
  it('encodes a key without modifiers', () => {
    expect(encodeKey(['0'])).toBe(codes['0'] << 4)
    expect(encodeKey(['a'])).toBe(codes['a'] << 4)
    expect(encodeKey(['-'])).toBe(codes['-'] << 4)
  })
  it('encodes a key with modifiers', () => {
    expect(encodeKey(['ctrl', 'a'])).toBe((codes['a'] << 4) + 0b1000)
    expect(encodeKey(['alt', 'a'])).toBe((codes['a'] << 4) + 0b0100)
    expect(encodeKey(['meta', 'a'])).toBe((codes['a'] << 4) + 0b0010)
    expect(encodeKey(['shift', 'a'])).toBe((codes['a'] << 4) + 0b0001)

    expect(encodeKey(['ctrl', '-'])).toBe((codes['-'] << 4) + 0b1000)
    expect(encodeKey(['alt', '-'])).toBe((codes['-'] << 4) + 0b0100)
    expect(encodeKey(['meta', '-'])).toBe((codes['-'] << 4) + 0b0010)
    expect(encodeKey(['shift', '-'])).toBe((codes['-'] << 4) + 0b0001)

    expect(encodeKey(['ctrl', 'alt', 'shift', 'a'])).toBe((codes['a'] << 4) + 0b1101)
    expect(encodeKey(['alt', 'meta', 'a'])).toBe((codes['a'] << 4) + 0b0110)
    expect(encodeKey(['ctrl', 'meta', 'a'])).toBe((codes['a'] << 4) + 0b1010)
    expect(encodeKey(['ctrl', 'alt', 'meta', 'shift', 'a'])).toBe((codes['a'] << 4) + 0b1111)
  })
  it('encodes a modifier key', () => {
    expect(encodeKey(['ctrl', 'alt', 'ctrl'])).toBe(0b1100)
    expect(encodeKey(['ctrl', 'alt', 'alt'])).toBe(0b1100)
    expect(encodeKey(['alt', 'meta', 'meta'])).toBe(0b0110)
  })
  it('encodes unknown key', () => {
    expect(encodeKey(['é' as any])).toBe(0)
    expect(encodeKey(['ctrl', 'alt', 'é' as any])).toBe(0b1100)
  })
})

describe('decodeKey', () => {
  it('decodes keys', () => {
    const keys: NormalizedKey[] = [['a'], ['-'], ['ctrl'], ['ctrl', 'alt', 'a'], ['ctrl', 'alt', 'meta']]
    for (const key of keys) {
      expect(decodeKey(encodeKey(key))).toEqual(key)
    }
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

describe('shouldOverride', () => {
  it('returns false if no previous key', () => {
    expect(shouldOverride(undefined, encodeKey(['a']))).toBe(false)
    expect(shouldOverride(undefined, encodeKey(['ctrl']))).toBe(false)
    expect(shouldOverride(undefined, encodeKey(['alt', 'b']))).toBe(false)
  })
  it('returns false if previous key already has a character', () => {
    expect(shouldOverride(encodeKey(['a']), encodeKey(['a']))).toBe(false)
    expect(shouldOverride(encodeKey(['a']), encodeKey(['b']))).toBe(false)
    expect(shouldOverride(encodeKey(['a']), encodeKey(['meta', 'a']))).toBe(false)
    expect(shouldOverride(encodeKey(['meta', 'a']), encodeKey(['alt', 'meta', 'a']))).toBe(false)
    expect(shouldOverride(encodeKey(['meta', 'a']), encodeKey(['meta']))).toBe(false)
    expect(shouldOverride(encodeKey(['meta', 'a']), encodeKey(['ctrl']))).toBe(false)
  })
  it('returns false if previous key has a modifier that is missing on the new key', () => {
    expect(shouldOverride(encodeKey(['ctrl']), encodeKey(['alt']))).toBe(false)
    expect(shouldOverride(encodeKey(['ctrl', 'alt']), encodeKey(['alt']))).toBe(false)
    expect(shouldOverride(encodeKey(['ctrl', 'alt']), encodeKey(['alt', 'a']))).toBe(false)
  })
  it('returns false if previous key equals the new key', () => {
    expect(shouldOverride(encodeKey(['ctrl']), encodeKey(['ctrl']))).toBe(false)
    expect(shouldOverride(encodeKey(['ctrl', 'alt']), encodeKey(['ctrl', 'alt']))).toBe(false)
  })
  it('returns true if the previous key has only modifiers and the new key adds a modifier or a character to them', () => {
    expect(shouldOverride(encodeKey(['ctrl']), encodeKey(['ctrl', 'a']))).toBe(true)
    expect(shouldOverride(encodeKey(['ctrl']), encodeKey(['ctrl', 'alt']))).toBe(true)
    expect(shouldOverride(encodeKey(['alt']), encodeKey(['ctrl', 'alt']))).toBe(true)
    expect(shouldOverride(encodeKey(['ctrl', 'alt']), encodeKey(['ctrl', 'alt', 'a']))).toBe(true)
  })
})
