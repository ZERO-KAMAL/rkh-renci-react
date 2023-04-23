import NAVIGATE_LINKS from 'app/constants/router-links'
import useLocalStorage from 'app/helpers/hooks/useLocalStorage'
import SplashScreen from 'app/pages/SplashScreen'
import PublicFormWrapper from 'app/pages/feedback/PublicFormWrapper'
import { useAppSelector } from 'app/redux/store'
import { createBrowserHistory } from 'history'
import { FC } from 'react'
import { unstable_HistoryRouter as HistoryRouter, Route, Routes, matchPath } from 'react-router-dom'

import { PrivateRoute } from './PrivateRoutes'
import { PublicRoutes } from './PublicRoutes'

export const useHistory = createBrowserHistory()

const AppRoutes: FC = () => {
  const { currentUser } = useAppSelector((state) => state.user)
  const showSplashScreen = useAppSelector((state) => state.app.showSplashScreen)
  const isPublicFormView = matchPath(NAVIGATE_LINKS.FEEDBACK.FORM_VIEW, location.pathname)

  return (
    <HistoryRouter history={useHistory}>
      <Routes>
        {isPublicFormView ? (
          <Route path={NAVIGATE_LINKS.FEEDBACK.FORM_VIEW} element={<PublicFormWrapper />} />
        ) : showSplashScreen ? (
          <SplashScreen />
        ) : currentUser ? (
          <Route path='*' element={<PrivateRoute />} />
        ) : (
          <Route path='*' element={<PublicRoutes />} />
        )}
      </Routes>
    </HistoryRouter>
  )
}

export { AppRoutes }
