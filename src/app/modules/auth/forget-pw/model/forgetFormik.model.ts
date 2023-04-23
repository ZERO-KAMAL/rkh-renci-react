import { UserInfo } from 'app/http/users/users.model'
import * as Yup from 'yup'

export type ForgetForm = Partial<UserInfo>

export const forgetPwInitialValues: ForgetForm = {
  email: '',
}

export const forgetPwSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})
