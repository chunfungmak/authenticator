import React, { useEffect } from 'react'
import './App.css'
import { Token } from './page/Token/Token'
import { Layout, ConfigProvider } from 'antd'
import { changeTheme } from './util/ChangeTheme'
import { useSelector } from 'react-redux'
import { StateModel } from './store/model/state.model'

export default function App (): JSX.Element {
  const state = useSelector((state: StateModel) => state)

  useEffect(() => {
    void changeTheme(state.theme)
  }, [])

  return <>
      <ConfigProvider>
        <Layout style={{ height: '100vh' }}>
            <Layout.Content>
                <Token key='Token'/>
            </Layout.Content>
        </Layout>
      </ConfigProvider>
  </>
}
