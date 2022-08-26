import { ActionModel } from './model/action.model'
import { StateModel } from './model/state.model'
import { THEME } from '../util/ChangeTheme'

const initState: StateModel = {
  theme: THEME.DARK,
  tokenList: []
}

export enum StateAction {
  SET_THEME,
  SET_TOKEN_LIST
}

export const reducer = (state: StateModel = initState, action: ActionModel): StateModel => {
  switch (action.type) {
    case StateAction.SET_THEME:
      return { ...state, theme: action.data }
    case StateAction.SET_TOKEN_LIST:
      return { ...state, tokenList: action.data }
    default:
      return state
  }
}
