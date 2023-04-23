import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LINKS } from 'app/constants'

export type RedirectLocationState = {
  has: string
  key: string
  pathname: string
  search: string
}

interface AppSliceState {
  showSplashScreen: boolean
  menuLinks: typeof LINKS | undefined
  defaultRoute: string
  redirectTo: RedirectLocationState | undefined
}

const initialState: AppSliceState = {
  showSplashScreen: true,
  menuLinks: undefined,
  defaultRoute: '/',
  redirectTo: undefined,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShowSplashScreen: (state: { showSplashScreen: boolean }, action: PayloadAction<boolean>) => {
      state.showSplashScreen = action.payload
    },
    setMenuLinks: (state, action) => {
      state.menuLinks = action.payload
    },
    setDefaultRoute: (state, action) => {
      state.defaultRoute = action.payload
    },
    setRedirectTo: (state, action) => {
      state.redirectTo = action.payload
    },
  },
})
