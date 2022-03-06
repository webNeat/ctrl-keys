import {Handler} from './Handler'
import {createState} from './state'

export * from './types'

export default function createHandler() {
  return new Handler(createState())
}
