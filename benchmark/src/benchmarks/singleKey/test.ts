import {press, tester} from '../../functions/benchmark'

export const test = tester(1000, () => {
  press('ctrl', 'a', 'b', 'c')
})
