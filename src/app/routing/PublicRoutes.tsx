import NAVIGATE_LINKS from 'app/constants/router-links'
import { ForgotPasswordWrapper, LoginWrapper, ResetPasswordWrapper } from 'app/pages'
import { FC } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import AuthMasterLayout from '../layout/AuthMasterLayout'

const PublicRoutes: FC = () => {
  const location = useLocation()

  return (
    <Routes>
      <Route element={<AuthMasterLayout />}>
        {/* default route: If unspecified, navigate to login*/}
        <Route
          index
          element={
            <Navigate to={NAVIGATE_LINKS.AUTH.LOGIN} replace={true} state={{ from: location }} />
          }
        />

        {/* Register all public urls below */}
        <Route path={NAVIGATE_LINKS.AUTH.LOGIN} element={<LoginWrapper />} />
        <Route path={NAVIGATE_LINKS.AUTH.FORGET_PASSWORD} element={<ForgotPasswordWrapper />} />
        <Route path={NAVIGATE_LINKS.AUTH.RESET_PASSWORD} element={<ResetPasswordWrapper />} />

        {/* 404 not found, navigate to login */}
        <Route
          path='*'
          element={
            <Navigate to={NAVIGATE_LINKS.AUTH.LOGIN} replace={true} state={{ from: location }} />
          }
        />
      </Route>
    </Routes>
  )
}

export { PublicRoutes }
