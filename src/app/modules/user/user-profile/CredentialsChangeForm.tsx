import { updateUserEmail } from 'app/http/users/userSlice'
import UserService from 'app/http/users/usersService'
import useAuth from 'app/modules/auth/login/hooks/useAuth'
import { useAppDispatch } from 'app/redux/store'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import Button from '../../../common/button'
import Input from '../../../common/input'

const errorMsg = 'Use 8 or more characters, and at least 1 number and symbol (like !@#$%^)'

const initialValues = {
  oldEmail: '',
  newEmail: '',
  newPassword: '',
  oldPassword: '',
  confirmPassword: '',
}

const CredentialsChangeForm = ({ userEmail, showChangeForm, handleChangeForm }: any) => {
  const dispatch = useAppDispatch()

  const credentialsChangeFormSchema = useMemo(
    () =>
      yup.object().shape({
        newEmail: yup
          .string()
          .email('Invalid email format')
          .min(3, 'Minimum 3 symbols')
          .max(50, 'Maximum 50 symbols')
          .required('Email is required')
          .notOneOf([yup.ref('oldEmail')], 'New Email cannot be the same as old email'),
        oldEmail: yup
          .string()
          .email('Invalid email format')
          .min(3, 'Minimum 3 symbols')
          .max(50, 'Maximum 50 symbols')
          .required('Email is required'),
        oldPassword: yup
          .string()
          .min(8, errorMsg) // 'Minimum 8 characters or more'
          .max(20, 'Maximum 20 symbols')
          .matches(/[a-z]+/, errorMsg) // 'One lowercase character'
          .matches(/[A-Z]+/, errorMsg) // 'One uppercase character'
          .matches(/[@$!%*#?&]+/, errorMsg) // 'One special character'
          .matches(/\d+/, errorMsg) // 'One number'
          .required('Password is required'),
        newPassword: yup
          .string()
          .min(8, errorMsg) // 'Minimum 8 characters or more'
          .max(20, 'Maximum 20 symbols')
          .matches(/[a-z]+/, errorMsg) // 'One lowercase character'
          .matches(/[A-Z]+/, errorMsg) // 'One uppercase character'
          .matches(/[@$!%*#?&]+/, errorMsg) // 'One special character'
          .matches(/\d+/, errorMsg) // 'One number'
          .required('New Password is required'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
          .required('Confirm Password is required'),
      }),
    []
  )

  if (showChangeForm === 'changePassword') {
    credentialsChangeFormSchema.fields.oldEmail = yup.string() as any
    credentialsChangeFormSchema.fields.newEmail = yup.string() as any
  } else {
    credentialsChangeFormSchema.fields.newPassword = yup.string() as any
    credentialsChangeFormSchema.fields.confirmPassword = yup.string() as any
  }
  return (
    <div className='bg-white rounded-xl mt-8'>
      <div>
        <div className='pl-8 pt-9  pb-5 border-b-2 border-[#EFF2F5]'>
          <p className='text:base md:text-lg font-bold leading-6 text-[#3F4254] mb-2 md:mb-2'>
            Log In Details
          </p>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={credentialsChangeFormSchema}
        enableReinitialize
        onSubmit={async (values) => {
          if (showChangeForm === 'changeEmail') {
            const updatedValues = {
              oldPassword: values.oldPassword,
              newEmail: values.newEmail,
              oldEmail: values.oldEmail,
            }
            try {
              // dispatch(updateUserEmail(updatedValues))
              await UserService.changeEmail(updatedValues)
              toast.success('Email changed successfully!')
              useAuth.logout(dispatch)
            } catch (error: any) {
              console.log(error)
              toast.error(`Error ${error?.status}! ${error?.data?.message || ''}`)
            }
          } else {
            try {
              await UserService.changePasswordWeb({
                email: userEmail,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              })
              toast.success('Password changed successfully!')
              useAuth.logout(dispatch)
            } catch (error: any) {
              // console.log(error)
              toast.error(`Error ${error?.status}! ${error?.data?.message || ''}`)
            }
          }
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              {showChangeForm === 'changeEmail' && (
                <>
                  <div className='pl-8 mt-9 w-full flex flex-col md:flex-row  items-start'>
                    <div className='w-full'>
                      <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254] mb-2'>
                        Enter Old Email Address
                      </p>
                      <Input
                        name='oldEmail'
                        type='email'
                        styles='w-full'
                        width='w-[90%]'
                        placeholder='Enter Old Email'
                      />
                    </div>
                    <div className='w-full'>
                      <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254] mb-2'>
                        Enter New Email Address
                      </p>
                      <Input
                        name='newEmail'
                        type='email'
                        styles='w-full'
                        width='w-[90%]'
                        placeholder='Enter New Email'
                      />
                    </div>
                    <div className='w-full'>
                      <p className='text:base md:text-lg font-medium leading-6 text-[#3F4254] my-2 md:mb-2 md:mt-0'>
                        Confirm Password
                      </p>
                      <Input
                        name='oldPassword'
                        type='password'
                        styles='w-full'
                        width='w-[90%]'
                        placeholder=''
                      />
                    </div>
                  </div>
                  <div className='mt-4 pb-8 pl-8 flex justify-start items-center w-[91%] md:w-[93%]'>
                    <div className='mr-6'>
                      <Button text='Update Email' type='submit' />
                    </div>
                    <div>
                      <p
                        className='text-[15px] text-[#B5B5C3] font-medium leading-5 cursor-pointer'
                        onClick={() => handleChangeForm('')}
                      >
                        Cancel
                      </p>
                    </div>
                  </div>
                </>
              )}
              {showChangeForm === 'changePassword' && (
                <>
                  <div className='pl-8 mt-5 flex flex-col md:flex-row items-start'>
                    <div className='w-full'>
                      <p className='text:base md:text-lg font-medium leading-6 text-[#3F4254] mb-2'>
                        Current Password
                      </p>
                      <Input
                        name='oldPassword'
                        type='password'
                        styles='w-full'
                        width='w-[90%]'
                        placeholder=''
                      />
                    </div>
                    <div className='w-full'>
                      <p className='text:base md:text-lg font-medium leading-6 text-[#3F4254] my-2 md:mb-2 md:mt-0'>
                        New Password
                      </p>
                      <Input
                        name='newPassword'
                        type='password'
                        styles='w-full'
                        width='w-[90%]'
                        placeholder=''
                      />
                    </div>
                    <div className='w-full'>
                      <p className='text:base md:text-lg font-medium leading-6 text-[#3F4254] my-2 md:mb-2 md:mt-0'>
                        Confirm New Password
                      </p>
                      <Input
                        name='confirmPassword'
                        type='password'
                        styles='w-full'
                        width='w-[90%] md:w-[85%]'
                        placeholder=''
                      />
                    </div>
                  </div>
                  <div className='mt-4 pb-8 pl-8 flex justify-start items-center w-[91%] md:w-[93%]'>
                    <div className='mr-6'>
                      <Button text='Update Password' type='submit' />
                    </div>
                    <div>
                      <p
                        className='text-[15px] text-[#B5B5C3] font-medium leading-5 cursor-pointer'
                        onClick={() => handleChangeForm('')}
                      >
                        Cancel
                      </p>
                    </div>
                  </div>
                </>
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default CredentialsChangeForm
