import keys from 'ctrl-keys'
import {test} from './test'

window['run_test'] = test((callback) => {
  const {handle} = keys().add('ctrl+b', callback)
  window.addEventListener('keydown', handle)
  return () => window.removeEventListener('keydown', handle)
})
