import {Handler} from './Handler'
import {createState} from './state'

export * from './types'

export default function keys() {
  return new Handler(createState())
}
