import {normalizeKey} from './key'
import {aliases, codes, modifiers} from './constants'
import {AliasCharacter, Character, EncodedKey, Key, KeyboardEventType, Modifier} from './types'

export function createEvent(key: Key, type: KeyboardEventType = 'keydown') {
  const parts = normalizeKey(key) as Array<Character | Modifier>
  let eventKey = parts.at(-1) as string
  if (aliases[eventKey as AliasCharacter] !== undefined) eventKey = aliases[eventKey as AliasCharacter]
  if (eventKey === 'ctrl') eventKey = 'Control'
  if (eventKey === 'alt') eventKey = 'Alt'
  if (eventKey === 'meta') eventKey = 'Meta'
  if (eventKey === 'shift') eventKey = 'Shift'
  return new KeyboardEvent(type, {
    ctrlKey: parts.includes('ctrl'),
    altKey: parts.includes('alt'),
    metaKey: parts.includes('meta'),
    shiftKey: parts.includes('shift'),
    key: parts.at(-1) as string,
  })
}

export function encodeEvent(event: KeyboardEvent): EncodedKey {
  let code = codes[event.key.toLowerCase()] || 0
  for (const modifier of modifiers) {
    code = 2 * code + (event[`${modifier}Key` as keyof KeyboardEvent] ? 1 : 0)
  }
  return code
}
