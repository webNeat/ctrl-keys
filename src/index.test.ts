import keys from '.'
import userEvent from '@testing-library/user-event'

test('basic usage', async () => {
  let counter = 0
  const increment = () => (counter += 1)
  const decrement = () => (counter -= 1)
  const reset = () => (counter = 0)
  const handler = keys().add('ctrl+up', increment).add('ctrl+down', decrement).add('esc', reset)
  window.addEventListener('keydown', handler.handle)

  await userEvent.keyboard('{Control>}{ArrowUp}{/Control}')
  expect(counter).toBe(1)

  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(5)

  await userEvent.keyboard('{Control>}{ArrowDown}{ArrowDown}{ArrowDown}{/Control}')
  expect(counter).toBe(2)

  await userEvent.keyboard('{ArrowUp}')
  expect(counter).toBe(2)

  handler.disable('ctrl+up')
  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(2)

  handler.enable('ctrl+up')
  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(5)

  handler.remove('ctrl+up', increment)
  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(5)

  handler.add('ctrl+up', increment)
  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(7)

  await userEvent.keyboard('{Escape}')
  expect(counter).toBe(0)

  window.removeEventListener('keydown', handler.handle)
  await userEvent.keyboard('{Control>}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{/Control}')
  expect(counter).toBe(0)
})
