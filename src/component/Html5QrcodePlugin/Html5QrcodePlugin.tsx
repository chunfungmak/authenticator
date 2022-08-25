import './Html5QrcodePlugin.css'

import { Html5QrcodeScanner } from 'html5-qrcode'
import React, { ReactNode } from 'react'
import { QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode/esm/core'
import { Html5QrcodeResult } from 'html5-qrcode/core'
import { waitNextTick } from '../../util/WaitNextTick'

const qrcodeRegionId = 'html5qr-code-full-region'

interface Html5QrcodePluginConfig {
  id?: string
  fps?: number
  qrbox?: number
  aspectRatio?: number
  disableFlip?: boolean
  qrCodeSuccessCallback?: QrcodeSuccessCallback
  qrCodeErrorCallback?: QrcodeErrorCallback
  verbose?: boolean
  rememberLastUsedCamera?: boolean
}

class Html5QrcodePlugin extends React.Component<Html5QrcodePluginConfig> {
  private html5QrcodeScanner?: Html5QrcodeScanner

  render (): ReactNode {
    return <div id={this.props.id ?? qrcodeRegionId} className="qr-class"/>
  }

  componentWillUnmount (): void {
    this.html5QrcodeScanner?.clear().catch(error => {
      console.error('Failed to clear html5QrcodeScanner. ', error)
    })
  }

  componentDidMount (): void {
    const config = this.createConfig(this.props)
    const verbose = this.props.verbose === true

    // Suceess callback is required.
    if (this.props.qrCodeSuccessCallback === undefined) {
      throw new Error('qrCodeSuccessCallback is required callback.')
    }

    waitNextTick(() => {
      this.html5QrcodeScanner = new Html5QrcodeScanner(
        this.props.id ?? qrcodeRegionId, config as any, verbose)
      this.html5QrcodeScanner.render(
        (decodedText: string, result: Html5QrcodeResult): void => {
          this.props.qrCodeSuccessCallback?.(decodedText, result)
          // void this.html5QrcodeScanner?.clear()
        },
        this.props.qrCodeErrorCallback)
    })
  }

  /**
   * Creates the configuration object for Html5QrcodeScanner.
   */
  private createConfig (props: Html5QrcodePluginConfig): Html5QrcodePluginConfig {
    const config: Html5QrcodePluginConfig = {}
    if (props.fps != null) {
      config.fps = props.fps
    }
    if (props.qrbox != null) {
      config.qrbox = props.qrbox
    }
    if (props.aspectRatio != null) {
      config.aspectRatio = props.aspectRatio
    }
    if (props.disableFlip != null) {
      config.disableFlip = props.disableFlip
    }
    return config
  }
};

export default Html5QrcodePlugin
