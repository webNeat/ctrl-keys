import {ArrayKey, KeyAliases, StringKey} from './types'

export function normalizeKey<K extends KeyAliases>(aliases: K, key: StringKey<K>): ArrayKey {
  let parts
  if (key === '+') return ['+']
  if ('+' == key.slice(-1)) {
    parts = key.slice(0, -2).split('+')
    parts.push('+')
  } else {
    parts = key.split('+')
  }
  return parts.map((x) => aliases[x] || x) as ArrayKey
}

export function normalizeSequence<K extends KeyAliases>(aliases: K, sequence: Array<StringKey<K>>): ArrayKey[] {
  return sequence.map((x) => normalizeKey(aliases, x))
}
