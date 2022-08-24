import { ActionModel } from './model/action.model'
import { StateModel } from './model/state.model'

const initState: StateModel = {
  tokenList: []
}

export enum StateAction {
  SET_TOKEN_LIST
}

export const reducer = (state: StateModel = initState, action: ActionModel): StateModel => {
  switch (action.type as StateAction) {
    case StateAction.SET_TOKEN_LIST:
      return { ...state, tokenList: action.data }
    default:
      return state
  }
}
