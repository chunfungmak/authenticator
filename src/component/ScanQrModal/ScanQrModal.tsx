import React, { memo } from 'react'
import { Modal } from 'antd'
import Html5QrcodePlugin from '../Html5QrcodePlugin/Html5QrcodePlugin'

// eslint-disable-next-line react/display-name
export const ScanQrModal = memo(({ isModalVisible, setIsModalVisible, addQrValue }: {
  isModalVisible: boolean
  setIsModalVisible: Function
  addQrValue: Function
}) => <Modal
    title="Qr Code"
    visible={isModalVisible}
    footer={null}
    onCancel={() => { setIsModalVisible(false) }}>
    {isModalVisible && <Html5QrcodePlugin
        fps={60}
        qrbox={250}
        disableFlip={false}
        aspectRatio={1}
        qrCodeSuccessCallback={(value: string) => {
          addQrValue(value)
          setIsModalVisible(false)
        }}
        videoConstraints={{
          facingMode: 'environment'
        }}
    />}
</Modal>, (prev, next) => {
  return prev.isModalVisible === next.isModalVisible
})
