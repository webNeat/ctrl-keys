import {testTimeout} from '../../config'

type Callback = () => void
type Handler = (fn: Callback) => Callback

export const tester = (count: number, fireEvents: Callback) => (handler: Handler) => async () => {
  return new Promise<void>((resolve) => {
    let teardown: Callback
    const done = () => {
      teardown()
      resolve()
    }
    const timeout = setTimeout(done, testTimeout)
    let step = 0
    const callback = () => {
      step++
      if (step === count) {
        clearTimeout(timeout)
        done()
      }
    }
    teardown = handler(callback)
    for (let i = 0; i < count; i++) fireEvents()
  })
}
