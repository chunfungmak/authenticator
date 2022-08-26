import darkTheme from '../themes/dark.json'
import lightTheme from '../themes/light.json'

export enum THEME {
  LIGHT,
  DARK
}

export const changeTheme = async (theme: THEME): Promise<void> => {
  (window as any).less.modifyVars(theme === THEME.LIGHT ? lightTheme : darkTheme)
}
