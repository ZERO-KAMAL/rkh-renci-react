// App components
import useLocalStorage from 'app/helpers/hooks/useLocalStorage'
import { userSlice } from 'app/http/users/userSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useEffect } from 'react'

import Header from '../components/Header'
import WithLoginForm from './hooks/WithLoginForm'

const Login = () => {
  const jwtTimeout = useAppSelector((state) => state.user.jwtTimeout)
  const dispatch = useAppDispatch()

  useEffect(() => {
    useLocalStorage.removeUser()
    dispatch(userSlice.actions.setCurrentUser(undefined))
    useLocalStorage.removeIsRefresh()
    if (jwtTimeout) {
      clearTimeout(jwtTimeout)
      dispatch(userSlice.actions.setJwtTimeout(undefined))
    }
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <Header name='Log in' />
      <div className='mx-12 md:mx-16 lg:mx-20'>
        <WithLoginForm />
      </div>
    </div>
  )
}

export default Login
