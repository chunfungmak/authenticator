import { notification } from 'antd'

export function copy (text: string): void {
  void navigator.clipboard.writeText(text)
  notification.success({
    message: 'copy success',
    placement: 'bottomRight'
  })
}
