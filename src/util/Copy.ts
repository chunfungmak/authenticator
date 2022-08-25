export function copy (text: string): void {
  void navigator.clipboard.writeText(text)
}
