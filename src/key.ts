import {aliases, ALT_MASK, chars, codes, CTRL_MASK, META_MASK, modifiers, MODIFIERS_SIZE, MODIFIERS_UPPER_BOUND, SHIFT_MASK} from './constants'
import {EncodedKey, Key, NormalizedKey} from './types'

export function normalizeKey(key: Key): NormalizedKey {
  let parts: string[]
  if (key === '+') return ['+']
  if ('+' == key.slice(-1)) {
    parts = key.slice(0, -2).split('+')
    parts.push('+')
  } else {
    parts = key.split('+')
  }
  return parts.map((x) => (aliases as any)[x] || x) as NormalizedKey
}

export function encodeKey(key: NormalizedKey): EncodedKey {
  const parts = new Set(key)
  let code = codes[key[key.length - 1].toLowerCase()] || 0
  for (const modifier of modifiers) {
    code = 2 * code + (parts.has(modifier) ? 1 : 0)
  }
  return code
}

export function decodeKey(encodedKey: EncodedKey): NormalizedKey {
  const charCode = getCharacterCode(encodedKey)
  const modifiersCode = getModifiersCode(encodedKey)
  const key = []
  if (modifiersCode & CTRL_MASK) key.push('ctrl')
  if (modifiersCode & ALT_MASK) key.push('alt')
  if (modifiersCode & META_MASK) key.push('meta')
  if (modifiersCode & SHIFT_MASK) key.push('shift')
  const c = chars[charCode]
  if (c) key.push(c)
  return key as any
}

export function getCharacterCode(encodedKey: EncodedKey) {
  return encodedKey >> MODIFIERS_SIZE
}

export function getModifiersCode(encodedKey: EncodedKey) {
  return encodedKey % MODIFIERS_UPPER_BOUND
}

export function shouldOverride(previousKey: EncodedKey | undefined, newKey: EncodedKey) {
  if (previousKey === undefined) return false
  if (getCharacterCode(previousKey) > 0) return false
  const previousModifiers = getModifiersCode(previousKey)
  const newModifiers = getModifiersCode(newKey)
  if (previousModifiers === newModifiers && getCharacterCode(newKey) === 0) return false
  return (previousModifiers & getModifiersCode(newKey)) === previousModifiers
}
