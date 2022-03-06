import {ONE_KEY_UPPER_BOUND, THREE_KEYS_UPPER_BOUND, TWO_KEYS_UPPER_BOUND} from './constants'
import {decodeKey, encodeKey, normalizeKey} from './key'
import {EncodedKey, EncodedSequence, NormalizedSequence, Sequence} from './types'

export function normalizeSequence(sequence: Sequence): NormalizedSequence {
  return sequence.map(normalizeKey)
}

export function encodeSequence(sequence: NormalizedSequence): EncodedSequence {
  if (sequence.length > 4) throw `Can't encode sequence of more than 4 keys!`
  let code = 0
  for (const key of sequence) {
    code = code * ONE_KEY_UPPER_BOUND + encodeKey(key)
  }
  return code
}

export function decodeSequence(sequence: EncodedSequence): NormalizedSequence {
  const keys = []
  while (sequence > 0) {
    keys.unshift(decodeKey(sequence % 2 ** 13))
    sequence = sequence >> 13
  }
  return keys
}

export function getSequenceSize(seq: EncodedSequence) {
  if (seq < ONE_KEY_UPPER_BOUND) return 1
  if (seq < TWO_KEYS_UPPER_BOUND) return 2
  if (seq < THREE_KEYS_UPPER_BOUND) return 3
  return 4
}

/*
getEncodedSequencesFromHistory([
  keyCode('ctrl+a'), 
  keyCode('alt+b'),
  keyCode('c')
]) //=> [
  seqCode(['c'])
  seqCode(['alt+b', 'c'])
  seqCode(['ctrl+a', 'alt+b', 'c'])
]
*/
export function getEncodedSequencesFromHistory(keys: EncodedKey[]) {
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
