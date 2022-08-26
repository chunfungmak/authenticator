import React from 'react'
import { Switch } from 'antd'
import { useSelector } from 'react-redux'
import { StateModel } from '../../store/model/state.model'
import { changeTheme, THEME } from '../../util/ChangeTheme'
import { store } from '../../store'
import { StateAction } from '../../store/reducer'

export function ThemeSwitch (): JSX.Element {
  const state = useSelector((state: StateModel) => state)

  return <>
    <Switch defaultChecked={state.theme === THEME.DARK} onChange={(value) => {
      const theme = THEME[value ? 'DARK' : 'LIGHT']
      void changeTheme(theme)
      store.dispatch({
        type: StateAction.SET_THEME,
        data: theme
      })
    }} />
    </>
}
