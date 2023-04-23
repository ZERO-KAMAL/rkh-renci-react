import { CircularProgress } from '@mui/material'
import upload from 'app/assets/images/renci/blank-image.svg'
import { fetchUserById, updateImage, updateUserProfile } from 'app/http/users/userSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { Form, Formik } from 'formik'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'
import { useCallback, useEffect, useState } from 'react'
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

import Button from '../../../common/button'
import Input from '../../../common/input'
import CredentialDetails from './CredentialDetails'
import CredentialsChangeForm from './CredentialsChangeForm'
import './styles.scss'

const VERSION = import.meta.env.VITE_APP_VERSION

// Validation schema
const userProfileSchema = yup.object().shape({
  // firstName: yup.string().required('First Name is required'),
  phoneNumber: yup.string(),
})

const UserInfo = [
  // {
  //   label: 'Location',
  //   placeholder: 'Novena',
  //   name: 'locationDetailIds[0].location.name',
  //   disabled: true,
  // },
  // { label: 'Area', placeholder: 'SCC', name: 'locationDetailIds[0].area.name', disabled: true },
  // {
  //   label: 'Department',
  //   placeholder: 'NA',
  //   name: 'locationDetailIds[0].department.name',
  //   disabled: true,
  // },
  // {
  //   label: 'Contact Number',
  //   placeholder: 'Contact Number',
  //   name: 'phoneNumber',
  //   disabled: false,
  //   required: false,
  // },
  {
    label: 'Designation',
    placeholder: 'Designation',
    name: 'designation',
    disabled: false,
    required: false,
  },
]

const initialValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  fullName: '',
  avatarUri: '',
  phoneNumber: '',
  isAdmin: false,
  address: '',
  dob: '',
  roleId: '',
  locationDetailIds: [],
}

const UserProfileForm = () => {
  countries.registerLocale(english)
  const [image, setImage] = useState('')
  const [showChangeForm, setShowChangeForm] = useState('')

  const dispatch = useAppDispatch()

  const { user } = useSelector(
    (state: any) => ({
      user: state?.user?.currentUser?.userInfo,
    }),
    shallowEqual
  )

  const { loading } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUserById(user.id))
  }, [])

  const getUserImage = () => {
    let img = upload
    if (image) {
      img = image
    } else if (user?.avatarUri) {
      img = user?.avatarUri
    }
    return img
  }

  const onImageRemove = () => {
    setImage('/assets/svgs/uploadimg.svg')
  }

  const validateNumber = (phoneNumber: string) => {
    const countryCode = parsePhoneNumber(phoneNumber)?.country

    let countryName = ''
    if (countryCode) {
      countryName = countries.getName(countryCode, 'en')
    }
    return { isValid: isValidPhoneNumber(phoneNumber), countryName }
  }

  const validate = (values: any) => {
    const errors: { phoneNumber?: string } = {}

    if (values.phoneNumber) {
      const { isValid: isValidMobile, countryName: mobileCountryName } = validateNumber(
        values.phoneNumber
      )

      if (!isValidMobile && Boolean(mobileCountryName)) {
        errors.phoneNumber = 'Invalid mobile number for ' + mobileCountryName
        return errors
      }
      if (!isValidMobile) {
        errors.phoneNumber = 'Invalid mobile number'
        return errors
      }
    }

    return errors
  }

  return !loading ? (
    <div className='max-w-[1120px] w-full mx-auto'>
      <p className='text-lg font-semibold leading-7 mb-6'>User Profile</p>
      <div className='bg-white rounded-xl'>
        <Formik
          initialValues={user || initialValues}
          validationSchema={userProfileSchema}
          enableReinitialize
          validate={validate}
          onSubmit={(values) => {
            // console.log('on Submit')
            // console.log(values)
            dispatch(
              updateUserProfile({
                id: values.id,
                user: {
                  ...values,
                },
              }) as any
            )
          }}
        >
          {({ values, errors, touched, setFieldValue, setTouched }) => {
            const onImageUpload = (event: any) => {
              const file = event.target.files[0]
              if (event.target.files && file) {
                dispatch(updateImage(file) as any).then((res: any) => {
                  const { payload } = res
                  if (payload.status === 200) {
                    setFieldValue('avatarUri', payload.uri)
                    setImage(URL.createObjectURL(file))
                  }
                })
              }
            }
            return (
              <Form>
                <div className=' pt-9  pb-5 border-b-2 border-[#EFF2F5]'>
                  <p className='pl-8 text-base md:text-lg font-bold leading-6 text-[#3F4254]'>
                    Profile Details
                  </p>
                </div>
                <div className='pl-8 w-full flex flex-col md:flex-row pt-7'>
                  <div className='w-[30%]'>
                    <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254]'>
                      Avatar
                    </p>
                  </div>
                  <div className='pt-5 md:pt-0 w-[70%] flex md:flex-nowrap flex-wrap'>
                    <div
                      className='bg-white mr-5 flex justify-center items-center rounded-xl min-w-[117px] h-[121px] drop-shadow-2xl'
                      style={{
                        background: `url(${getUserImage()}) no-repeat center center/cover`,
                      }}
                    />
                    <div className='max-w-[150px] flex items-end'>
                      <label
                        htmlFor='avatar'
                        className='bg-[#F69B11] mt-2 md:mt-0 text-white h-[42px] min-w-[150px] hover:bg-[#F69B11] hover:text-white hover:shadow-md py-3 px-5 rounded-md text-sm font-semibold shadow-md cursor-pointer'
                      >
                        Upload Image
                      </label>
                      <input
                        id='avatar'
                        className='invisible'
                        type='file'
                        name='file'
                        accept='.png, .jpg, .jpeg'
                        onChange={(e: any) => {
                          onImageUpload(e)
                          setFieldValue('avatarUri', e.currentTarget.files[0])
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className='pl-8 w-full flex flex-col md:flex-row pt-16'>
                  <div className='w-[30%] mb-3 md:0'>
                    <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254]'>
                      Full Name
                      {/* <span className='text-[#FD3D00]'>*</span> */}
                    </p>
                  </div>
                  <div className='w-full md:w-[70%]'>
                    <div className='flex items-start'>
                      <Input
                        width='w-[90%]'
                        styles='md:w-full w-[100%]'
                        name='fullName'
                        placeholder='Full Name'
                      />
                    </div>
                  </div>
                </div>
                <div className='pl-8 w-full flex flex-col md:flex-row pt-16'>
                  <div className='w-[30%] mb-3 md:0'>
                    <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254]'>
                      Role
                    </p>
                  </div>
                  <div className='w-full md:w-[70%]'>
                    <div className='flex items-start'>
                      <p>{user?.role?.name}</p>
                    </div>
                  </div>
                </div>
                <div className='pl-8 w-full flex flex-col md:flex-row pt-16'>
                  <div className='w-[30%] mb-3 md:0'>
                    <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254]'>
                      Assigned Locations
                    </p>
                  </div>
                  <div className='w-full md:w-[70%]'>
                    <div className='bg-[#F5F8FA] border rounded-md md:w-[90%]'>
                      <div className='p-3'>
                        <div className='overflow-x-auto'>
                          <table className='table-auto w-full'>
                            <thead className='text-xs font-semibold uppercase text-gray-400 bg-gray-50'>
                              <tr>
                                <th className='p-2 whitespace-nowrap'>
                                  <div className='font-semibold text-left text-sm'>Location</div>
                                </th>
                                <th className='p-2 whitespace-nowrap'>
                                  <div className='font-semibold text-left text-sm'>Area</div>
                                </th>
                                <th className='p-2 whitespace-nowrap'>
                                  <div className='font-semibold text-left text-sm'>Department</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='text-sm divide-y divide-gray-100'>
                              {user?.locationDetailIds?.map((locationDetailId: any, ind: any) => (
                                <tr key={ind}>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                      {locationDetailId?.location?.name ? (
                                        <div className='font-medium text-gray-800'>
                                          {locationDetailId?.location?.name}
                                        </div>
                                      ) : (
                                        <div className='text-left font-medium text-green-500'>
                                          {'All Locations'}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='text-left'>
                                      {locationDetailId?.area?.name ? (
                                        <div className='font-medium text-gray-800'>
                                          {locationDetailId?.area?.name}
                                        </div>
                                      ) : (
                                        <div className='text-left font-medium text-green-500'>
                                          {'All Areas'}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='text-left font-medium text-green-500'>
                                      {locationDetailId?.department?.name ? (
                                        <div className='font-medium text-gray-800'>
                                          {locationDetailId?.department?.name}
                                        </div>
                                      ) : (
                                        <div className='text-left font-medium text-green-500'>
                                          {'All Departments'}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {!user?.locationDetailIds.length && (
                                <tr>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                      <div className='font-medium text-green-500'>
                                        All Locations
                                      </div>
                                    </div>
                                  </td>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='text-left font-medium text-green-500'>
                                      All Areas
                                    </div>
                                  </td>
                                  <td className='p-2 whitespace-nowrap'>
                                    <div className='text-left font-medium text-green-500'>
                                      All Departments
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pl-8 flex flex-col md:flex-row w-full pt-8 md:pt-16'>
                  <div className='w-full md:w-[30%]'>
                    <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254] mb-2 md:mb-0'>
                      Phone Number
                    </p>
                  </div>
                  <div className='w-full md:w-[70%]'>
                    <div className='flex items-start'>
                      {/* <Input
                        name={'phoneNumber'}
                        width='w-[90%]'
                        className={`${'bg-[#F5F8FA] border rounded-md px-4 py-3 w-full md:w-[90%]'}`}
                        styles='md:w-full w-[100%]'
                        placeholder={'Phone number'}
                      /> */}
                      <PhoneInput
                        flags={flags}
                        className='h-15 bg-[#F5F8FA] border rounded-md px-4 py-3 w-full md:w-[90%] mr-2'
                        defaultCountry='SG'
                        placeholder='Mobile number'
                        value={values.phoneNumber}
                        international={false}
                        onBlur={() => {
                          setTouched({ phoneNumber: true })
                        }}
                        onChange={(phoneNum) => {
                          setFieldValue('phoneNumber', phoneNum)
                        }}
                      />
                    </div>
                    {touched.phoneNumber && errors.phoneNumber && (
                      <div className='text-red-600 text-sm'>
                        <span role='alert'>{errors.phoneNumber.toString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                {UserInfo.map((items, index) => (
                  <div className='pl-8 flex flex-col md:flex-row w-full pt-8 md:pt-16' key={index}>
                    <div className='w-full md:w-[30%]'>
                      <p className='text-base md:text-lg font-medium leading-6 text-[#3F4254] mb-2 md:mb-0'>
                        {items.label}
                        {items.required && <span className='text-[#FD3D00]'>*</span>}
                      </p>
                    </div>
                    <div className='w-full md:w-[70%]'>
                      <div className='flex items-start'>
                        <Input
                          name={items.name}
                          width='w-[90%]'
                          className={`${
                            items.disabled
                              ? 'bg-white  rounded-md px-4 py-3 w-full md:w-[90%]'
                              : 'bg-[#F5F8FA] border rounded-md px-4 py-3 w-full md:w-[90%]'
                          }`}
                          styles='md:w-full w-[100%]'
                          placeholder={items.placeholder}
                          disabled={items.disabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className=' pt-9 pb-12 mt-12 border-t-2 border-[#EBEDF3] '>
                  <div className='pl-8 flex justify-end items-center w-[91%] md:w-[93%]'>
                    <div>
                      <p className='text-[15px] text-[#B5B5C3] font-medium leading-5'>Discard</p>
                    </div>
                    <div className='ml-6'>
                      <Button text='Save Changes' type='submit' />
                    </div>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>

      {showChangeForm ? (
        <CredentialsChangeForm
          userEmail={user?.email}
          showChangeForm={showChangeForm}
          handleChangeForm={setShowChangeForm}
        />
      ) : (
        <CredentialDetails user={user} handleChangeForm={setShowChangeForm} />
      )}

      <p className='text-left bg-white mt-5 px-3 rounded-lg py-2 italic text-sm'>
        App Version: {VERSION}
      </p>
    </div>
  ) : (
    <CircularProgress color='success' />
  )
}

export default UserProfileForm
