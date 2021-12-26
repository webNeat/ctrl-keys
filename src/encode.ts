import {modifiers} from './constants'
import {ArrayKey, Codes, EncodedKey, EncodedSequence} from './types'

/**
We want to encode keys and sequences of keys as numbers for performance
A key code is 13 bits: XXXXXXXXXCAMS
  XXXXXXXXX: 9 bits representing the character (event.key value).
    A character can't have a code `0`, that's a special value.
    We can have at most 511 different characters!
  CAMS: 4 bits representing the modifiers `Ctrl`, `Alt`, `Meta` and `Shift` in this order.
A sequence of keys is represented by the concatenation of codes of the keys.
  An integer can safely be represented with 53 bits in Javascript `Number.MAX_SAFE_INTEGER`
  Since every key takes 13bits, a sequence can at most contain 4 keys = 52 bits!
*/

const MODIFIERS_SIZE = 4
const CHARACTER_SIZE = 9
const KEY_SIZE = CHARACTER_SIZE + MODIFIERS_SIZE
const MODIFIERS_UPPER_BOUND = 2 ** MODIFIERS_SIZE
const ONE_KEY_UPPER_BOUND = 2 ** KEY_SIZE
const TWO_KEYS_UPPER_BOUND = 2 ** (2 * KEY_SIZE)
const THREE_KEYS_UPPER_BOUND = 2 ** (3 * KEY_SIZE)

export function encodeEvent(codes: Codes, event: KeyboardEvent): EncodedKey {
  let code = codes[event.key.toLowerCase()] || 0
  for (const modifier of modifiers) {
    code = 2 * code + (event[`${modifier}Key` as keyof KeyboardEvent] ? 1 : 0)
  }
  return code
}

export function encodeKey(codes: Codes, key: ArrayKey): EncodedKey {
  const parts = new Set(key)
  let code = codes[key[key.length - 1].toLowerCase()] || 0
  for (const modifier of modifiers) {
    code = 2 * code + (parts.has(modifier) ? 1 : 0)
  }
  return code
}

export function encodeSequence(codes: Codes, sequence: ArrayKey[]): EncodedSequence {
  if (sequence.length > 4) throw `Can't encode sequence of more than 4 keys!`
  let code = 0
  for (const key of sequence) {
    code = code * ONE_KEY_UPPER_BOUND + encodeKey(codes, key)
  }
  return code
}

export function getCharacterCode(encodedKey: EncodedKey) {
  return encodedKey >> MODIFIERS_SIZE
}

export function getModifiersCode(encodedKey: EncodedKey) {
  return encodedKey % MODIFIERS_UPPER_BOUND
}

export function getSequenceSize(encoded: EncodedSequence) {
  if (encoded < ONE_KEY_UPPER_BOUND) return 1
  if (encoded < TWO_KEYS_UPPER_BOUND) return 2
  if (encoded < THREE_KEYS_UPPER_BOUND) return 3
  return 4
}

/*
getSequencesCodes([
  keyCode('ctrl+a'), 
  keyCode('alt+b'),
  keyCode('c')
]) //=> [
  seqCode(['c'])
  seqCode(['alt+b', 'c'])
  seqCode(['ctrl+a', 'alt+b', 'c'])
]
*/
export function getSequencesCodes(keys: EncodedKey[]) {
  const result = []
  let sequenceCode = 0
  let multiplier = 0
  for (let i = keys.length - 1; i >= 0; i--) {
    sequenceCode = 2 ** multiplier * keys[i] + sequenceCode
    multiplier = multiplier + 13
    result.push(sequenceCode)
  }
  return result
}
