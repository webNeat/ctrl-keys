import {normalizeKey, normalizeSequence} from './normalize'

describe('normalizeKey', () => {
  it(`handles keys without modifiers`, () => {
    expect(normalizeKey({}, 'a')).toEqual(['a'])
    expect(normalizeKey({}, '.')).toEqual(['.'])
    expect(normalizeKey({}, '+')).toEqual(['+'])
    expect(normalizeKey({}, ' ')).toEqual([' '])
    expect(normalizeKey({}, 'enter')).toEqual(['enter'])
  })
  it(`handles keys with modifiers`, () => {
    expect(normalizeKey({}, 'ctrl+a')).toEqual(['ctrl', 'a'])
    expect(normalizeKey({}, 'alt+.')).toEqual(['alt', '.'])
    expect(normalizeKey({}, 'meta++')).toEqual(['meta', '+'])
    expect(normalizeKey({}, 'shift+ ')).toEqual(['shift', ' '])
    expect(normalizeKey({}, 'ctrl+alt+enter')).toEqual(['ctrl', 'alt', 'enter'])
    expect(normalizeKey({}, 'ctrl+alt++')).toEqual(['ctrl', 'alt', '+'])
  })
  it(`applies aliases`, () => {
    const aliases = {
      dot: '.',
      plus: '+',
      space: ' ',
      up: 'arrowup',
    } as const
    expect(normalizeKey(aliases, 'ctrl+up')).toEqual(['ctrl', 'arrowup'])
    expect(normalizeKey(aliases, 'alt+dot')).toEqual(['alt', '.'])
    expect(normalizeKey(aliases, 'ctrl+alt+space')).toEqual(['ctrl', 'alt', ' '])
    expect(normalizeKey(aliases, 'ctrl+alt+plus')).toEqual(['ctrl', 'alt', '+'])
  })
})

describe('normalizeSequence', () => {
  it(`normalizes many keys`, () => {
    const aliases = {
      dot: '.',
      plus: '+',
      space: ' ',
      up: 'arrowup',
    } as const
    expect(normalizeSequence(aliases, ['ctrl+up', 'alt+dot', 'ctrl+alt+space', 'ctrl+alt+plus'])).toEqual([
      ['ctrl', 'arrowup'],
      ['alt', '.'],
      ['ctrl', 'alt', ' '],
      ['ctrl', 'alt', '+'],
    ])
  })
})
