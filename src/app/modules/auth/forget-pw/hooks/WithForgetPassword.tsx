import UserService from 'app/http/users/usersService'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ForgetPasswordForm from '../components/ForgetPasswordForm'
import { forgetPwInitialValues, forgetPwSchema } from '../model/forgetFormik.model'
import WithOtpDialog, { OtpDialogProps } from './WithOtpDialog'

const WithForgetPassword = () => {
  const [dialog, setDialog] = useState<OtpDialogProps>({ open: false, email: '' })
  
  const formik = useFormik({
    initialValues: forgetPwInitialValues,
    enableReinitialize: true,
    validationSchema: forgetPwSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!values.email) return
      try {
        console.log('onsubmit')
        const res = await UserService.resetEmailPassword(values.email)
        setDialog({
          open: true,
          email: values.email || '',
        })
        setSubmitting(false)
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return (
    <>
      <ForgetPasswordForm formik={formik} />
      <WithOtpDialog dialog={dialog} email={dialog.email} setDialog={setDialog}/>
    </>
  )
}

export default WithForgetPassword
