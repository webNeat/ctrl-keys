import {Join, SubArray, MutableTuple} from 'just-types'
import {characters, codes, modifiers} from './constants'

export type Modifiers = MutableTuple<typeof modifiers>
export type Codes = typeof codes
export type KeyValue = typeof characters[number]
export type KeyAliases = Record<string, KeyValue>

type Optional<A extends any[]> = A | []
export type ArrayKey<K extends string = KeyValue> = SubArray<Modifiers> | [...Optional<SubArray<Modifiers>>, K]
// @ts-ignore `keyof K` is not infered as string!
export type StringKey<KA extends KeyAliases = {}> = Join<ArrayKey<KeyValue | keyof KA>, '+'>

export type EncodedKey = number
export type EncodedSequence = number

export type Callback = (event?: KeyboardEvent) => any
export type KeyboardEventListener = (event: KeyboardEvent) => any

export type HandlerState<KA extends KeyAliases = {}> = {
  codes: Record<string, EncodedKey>
  aliases: KA
  history: EncodedKey[]
  historySize: number
  disabledSequenceCodes: Set<number>
  bindings: Map<EncodedSequence, Set<Callback>>
}

export interface HandlerInterface<KA extends KeyAliases = {}> {
  add(key: StringKey<KA>, fn: Callback): this
  add(keys: Array<StringKey<KA>>, fn: Callback): this
  remove(key: StringKey<KA>, fn: Callback): this
  remove(keys: Array<StringKey<KA>>, fn: Callback): this
  enable(key: StringKey<KA>): this
  enable(keys: Array<StringKey<KA>>): this
  disable(key: StringKey<KA>): this
  disable(keys: Array<StringKey<KA>>): this
  handle(event: KeyboardEvent): boolean
}
