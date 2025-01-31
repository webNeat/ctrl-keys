import {Handler} from './Handler'
import {createState} from './state'

export * from './types'

export function keys() {
  return new Handler(createState())
}

export default keys
