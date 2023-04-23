import { LoginReq } from 'app/http/users/users.model'
import * as Yup from 'yup'

export type LoginForm = LoginReq

export const loginInitialValues: LoginForm = {
  email: '',
  password: '',
}

const errorMsg = 'Use 8 or more characters, and at least 1 number and symbol (like !@#$%^)'
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, errorMsg) // 'Minimum 8 characters or more'
    .max(20, 'Maximum 20 symbols')
    .matches(/[a-z]+/, errorMsg) // 'One lowercase character'
    .matches(/[A-Z]+/, errorMsg) // 'One uppercase character'
    .matches(/[@$!%*#?&]+/, errorMsg) // 'One special character'
    .matches(/\d+/, errorMsg) // 'One number'
    .required('Password is required'),
})
