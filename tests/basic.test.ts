import userEvent from '@testing-library/user-event'
import {createHandler} from '../src'

test('basic usage', () => {
  let counter = 0
  const increment = () => (counter += 1)
  const decrement = () => (counter -= 1)
  const reset = () => (counter = 0)
  const handler = createHandler().add('ctrl+up', increment).add('ctrl+down', decrement).add('esc', reset)
  handler.addListener(window)

  userEvent.keyboard('{Control>}{ArrowUp}{/Control}')
  expect(counter).toBe(1)

  userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(5)

  userEvent.keyboard('{Control>}{ArrowDown}{ArrowDown}{ArrowDown}{/Control}')
  expect(counter).toBe(2)

  userEvent.keyboard('{ArrowUp}')
  expect(counter).toBe(2)

  handler.remove('ctrl+up', increment)
  userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(2)

  handler.add('ctrl+up', increment)
  userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(5)

  userEvent.keyboard('{Escape}')
  expect(counter).toBe(0)

  handler.removeListener(window)
  userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(0)
})
