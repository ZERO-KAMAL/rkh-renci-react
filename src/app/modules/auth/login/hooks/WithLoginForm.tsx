import Auth from 'app/constants/auth'
import { SUPERADMIN_ID } from 'app/constants/module-permission'
import ConstService from 'app/http/app-constants/constService'
import { constSlice } from 'app/http/app-constants/constSlice'
import { userSlice } from 'app/http/users/userSlice'
import { useAppDispatch } from 'app/redux/store'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import LoginForm from '../components/LoginForm'
import { loginInitialValues, loginSchema } from '../model/loginFormik.model'
import useAuth from './useAuth'


const WithLoginForm = () => {
  const dispatch = useAppDispatch()

  const { refetch: FetchConstantsAPI } = ConstService.constantsQuery((res: any) => {
    dispatch(constSlice.actions.setConstants(res.data))
  })

  const formik = useFormik({
    initialValues: loginInitialValues,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        dispatch(userSlice.actions.setHasLogout(false)) 
        const res = await useAuth.login(dispatch, values.email, values.password)
        if (
          !res.data.userInfo?.role?.permissions.length &&
          res.data.userInfo?.role?.id !== SUPERADMIN_ID
        ) {
          toast.error(Auth.PERMISSION_DENIED + res.data.userInfo.role?.name)

          useAuth.logout(dispatch)
          return
        }
        if (res.status < 400) {
          // App init requirements
          FetchConstantsAPI()

          // navigate to dashboard
          dispatch(userSlice.actions.setCurrentUser(res.data))
        }
        setSubmitting(false)
      } catch (err) {
        console.log(err)
        setSubmitting(false)
      }
    },
  })
  return <LoginForm formik={formik} />
}

export default WithLoginForm
