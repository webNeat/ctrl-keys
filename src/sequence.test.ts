import {Character} from './types'
import {codes} from './constants'
import {encode} from './test-utils'
import {encodeSequence, getEncodedSequencesFromHistory, getSequenceSize, normalizeSequence} from './sequence'

describe('normalizeSequence', () => {
  it(`normalizes many keys`, () => {
    expect(normalizeSequence(['ctrl+up', 'alt+tab', 'ctrl+alt+space', 'ctrl+alt+plus'])).toEqual([
      ['ctrl', 'arrowup'],
      ['alt', 'tab'],
      ['ctrl', 'alt', ' '],
      ['ctrl', 'alt', '+'],
    ])
  })
})

describe('encodeSequence', () => {
  const bin = (c: Character) => codes[c].toString(2).padStart(9, '0')
  const asInt = (text: string) => parseInt(text, 2)

  it('encodes single key sequence', () => {
    expect(encodeSequence([['0']])).toBe(asInt(bin('0') + '0000'))
    expect(encodeSequence([['ctrl', 'a']])).toBe(asInt(bin('a') + '1000'))
    expect(encodeSequence([['alt', 'meta', '-']])).toBe(asInt(bin('-') + '0110'))
  })
  it('encodes multiple keys sequence', () => {
    const ctrlA = bin('a') + '1000'
    const metaA = bin('a') + '0010'
    const shiftA = bin('a') + '0001'
    const altDash = bin('-') + '0100'
    expect(
      encodeSequence([
        ['ctrl', 'a'],
        ['alt', '-'],
      ])
    ).toBe(asInt(ctrlA + altDash))
    expect(
      encodeSequence([
        ['meta', 'a'],
        ['shift', 'a'],
      ])
    ).toBe(asInt(metaA + shiftA))
    expect(
      encodeSequence([
        ['alt', '-'],
        ['meta', 'a'],
        ['shift', 'a'],
      ])
    ).toBe(asInt(altDash + metaA + shiftA))
    expect(
      encodeSequence([
        ['meta', 'a'],
        ['shift', 'a'],
        ['ctrl', 'a'],
        ['alt', '-'],
      ])
    ).toBe(asInt(metaA + shiftA + ctrlA + altDash))
  })
  it('fails if the sequence contains more than 4 keys', () => {
    expect(() => encodeSequence([['a'], ['a'], ['a'], ['a'], ['a']])).toThrow(`Can't encode sequence of more than 4 keys!`)
  })
})

describe('decodeSequence', () => {
  // TODO ...
})

describe('getSequenceSize', () => {
  it('gets the number of keys on a sequence', () => {
    expect(getSequenceSize(encodeSequence([['ctrl', 'a']]))).toBe(1)
    expect(
      getSequenceSize(
        encodeSequence([
          ['ctrl', 'a'],
          ['alt', '-'],
        ])
      )
    ).toBe(2)
    expect(getSequenceSize(encodeSequence([['ctrl', 'a'], ['-'], ['alt', '-']]))).toBe(3)
    expect(getSequenceSize(encodeSequence([['ctrl', 'a'], ['a'], ['alt', '-'], ['0']]))).toBe(4)
  })
})

describe('getEncodedSequencesFromHistory', () => {
  it(`returns an empty array if the history is empty`, () => {
    expect(getEncodedSequencesFromHistory([])).toEqual([])
  })
  it(`returns a single code if the history contains one item`, () => {
    const ctrlA = encode('ctrl+a')
    expect(getEncodedSequencesFromHistory([ctrlA])).toEqual([ctrlA])
  })
  it(`returns a multiple codes if the history contains many items`, () => {
    const history = [encode('ctrl'), encode('alt+a'), encode('alt+enter')]
    const seqs = [encode('alt+enter'), encode('alt+a', 'alt+enter'), encode('ctrl', 'alt+a', 'alt+enter')]
    expect(getEncodedSequencesFromHistory(history)).toEqual(seqs)
  })
})
