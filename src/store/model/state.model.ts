import { ConvertOtauthModel } from '../../util/ConvertOtauthUri'
import { THEME } from '../../util/ChangeTheme'

export interface StateModel {
  theme: THEME
  tokenList: ConvertOtauthModel[]
}
