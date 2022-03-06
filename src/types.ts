import {Join, SubArray} from 'just-types'

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

export type Character =
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
