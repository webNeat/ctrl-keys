const keys = {
  ctrl: {key: 'Control', code: 'ControlLeft', keyCode: 17},
  alt: {key: 'Alt', code: 'AltLeft', keyCode: 18},
  shift: {key: 'Shift', code: 'ShiftLeft', keyCode: 16},
  a: {key: 'a', code: 'KeyA', keyCode: 65},
  b: {key: 'b', code: 'KeyB', keyCode: 66},
  c: {key: 'c', code: 'KeyC', keyCode: 67},
} as const

type KeyName = keyof typeof keys

export function press(...names: KeyName[]) {
  const modifiers: Record<string, boolean> = {
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
  }
  for (const name of names) {
    window.dispatchEvent(new KeyboardEvent('keydown', {...keys[name], ...modifiers}))
    if (modifiers[`${name}Key`] === false) {
      modifiers[`${name}Key`] = true
    }
  }
  for (const name of names.reverse()) {
    window.dispatchEvent(new KeyboardEvent('keyup', {...keys[name], ...modifiers}))
    if (modifiers[`${name}Key`]) {
      modifiers[`${name}Key`] = false
    }
  }
}
