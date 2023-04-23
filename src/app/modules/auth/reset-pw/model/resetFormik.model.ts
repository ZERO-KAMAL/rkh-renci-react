import { ChangePassword } from 'app/http/users/users.model'
import * as Yup from 'yup'

export interface ResetForm extends ChangePassword {
  password: string
}

export const resetInitialValues: ResetForm = {
  email: '',
  otp: '',
  password: '',
  newPassword: '',
}

const errorMsg = 'Use 8 or more characters, and at least 1 number and symbol (like !@#$%^)'
export const resetSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, errorMsg) // 'Minimum 8 characters or more'
    .max(20, 'Maximum 20 symbols')
    .matches(/[a-z]+/, 'Requires 1 lowercase character') // 'One lowercase character'
    .matches(/[A-Z]+/, 'Requires 1 uppercase character') // 'One uppercase character'
    .matches(/[@$!%*#?&]+/, 'Requires 1 special character') // 'One special character'
    .matches(/\d+/, 'Requires 1 number ') // 'One number'
    .required('Password is required'),
  newPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords are not the same!')
    .required('Password confirmation is required!'),
})
