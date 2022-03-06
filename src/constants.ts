import {AliasCharacter, Character} from './types'

export const modifiers = ['ctrl', 'alt', 'meta', 'shift'] as const

export const chars =
  '__0_1_2_3_4_5_6_7_8_9_a_b_c_d_e_f_g_h_i_j_k_l_m_n_o_p_q_r_s_t_u_v_w_x_y_z_ _`_\'_"_~_!_@_#_$_%_^_&_*_(_)_._-_+_=_[_]_{_}_<_>_,_/_?_;_:_\\_|_capslock_numlock_enter_tab_arrowdown_arrowleft_arrowright_arrowup_end_home_pagedown_pageup_backspace_delete_insert_escape_f1_f2_f3_f4_f5_f6_f7_f8_f9_f10_f11_f12_f13_f14_f15_f16_f17_f18_f19_f20_f21_f22_f23'.split(
    '_'
  )
chars[1] = '_'

export const codes: Record<string, number> = {}
for (const [i, c] of chars.entries()) codes[c] = i

export const aliases: Record<AliasCharacter, Character> = {
  space: ' ',
  plus: '+',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  esc: 'escape',
}

/**
We want to encode keys and sequences of keys as numbers for performance
A key code is 13 bits: XXXXXXXXXCAMS
  XXXXXXXXX: 9 bits representing the character (event.key value).
    A character can't have a code `0`, that's a special value.
    We can have at most 511 different characters!
  CAMS: 4 bits representing the modifiers `Ctrl`, `Alt`, `Meta` and `Shift` in this order.
A sequence of keys is represented by the concatenation of codes of the keys.
  An integer can safely be represented with 53 bits in Javascript `Number.MAX_SAFE_INTEGER`
  Since every key takes 13bits, a sequence can at most contain 4 keys = 52 bits!
*/

export const MODIFIERS_SIZE = 4
export const CHARACTER_SIZE = 9
export const CTRL_MASK = 0b1000
export const ALT_MASK = 0b0100
export const META_MASK = 0b0010
export const SHIFT_MASK = 0b0001
export const KEY_SIZE = CHARACTER_SIZE + MODIFIERS_SIZE
export const MODIFIERS_UPPER_BOUND = 2 ** MODIFIERS_SIZE
export const ONE_KEY_UPPER_BOUND = 2 ** KEY_SIZE
export const TWO_KEYS_UPPER_BOUND = 2 ** (2 * KEY_SIZE)
export const THREE_KEYS_UPPER_BOUND = 2 ** (3 * KEY_SIZE)
