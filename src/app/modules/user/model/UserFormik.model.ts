import { UserInfo } from 'app/http/users/users.model'
import * as Yup from 'yup'

export interface UserForm extends Partial<UserInfo> {
  password: ''
}

export const userInitialValues: UserForm = {
  email: '',
  password: '',
  fullName: '',
  avatarUri: '',
  phoneNumber: '',
  designation: '',
  isAdmin: false,
  address: '',
  roleId: undefined,
  locationDetailIds: undefined,
}

export const userValidateSchemaPassword = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Must be 8 characters or more')
    .max(20, 'Maximum 20 symbols')
    .matches(/[a-z]+/, 'One lowercase character')
    .matches(/[A-Z]+/, 'One uppercase character')
    .matches(/[@$!%*#?&]+/, 'One special character')
    .matches(/\d+/, 'One number')
    .required('Password is required')
    .nullable(true),
})

export const userValidateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required')
    .nullable(true),
  fullName: Yup.string().required('Fullname is required').nullable(true),
  avatarUri: Yup.string(),
  phoneNumber: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .matches(
      /^[+]((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Requires country code'
    )
    .nullable(true),
  isAdmin: Yup.string(),
  address: Yup.string(),
  roleId: Yup.number().required('Role is required').nullable(true),
  locationDetails: Yup.array().of(
    Yup.object().shape({
      location: Yup.string().required('Location is required').nullable(true),
      area: Yup.string().required('Area is required').nullable(true),
      department: Yup.string().required('Department is required').nullable(true),
    })
  ),
})
