import keys from 'ctrl-keys'
import {test} from './test'

window['run_test'] = test((callback) => {
  const {handle} = keys().add(['ctrl+a', 'ctrl+b', 'ctrl+c'], callback)
  window.addEventListener('keydown', handle)
  return () => window.removeEventListener('keydown', handle)
})
