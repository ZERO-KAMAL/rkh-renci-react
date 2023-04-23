import { SUPERADMIN_ID } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { useAppSelector } from 'app/redux/store'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  allowedModules: any[]
  component: JSX.Element
}

const RequireAuth = (props: Props) => {
  const { allowedModules, component } = props
  const location = useLocation()

  const user = useAppSelector((state) => state.user.currentUser)
  const id = useAppSelector((state) => state.user.currentUser?.userInfo.role?.id)
  const userPermissions = user?.userInfo.role?.permissions

  const auth = (): boolean => {
    const isAuth = Boolean(
      userPermissions?.find((user) => allowedModules.find((allowed) => allowed.code === user.code))
    )

    // Superadmin
    if (id && id === SUPERADMIN_ID) {
      return true
    }

    return isAuth
  }

  return auth() ? (
    component
  ) : (
    <Navigate to={NAVIGATE_LINKS.ERRORS.ERROR403} state={{ from: location }} />
  )
}

export default RequireAuth
