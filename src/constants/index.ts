import {characters} from './characters'
import {specialKeys} from './specialKeys'

export {characters, specialKeys}

export const modifiers = ['ctrl', 'alt', 'meta', 'shift'] as const

export const aliases = {
  space: ' ',
  plus: '+',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  esc: 'escape',
} as const

export const codes: Record<string, number> = {}
let i = 1
for (const c of characters) codes[c] = i++
for (const c of specialKeys) codes[c] = i++
