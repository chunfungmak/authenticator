import './Token.css'

import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Col, Row, Progress, Modal, Dropdown, Menu, Tag } from 'antd'
import { ConvertOtauthModel, convertOtauthUrl } from '../../util/ConvertOtauthUri'
import { ScanQrModal } from '../../component/ScanQrModal/ScanQrModal'
import { useSelector } from 'react-redux'
import { StateModel } from '../../store/model/state.model'
import { store } from '../../store'
import { StateAction } from '../../store/reducer'
import { copy } from '../../util/Copy'
import { QrcodeOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, FastForwardOutlined, FastBackwardOutlined } from '@ant-design/icons'
import QRCodeSVG from 'qrcode.react'
import { ThemeSwitch } from '../../component/ThemeSwitch/ThemeSwitch'
import { generateToken } from '../../util/GenerateToken'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const TIME = 30

export function Token (): JSX.Element {
  const state = useSelector((state: StateModel) => state)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [tokenList, setTokenList] = useState<ConvertOtauthModel[]>([])
  const triggerFn = (value?: ConvertOtauthModel[]): void => {
    if (value != null) {
      value = JSON.parse(JSON.stringify(value))
    }
    const time = new Date().getTime()
    setTokenList(tokenList => (value ?? tokenList).map(e => {
      const period = e.period != null ? parseInt(e.period) : TIME
      let timeLeft = period - Math.floor(time / 1000) % period
      const window = Math.floor(time / 1000 / period)
      const fastForward = e.time?.fastForward ?? window
      const isFastForward = fastForward === window + 1
      if (isFastForward) {
        timeLeft += period
      }
      e.time = { period, timeLeft, window, fastForward, isFastForward }
      if (timeLeft !== period && e.token != null) return e
      return {
        ...e,
        token: generateToken(e, isFastForward)
      }
    }))
  }

  useEffect(() => {
    triggerFn(state.tokenList)
    const interval = setInterval(() => {
      triggerFn()
    }, 1)
    return () => clearInterval(interval)
  }, [])

  const fastForwardToken = (index: number): void => {
    const payload: ConvertOtauthModel[] = JSON.parse(JSON.stringify(state.tokenList))

    const value = payload[index]
    const period = value.period != null ? parseInt(value.period) : TIME

    payload[index] = {
      ...value,
      time: {
        period: 0,
        timeLeft: 0,
        window: 0,
        fastForward: Math.floor(new Date().getTime() / 1000 / period) + 1,
        isFastForward: true
      }
    }

    triggerFn(payload)
  }

  const fastBackwardToken = (index: number): void => {
    const payload: ConvertOtauthModel[] = JSON.parse(JSON.stringify(state.tokenList))

    const value = payload[index]
    const period = value.period != null ? parseInt(value.period) : TIME

    payload[index] = {
      ...value,
      time: {
        period: 0,
        timeLeft: 0,
        window: 0,
        fastForward: Math.floor(new Date().getTime() / 1000 / period),
        isFastForward: false
      }
    }

    triggerFn(payload)
  }

  const addQrValue = async (value: string): Promise<void> => {
    const payload = [...state.tokenList, ...await convertOtauthUrl(value)]
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

  const dnd = (index: number, targetIndex: number): void => {
    const payload: ConvertOtauthModel[] = Object.assign([], state.tokenList)
    const [remove] = payload.splice(index, 1)
    payload.splice(targetIndex, 0, remove)

    store.dispatch({
      type: StateAction.SET_TOKEN_LIST,
      data: payload
    })
    triggerFn(payload)
  }

  return <>
        <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: '999' }}>
          <Button type="primary" onClick={() => { setIsModalVisible(true) }} shape="circle" icon={<PlusOutlined />} style={{ height: '3rem', width: '3rem' }}>
          </Button>
        </div>
        <ScanQrModal addQrValue={addQrValue} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} key='ScanQrModal'/>

        <Card style={{ margin: '0.5rem', fontSize: '1.25rem', fontWeight: '500' }}>
          <Row>
            <Col span={19}>
              <Space>
              Authenticator
              <Tag color="#109e92">{process.env.REACT_APP_BUILD_VERSION}</Tag>
              </Space>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
              <Dropdown placement="bottomRight" overlay={ <Menu
                  items={[
                    {
                      key: '1',
                      label: (
                          <ThemeSwitch />
                      )
                    }
                  ]}
              />}>
                <a onClick={e => e.preventDefault()}>
                    <MoreOutlined/>
                </a>
              </Dropdown>
            </Col>
          </Row>
        </Card>

        <DragDropContext
            onDragEnd={(e) => {
              if (e.destination?.index === undefined) return
              dnd(e.source.index, e.destination.index)
            }}
        >
          <Droppable droppableId="droppable-1" key="droppable-key-1">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} key="droppable-div-key-1">
                {tokenList.map((value, index) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { period, timeLeft, isFastForward } = value.time ?? {
                    period: 0,
                    timeLeft: 0,
                    window: 0,
                    fastForward: 0,
                    isFastForward: false
                  }
                  return <>
                    <Draggable draggableId={`draggable-${index}`} index={index}>
                      {(provided, snapshot) => (
                          <Card
                              className="token-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              key={`draggable-key-${index}`}
                          >
                            <Space direction='vertical' size={1} style={{ width: '100%' }}>
                              <Row>
                                <Col span={19} {...provided.dragHandleProps}>
                                  {value.issuer !== '' ? value.issuer : value.accountName }
                                </Col>
                                <Col span={5} style={{ textAlign: 'right' }}>
                                  <Space>
                                    <QrcodeOutlined
                                        onClick={() => Modal.confirm({
                                          className: 'display-qr-modal',
                                          icon: null,
                                          maskClosable: true,
                                          content: <div style={{ width: '100%', textAlign: 'center' }}>
                                            <Button type='link' style={{ height: '19rem' }} onClick={() => { window.location.href = value.url }}>
                                              <QRCodeSVG value={value.url} size={300} style={{ border: '1rem solid #fff' }}/>
                                            </Button>
                                          </div>
                                        })}
                                        style={{ fontSize: '1.25rem' }}
                                    />
                                    <DeleteOutlined onClick={() => removeQrValue(index)} style={{ fontSize: '1.25rem' }}/>
                                  </Space>
                                </Col>
                              </Row>
                              <Button type='link' onClick={() => { copy(value.token ?? '-') }} style={{ padding: 0, height: '5rem', marginLeft: '-0.25rem' }}>
                        <span className={'token' + (timeLeft <= 3 ? ' token-danger' : '') + (isFastForward ? ' token-fast-forward' : '')} key='TokenValue' >
                                {value.token ?? '-'}
                            </span>
                              </Button>
                              <Row>
                                <Col span={19}>
                                  {value.accountName} ({value.period ?? `${TIME}s`})
                                </Col>
                                <Col span={5} style={{ textAlign: 'right' }}>
                                  <Space>
                                    {
                                      isFastForward
                                        ? <FastBackwardOutlined style={{ fontSize: '1rem' }} onClick={() => { fastBackwardToken(index) }} />
                                        : <FastForwardOutlined style={{ fontSize: '1rem' }} onClick={() => { fastForwardToken(index) }} />
                                    }
                                    <span style={{ fontSize: '1rem', width: '1.25rem', display: 'inline-block' }} key='TokenTime' className={(timeLeft <= 3 ? ' token-danger' : '') + (isFastForward ? ' token-fast-forward' : '')}>{timeLeft}</span>
                                    <Progress
                                        className={'token-progress' + (timeLeft <= 3 ? ' token-progress-danger' : '') + (isFastForward ? 'token-progress-fast-forward' : '')}
                                        type="circle"
                                        strokeWidth={25}
                                        width={20}
                                        percent={period > timeLeft ? Math.floor((period - timeLeft) / period * 100) : 100}
                                        format={() => ''} />
                                  </Space>
                                </Col>
                              </Row>
                            </Space>
                          </Card>
                      )}
                    </Draggable>

                  </>
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

    </>
}
