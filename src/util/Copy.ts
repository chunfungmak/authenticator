import { notification } from 'antd'

export function copy (text: string): void {
  void navigator.clipboard.writeText(text)
  notification.success({
    message: 'Copied!',
    placement: 'bottom',
    className: 'copy-notification'
  })
}
