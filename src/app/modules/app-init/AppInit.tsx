import { LINKS } from 'app/constants'
import { SUPERADMIN_ID } from 'app/constants/module-permission'
import ConstService from 'app/http/app-constants/constService'
import { constSlice } from 'app/http/app-constants/constSlice'
import { fetchFeedbackType } from 'app/http/feedbacks/feedBackSlice'
import { userSlice } from 'app/http/users/userSlice'
import SplashScreen from 'app/pages/SplashScreen'
import { appSlice } from 'app/redux/appSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { FC, useCallback, useEffect, useMemo } from 'react'

import useLocalStorage from '../../helpers/hooks/useLocalStorage'
import useAuth from '../auth/login/hooks/useAuth'

// 1. Set current user from local storage
// 2. Call refresh token api -> it will refresh user data as well
// 3. Get constants API
// 4. Compute Dynamic links to show based on user permission
// 5. Calculate default route

const isProdEnv = import.meta.env.PROD
// const envMode = import.meta.env.MODE

const AppInit: FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const showSplashScreen = useAppSelector((state) => state.app.showSplashScreen)
  const id = useAppSelector((state) => state.user.currentUser?.userInfo.role?.id)
  const xxx = useAppSelector((state) => state)
  const user = useLocalStorage.getUser()

  // suspress console log in production env
  if (isProdEnv) {
    window.console.log = () => {}
  }

  const initUserPipeline = useCallback(async () => {
    dispatch(appSlice.actions.setShowSplashScreen(true))
    useLocalStorage.removeIsRefresh()
    return await useAuth.appInitPipeline(dispatch)
  }, [])

  const getConst = useCallback(async () => {
    try {
      const res = await ConstService.getConstants()
      dispatch(constSlice.actions.setConstants(res.data))
      await dispatch(fetchFeedbackType())
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    dispatch(appSlice.actions.setShowSplashScreen(true))
    if (!user) {
      dispatch(appSlice.actions.setShowSplashScreen(false))
      return
    }
    dispatch(userSlice.actions.setCurrentUser(user))

    // 1. Call refresh token api
    initUserPipeline()
      .then((user) => {
        if (user) {
          // 2. Register refresh token timeout handler
          const token = useLocalStorage.getUser()?.token
          useAuth.handleRefreshTokenTimeout(dispatch, token!)

          // 3. Get constants API
          getConst()

          // 4. Navigate to dashbaord
          dispatch(appSlice.actions.setShowSplashScreen(false))
        }
      })
      .catch((err) => {
        console.log(err)
        useAuth.logout(dispatch)
        dispatch(appSlice.actions.setShowSplashScreen(false))
      })
  }, [])

  // 4. Compute Dynamic links to show on menu bar based on user permission
  const storedUser = useAppSelector((state) => state.user.currentUser)
  const menuLinks = useMemo(() => {
    const allowedPermissions: string[] =
      storedUser?.userInfo.role?.permissions.map((permission) => permission.code) || []

    const allowedLinks: typeof LINKS = []
    for (const mainLink of LINKS) {
      for (const allowed of allowedPermissions) {
        if (mainLink.code.includes(allowed)) {
          const foundLink = { ...mainLink }
          if (mainLink.sublink) {
            const filteredSublink = foundLink.sublink.filter((sublinks) => {
              for (const code of sublinks.code) {
                // console.log()
                if (allowedPermissions.includes(code)) {
                  return sublinks
                }
              }
            })
            foundLink.sublink = filteredSublink
            allowedLinks.push(foundLink)
          } else {
            allowedLinks.push(foundLink)
          }
          break
        }
      }
    }

    // Superadmin
    if (id && id === SUPERADMIN_ID) {
      return LINKS
    }

    return allowedLinks

  }, [LINKS, storedUser])

  useEffect(() => {
    if (!menuLinks.length) return
    dispatch(appSlice.actions.setMenuLinks(menuLinks))
  }, [menuLinks])

  // 5. Calculate default route
  useEffect(() => {
    if (!menuLinks) return

    for (const link of menuLinks) {
      if (!link.sublink.length) {
        dispatch(appSlice.actions.setDefaultRoute(link.link))
        return
      }
      for (const slink of link.sublink) {
        dispatch(appSlice.actions.setDefaultRoute(slink.link))
        return
      }
    }
  }, [menuLinks])

  return showSplashScreen ? <SplashScreen /> : <>{children}</>
}

export default AppInit
