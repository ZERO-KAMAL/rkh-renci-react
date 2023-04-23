import useAuth from 'app/modules/auth/login/hooks/useAuth'
import { useAppDispatch, useAppSelector } from 'app/redux/store'

const LogoutWrapper = () => {
  const dispatch = useAppDispatch()
  useAuth.logout(dispatch)
  return <></>
}

export default LogoutWrapper
