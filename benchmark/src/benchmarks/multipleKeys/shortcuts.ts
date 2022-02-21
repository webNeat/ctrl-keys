import {Shortcuts} from 'shortcuts'
import {test} from './test'

window['run_test'] = test((callback) => {
  const shortcuts = new Shortcuts({target: window as any})
  shortcuts.add({shortcut: 'Ctrl+a Ctrl+b Ctrl+c', handler: callback})
  return () => shortcuts.reset()
})
