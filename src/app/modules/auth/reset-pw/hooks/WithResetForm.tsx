import ConstService from 'app/http/app-constants/constService'
import { constSlice } from 'app/http/app-constants/constSlice'
import UserService from 'app/http/users/usersService'
import { useAppDispatch } from 'app/redux/store'
import { useFormik } from 'formik'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import ResetForm from '../components/ResetForm'
import { resetInitialValues, resetSchema } from '../model/resetFormik.model'

const WithLoginForm = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  // Return to homepage if email or otp not present
  const email = searchParams.get('email')
  const otp = searchParams.get('otp')
  if (!email || !otp) {
    navigate('/', { replace: true })
  }

  const formik = useFormik({
    initialValues: resetInitialValues,
    enableReinitialize: true,
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await UserService.changePassword({
          email: email!,
          otp: otp!,
          newPassword: values.newPassword,
        })
        toast.success('Successfully reset password')
        setTimeout(() => {
          navigate('')
        }, 2500)

        setSubmitting(false)
      } catch (err: any) {
        err?.status < 500
          ? toast.error(`An error has occurred`)
          : toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <ResetForm formik={formik} />
}

export default WithLoginForm
