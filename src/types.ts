import {Join, SubArray, MutableTuple} from 'just-types'
import {codes, modifiers, aliases, chars} from './constants'

export type Modifiers = MutableTuple<typeof modifiers>
export type Codes = typeof codes
export type Chars = typeof chars
export type DefaultAliases = typeof aliases
export type KeyValue =
  | '_'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | ' '
  | '`'
  | "'"
  | '"'
  | '~'
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '.'
  | '-'
  | '+'
  | '='
  | '['
  | ']'
  | '{'
  | '}'
  | '<'
  | '>'
  | ','
  | '/'
  | '?'
  | ';'
  | ':'
  | '\\'
  | '|'
  | 'capslock'
  | 'numlock'
  | 'enter'
  | 'tab'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'arrowup'
  | 'end'
  | 'home'
  | 'pagedown'
  | 'pageup'
  | 'backspace'
  | 'delete'
  | 'insert'
  | 'escape'
  | 'f1'
  | 'f2'
  | 'f3'
  | 'f4'
  | 'f5'
  | 'f6'
  | 'f7'
  | 'f8'
  | 'f9'
  | 'f10'
  | 'f11'
  | 'f12'
  | 'f13'
  | 'f14'
  | 'f15'
  | 'f16'
  | 'f17'
  | 'f18'
  | 'f19'
  | 'f20'
  | 'f21'
  | 'f22'
  | 'f23'

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
