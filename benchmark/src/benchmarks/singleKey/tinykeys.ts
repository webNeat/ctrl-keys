import {tinykeys} from 'tinykeys'
import {test} from './test'

window['run_test'] = test((callback) => {
  return tinykeys(window, {
    'Control+b': callback,
  })
})
