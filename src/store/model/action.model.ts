import { StateAction } from '../reducer'

export interface ActionModel<T = any> {
  type: StateAction
  data?: T
}
