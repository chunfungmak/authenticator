export function waitNextTick (fn: Function): void {
  setTimeout(() => {
    fn()
  }, 1)
}
