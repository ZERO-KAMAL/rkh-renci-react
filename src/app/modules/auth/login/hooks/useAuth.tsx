import Auth from 'app/constants/auth'
import NAVIGATE_LINKS from 'app/constants/router-links'
import Jwt from 'app/helpers/jwtHelpers'
import { userSlice } from 'app/http/users/userSlice'
import { LoginRes } from 'app/http/users/users.model'
import UserService from 'app/http/users/usersService'
import { appSlice } from 'app/redux/appSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import { AxiosResponse } from 'axios'
import { QueryCache } from 'react-query'
import { toast } from 'react-toastify'

import useLocalStorage from '../../../../helpers/hooks/useLocalStorage'

export const REFRESH_TRIGGERED = 'refresh-triggered'
const handleRefreshTokenTimeout = (dispatch: any, token: LoginRes['token']) => {
  // set a timeout to refresh the token a minute before it expires
  const jwtPayload = Jwt.getPayload(token)
  if (!jwtPayload?.exp) return

  const refreshTokenTimeoutId = setTimeout(async () => {
    // on every refreshtoken timeout, rerun appInitPipeline
    await appInitPipeline(dispatch)
  }, jwtPayload?.exp)

  dispatch(userSlice.actions.setJwtTimeout(refreshTokenTimeoutId))
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const appInitPipeline = async (dispatch: any): Promise<boolean> => {
  try {
    const isRefreshing = useLocalStorage.getIsRefresh()

    while (isRefreshing !== null) {
      // console.log('Other browser tabs refreshing in progress: ', isRefreshing)
      // console.log('backing off')
      await delay(2000)
    }
    // console.log('refresh started ...')
    useLocalStorage.setIsRefresh(true)

    const user = useLocalStorage.getUser()

    const refreshToken = user!.refreshToken
    const jwtPayload = Jwt.getPayload(refreshToken)

    if (!jwtPayload) {
      return Promise.resolve(false)
    }
    // call refresh token api
    const res = await UserService.refreshToken(user!.userInfo.id, refreshToken)
    // console.log('res: ', res)

    // update local storage
    useLocalStorage.setUser(res.data)

    // currently refresh token api is not returning role, so we manually append role API
    // const resUser = await UserService.getUserById(user!.userInfo.id)
    // res.data.userInfo.role = resUser.role

    // update redux store
    dispatch(userSlice.actions.setCurrentUser(res.data))

    // should init a new timeout handler
    handleRefreshTokenTimeout(dispatch, res.data.token)
    useLocalStorage.removeIsRefresh()
    // console.log('refresh ended ...')

    return Promise.resolve(true)
  } catch (err: any) {
    // console.log('err: ', err)
    // console.log('DEBUG: error in refresh token')
    dispatch(appSlice.actions.setShowSplashScreen(false))
    toast.error(Auth.SESSION_FAILED_RENEW, { toastId: 2 })
    useHistory.replace(NAVIGATE_LINKS.AUTH.LOGOUT)
    return Promise.resolve(false)
  }
}

const login = async (
  dispatch: any,
  email: string,
  values: string
): Promise<AxiosResponse<LoginRes, any>> => {
  try {
    const res = await UserService.login(email, values)
    useLocalStorage.setUser(res.data)
    handleRefreshTokenTimeout(dispatch, res.data.token)

    return res
  } catch (err: any) {
    err?.status < 500
      ? toast.error(`Invalid email or password`)
      : toast.error(`Error ${err?.status}! ${err?.data?.message || ''}`)

    return err
  }
}

const logout = (dispatch: any) => {
  const queryCache = new QueryCache()
  // useLocalStorage.removeUser()
  queryCache.clear()
  dispatch(userSlice.actions.setHasLogout(true)) // navigate to login page
  dispatch(userSlice.actions.setCurrentUser(undefined)) // navigate to login page
  // console.log('logout triggered')
}

const useAuth = {
  login,
  logout,
  handleRefreshTokenTimeout,
  appInitPipeline,
}

export default useAuth
