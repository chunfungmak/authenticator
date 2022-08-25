import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { Spin } from 'antd'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
      <Provider store={store} key='Provider'>
          <PersistGate loading={<Spin />} persistor={persistor} key='PersistGate'>
            <App key='App'/>
          </PersistGate>
      </Provider>
)
