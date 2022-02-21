import hotkeys from 'hotkeys-js'
import {test} from './test'

window['run_test'] = test((callback) => {
  hotkeys('ctrl+b', callback)
})
