import 'global-jsdom/register'
import {Shortcuts} from 'shortcuts'
import {createHandler} from '../src'
import userEvent from '@testing-library/user-event'

// Setup
let counter = 0
function increment() {
  counter++
}
function decrement() {
  counter--
}
function fireEvents(count: number) {
  const incrementKeys = '{Control>}{Shift>}{ArrowUp}1{/Shift}{/Control}'
  const decrementKeys = '{Control>}{Shift>}{ArrowDown}1{/Shift}{/Control}'
  const otherKeys = '{Control>}{Shift>}1{/Shift}{/Control}{Control>}{ArrowUp}1{/Control}{Shift>}{ArrowUp}1{/Shift}'
  counter = 0
  for (let i = 0; i < count; i++) {
    userEvent.keyboard(incrementKeys)
    userEvent.keyboard(otherKeys)
  }
  for (let i = 0; i < count; i++) {
    userEvent.keyboard(decrementKeys)
    userEvent.keyboard(otherKeys)
  }
  userEvent.keyboard(incrementKeys)
  if (counter !== 1) throw `Oooops!`
}

// ctrl-keys
function useCtrlKeys(count: number) {
  const {handle} = createHandler().add(['ctrl+shift+up', 'ctrl+shift+1'], increment).add(['ctrl+shift+down', 'ctrl+shift+1'], decrement)
  window.addEventListener('keydown', handle)
  fireEvents(count)
  window.removeEventListener('keydown', handle)
}

// shortcuts
function useShortcuts(count: number) {
  const shortcuts = new Shortcuts()
  shortcuts.add([
    {shortcut: 'Ctrl+Shift+Up Ctrl+Shift+1', handler: increment},
    {shortcut: 'Ctrl+Shift+Down Ctrl+Shift+1', handler: decrement},
  ])
  fireEvents(count)
  shortcuts.reset()
}

// benchmark
const repetitions = 30
const inputs = [50, 100, 200, 500, 1000]
const fns = {useShortcuts, useCtrlKeys} as any

for (const count of inputs) {
  const results = {} as any
  for (const name in fns) {
    results[name] = 0
  }
  for (let i = 0; i < repetitions; i++) {
    for (const name in fns) {
      const fn = fns[name]
      const start = performance.now()
      fn(count)
      results[name] += performance.now() - start
    }
  }
  console.log(`${5 * count} keys:`)
  for (const name in fns) {
    results[name] /= 1000 * repetitions
    console.log(`  ${name}: ${results[name].toFixed(3)} sec`)
  }
}
