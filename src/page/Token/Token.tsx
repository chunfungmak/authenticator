import './Token.css'

import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Col, Row, Progress, Modal } from 'antd'
import { ConvertOtauthModel, convertOtauthUrl } from '../../util/ConvertOtauthUri'
import * as Authenticator from 'authenticator'
import { ScanQrModal } from '../../component/ScanQrModal/ScanQrModal'
import { useSelector } from 'react-redux'
import { StateModel } from '../../store/model/state.model'
import { store } from '../../store'
import { StateAction } from '../../store/reducer'
import { copy } from '../../util/Copy'
import { QrcodeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import QRCodeSVG from 'qrcode.react'

const TIME = 30

export function Token (): JSX.Element {
  const state = useSelector((state: StateModel) => state)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [second, setSecond] = useState<number>(0)

  const [tokenList, setTokenList] = useState<ConvertOtauthModel[]>([])
  const triggerFn = (value?: ConvertOtauthModel[]): void => {
    setTokenList(tokenList => (value ?? tokenList).map(e => {
      return {
        ...e,
        token: Authenticator.generateToken(e.secret)
      }
    }))
  }

  useEffect(() => {
    triggerFn(state.tokenList)
    const interval = setInterval(() => {
      const s = new Date().getSeconds() % TIME
      setSecond(s)
      if (s === 0) triggerFn()
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const addQrValue = (value: string): void => {
    const payload = [...state.tokenList, convertOtauthUrl(value)]
    store.dispatch({
      type: StateAction.SET_TOKEN_LIST,
      data: payload
    })
    triggerFn(payload)
  }

  const removeQrValue = (index: number): void => {
    const payload = Object.assign([], state.tokenList)
    payload.splice(index, 1)
    store.dispatch({
      type: StateAction.SET_TOKEN_LIST,
      data: payload
    })
    triggerFn(payload)
  }

  return <>
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
          <Button type="primary" onClick={() => { setIsModalVisible(true) }} shape="circle" icon={<PlusOutlined />} size='large'>
          </Button>
        </div>
        <ScanQrModal addQrValue={addQrValue} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} key='ScanQrModal'/>

        <Card style={{ margin: '0.5rem', fontSize: '1.25rem', fontWeight: '500' }}>
          Authenticator
        </Card>

        {tokenList.map((value, index) => {
          return <>

                <Card
                    style={{ margin: '0.5rem' }}
                    className="token-card"
                >
                    <Space direction='vertical' size={1} style={{ width: '100%' }}>
                      <Row>
                        <Col span={20}>
                          {value.issuer}
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                          <Space>
                            <QrcodeOutlined
                                onClick={() => Modal.confirm({
                                  className: 'display-qr-modal',
                                  icon: null,
                                  maskClosable: true,
                                  content: <div style={{ width: '100%', textAlign: 'center' }}>
                                    <Button type='link' style={{ height: '20rem' }} onClick={() => { window.location.href = value.url }}>
                                      <QRCodeSVG value={value.url} size={300}/>
                                    </Button>
                                  </div>
                                })}
                                style={{ fontSize: '1.25rem' }}
                            />
                            <DeleteOutlined onClick={() => removeQrValue(index)} style={{ fontSize: '1.25rem' }}/>
                          </Space>
                        </Col>
                      </Row>
                      <Button type='link' onClick={() => { copy(value.token ?? '-') }} style={{ padding: 0, height: '4rem', marginLeft: '-0.25rem' }}>
                        <span className={'token' + (second >= 27 ? ' token-danger' : '')} key='TokenValue' >
                                {value.token ?? '-'}
                            </span>
                      </Button>
                        <Row>
                            <Col span={20}>
                                {value.accountName}
                            </Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                                <Space>
                                    <span style={{ fontSize: '1rem' }} key='TokenTime' className={(second >= 27 ? ' token-danger' : '')}>{TIME - second}</span>
                                    <Progress
                                        className={'token-progress' + (second >= 27 ? ' token-progress-danger' : '')}
                                        type="circle"
                                        strokeWidth={24}
                                        width={'1.25rem' as any}
                                        percent={Math.floor(second / TIME * 100)}
                                        format={() => ''} />
                                </Space>
                            </Col>
                        </Row>

                    </Space>
                </Card>

            </>
        })}
    </>
}
