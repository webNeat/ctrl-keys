import {Join, SubArray} from 'just-types'
import {Character} from './Character'

export {Character}
export type AliasCharacter = 'space' | 'plus' | 'up' | 'down' | 'left' | 'right' | 'esc'
export type Modifiers = ['ctrl', 'alt', 'meta', 'shift']
export type Modifier = Modifiers[number]

export type Key = Join<NormalizedKey<Character | AliasCharacter>, '+'>
export type NormalizedKey<C extends string = Character> = SubArray<Modifiers> | [Modifier | C] | [...SubArray<Modifiers>, Modifier | C]

export type EncodedKey = number

export type Sequence = Key[]
export type NormalizedSequence = NormalizedKey[]
export type EncodedSequence = number

export type KeyboardEventType = 'keydown' | 'keyup'
export type Callback = (event?: KeyboardEvent) => any
export type KeyboardEventListener = (event: KeyboardEvent) => any
export type State = {
  history: EncodedKey[]
  historySize: number
  disabledSequenceCodes: Set<EncodedSequence>
  bindings: Map<EncodedSequence, Set<Callback>>
}

export type Binding = [Key, Callback] | [Key, Key, Callback] | [Key, Key, Key, Callback] | [Key, Key, Key, Key, Callback]
export interface HandlerInterface {
  add(...args: Binding): this
  remove(...args: Binding): this
  enable(...keys: Sequence): this
  disable(...keys: Sequence): this
  handle(event: KeyboardEvent): boolean
}
