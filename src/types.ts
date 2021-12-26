import {Join, SubArray, MutableTuple} from 'just-types'
import {characters, codes, modifiers, specialKeys} from './constants'

export type Modifiers = MutableTuple<typeof modifiers>
export type Character = typeof characters[number]
export type SpecialKey = typeof specialKeys[number]
export type Codes = typeof codes
export type KeyValue = Character | SpecialKey
export type KeyAliases = Record<string, KeyValue>

type Optional<A extends any[]> = A | []
export type ArrayKey<K extends string = KeyValue> = SubArray<Modifiers> | [...Optional<SubArray<Modifiers>>, K]
// @ts-ignore `keyof K` is not infered as string!
export type StringKey<KA extends KeyAliases = {}> = Join<ArrayKey<KeyValue | keyof KA>, '+'>

export type EncodedKey = number
export type EncodedSequence = number

export type Callback = () => any
export type KeyboardEventListener = (event: KeyboardEvent) => any

export type HandlerState<KA extends KeyAliases = {}> = {
  codes: Record<string, EncodedKey>
  aliases: KA
  history: EncodedKey[]
  historySize: number
  bindings: Map<EncodedSequence, Set<Callback>>
  targets: Set<EventTarget>
}

export interface HandlerInterface<KA extends KeyAliases = {}> {
  add(key: StringKey<KA>, fn: Callback): this
  add(keys: Array<StringKey<KA>>, fn: Callback): this
  remove(key: StringKey<KA>, fn: Callback): this
  remove(keys: Array<StringKey<KA>>, fn: Callback): this
  handle(event: KeyboardEvent): this
}
