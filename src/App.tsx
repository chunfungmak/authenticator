import React from 'react'
import './App.css'
import { Token } from './page/Token/Token'
import { Layout, ConfigProvider } from 'antd'

export default function App (): JSX.Element {
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
