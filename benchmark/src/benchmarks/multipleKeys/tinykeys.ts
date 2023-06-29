import {tinykeys} from 'tinykeys'
import {test} from './test'

window['run_test'] = test((callback) => {
  return tinykeys(window, {
    'Control+a Control+b Control+c': callback,
  })
})
