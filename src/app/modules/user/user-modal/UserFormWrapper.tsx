import LocationDetailCustomV2 from 'app/components/LocationDetailCustomV2'
import ModalWrapper from 'app/components/modal/ModalWrapper'
import UserConst from 'app/constants/user.const'
import { defParamsRole, fetchRoles } from 'app/http/roles-modules/roleModuleSlice'
import { userTableSlice } from 'app/http/users/userTableSlice'
import UserService from 'app/http/users/usersService'
import useAuth from 'app/modules/auth/login/hooks/useAuth'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'
import { memo, useCallback, useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import {
  UserForm,
  userInitialValues,
  userValidateSchema,
  userValidateSchemaPassword,
} from '../model/UserFormik.model'
import './styles.scss'

const UserFormWrapper = () => {
  countries.registerLocale(english)

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const table = useAppSelector((state) => state.userTable.table)
  const currentUser = useAppSelector((state) => state.user.currentUser)
  const ldTemp: any = table?.modalData?.locationDetailIds

  const [isNotSuperadmin, setIsNotSuperadmin] = useState(false)
  // console.log(`User From Wrapper Rendering => ${JSON.stringify(ldTemp)}`)

  const closeForm = () => {
    dispatch(
      userTableSlice.actions.setTable({
        modalData: undefined,
        showModal: false,
      })
    )
  }

  const isEditModal = typeof table.modalData?.id !== 'number'
  const modalTitle = isEditModal ? 'Add User' : 'Edit User'

  const validateNumber = (phoneNumber: string) => {
    const countryCode = parsePhoneNumber(phoneNumber)?.country

    let countryName = ''
    if (countryCode) {
      countryName = countries.getName(countryCode, 'en')
    }
    return { isValid: isValidPhoneNumber(phoneNumber), countryName }
  }

  const validate = (values: Partial<UserForm>) => {
    const errors: { phoneNumber?: string; locationDetails?: string } = {}

    const locationErrors = locationDetailValidate()
    if (locationErrors) {
      errors.locationDetails = 'Location details cannot be empty'
      return errors
    }

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

  const formik = useFormik({
    initialValues: table?.modalData || userInitialValues,
    enableReinitialize: true,
    validate: validate,
    validationSchema: isEditModal
      ? userValidateSchema.concat(userValidateSchemaPassword)
      : userValidateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // console.log('isValid: ', !locationDetailValidate())
      console.log('VALUES: ', values)
      console.log('isSuperadmin: ', isNotSuperadmin)

      const locationDetailIds: any = locationDetail.map(({ address, ...keepAttrs }) => keepAttrs)
      locationDetailIds.forEach((obj: any) => {
        if (obj.locationId == 0 || !isNotSuperadmin) delete obj['locationId']
        if (obj.areaId == 0 || !isNotSuperadmin) delete obj['areaId']
        if (obj.departmentId == 0 || !isNotSuperadmin) delete obj['departmentId']
        delete obj['locationName']
        delete obj['areaName']
        delete obj['departmentName']
      })

      if (locationDetailIds.length && Object.keys(locationDetailIds[0]).length !== 0) {
        values = { ...values, locationDetailIds }
      } else {
        values = { ...values, locationDetailIds: [] }
      }

      console.log('VALUES => : ', values)

      setSubmitting(false)
      try {
        isEditModal
          ? await UserService.createUser(values)
          : await UserService.updateUser(values.id!, values)
        setSubmitting(false)
        closeForm()
        if (values.id! === currentUser?.userInfo.id) {
          useAuth.logout(dispatch)
          toast.success('User updated. Please login again.')
        } else {
          toast.success('Success')
        }

        queryClient.invalidateQueries({ queryKey: ['user-getbyfilter'] })
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })

  // Password toggle
  const [passwordType, setPasswordType] = useState('password')
  const togglePassword = (e: any) => {
    e.preventDefault()
    passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')
  }

  // James Role
  const { dataTable: roleTable, text } = useAppSelector((state) => state.roleModule)
  // const initFetch = useCallback(async () => {
  //   await dispatch(fetchRoles(defParamsRole))
  // }, [dispatch])
  // useEffect(() => {
  //   initFetch()
  // }, [text])

  // ---- James Components Location logic Start
  const [locationDetail, setLocationDetail] = useState<Array<any>>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    const tempLocationDetailList: Array<any> = []
    if (ldTemp) {
      ldTemp.forEach((data: any) => {
        // console.log(`temp data => ${JSON.stringify(data)}`)
        tempLocationDetailList.push({
          locationId: data.locationId,
          areaId: data.areaId,
          departmentId: data.departmentId,
          address: ``,
          locationName: data.location?.name,
          areaName: data.area?.name,
          departmentName: data.department?.name,
        })
      })
      setLocationDetail(tempLocationDetailList)
    }
  }, [ldTemp])

  const handleAddClick = () => {
    setLocationDetail([
      ...locationDetail,
      {
        locationId: 0,
        areaId: 0,
        departmentId: 0,
        address: '',
        locationName: '',
        areaName: '',
        departmentName: '',
      },
    ])
    setError(false)
  }
  useEffect(() => {
    if (isEditModal) {
      handleAddClick()
    }
  }, [])

  const [toggle, setToggle] = useState(false)
  const handleRemoveClick = (index: number) => {
    setLocationDetail((locationDetail) => locationDetail.splice(index, 1))
    setToggle((prev) => !prev)
  }

  const updateLocationDetail = (data: any) => {
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      address: '',
      locationName: data.locationName,
      areaName: data.areaName,
      departmentName: data.departmentName,
    }
    const list = [...locationDetail]
    list[data.index] = update
    setLocationDetail(list)
    // console.log(`latest Location Detail =>${JSON.stringify(locationDetail)}`)

    // console.log('WILLIAM => updateLocationDetail')
    locationDetailValidate()
  }

  useEffect(() => {
    // console.log('WILLIAM => useEffect: ', locationDetail)
    if (locationDetail.length > 0) locationDetailValidate()
  }, [toggle, locationDetail])

  const locationDetailValidate = () => {
    // if (!locationDetail.length) return
    console.log('locationDetail: ', locationDetail)
    const isValid: boolean =
      (locationDetail?.length > 0 && locationDetail.every((value) => value.locationId! > 0)) ||
      !isNotSuperadmin
    console.log('isValid: ', isValid)
    setError(!isValid)
    return !isValid
  }
  // ---- James Components Location logic end

  useEffect(() => {
    const isAdmin = Boolean(
      roleTable?.filter(
        (role) =>
          role.code === UserConst.QSM_SUPERADMIN_CODE &&
          role.id == formik.getFieldProps('roleId').value
      ).length
    )
    setIsNotSuperadmin(!isAdmin)
  }, [formik])

  return (
    <ModalWrapper title={modalTitle} onClose={closeForm} onSubmit={formik.handleSubmit}>
      <form id='modal_add_user_form' className='form md:w-[30rem]' noValidate autoComplete='off'>
        <div>
          {/* Full Name */}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>
              Full Name
              <span className='text-red-700 font-bold'> *</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <input
                type='text'
                id='fullName'
                placeholder='First Name'
                autoComplete='off'
                {...formik.getFieldProps('fullName')}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
              />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.fullName}</span>
              </div>
            )}
          </div>
          {/* Role */}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>
              Role
              <span className='text-red-700 font-bold'> *</span>
            </label>
            {roleTable && (
              <div className='pl-2 bg-[#ECF0F3] rounded text-[#80808F]'>
                <select
                  className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
                  {...formik.getFieldProps('roleId')}
                >
                  {!roleTable && <option value=''>Loading roles...</option>}
                  {roleTable && <option value=''>Select a Role</option>}
                  {roleTable.map((roleName) => {
                    return (
                      <option value={roleName.id} key={roleName.id} className='h-32'>
                        {roleName.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}
            {formik.touched.roleId && formik.errors.roleId && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.roleId}</span>
              </div>
            )}
          </div>
          {/* Email*/}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>
              Email
              <span className='text-red-700 font-bold'> *</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <input
                type='text'
                id='email'
                placeholder='Email'
                autoComplete='off'
                {...formik.getFieldProps('email')}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* Designation */}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>Designation</label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <input
                type='text'
                id='designation'
                placeholder='Designation'
                autoComplete='on'
                {...formik.getFieldProps('designation')}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
              />
            </div>
          </div>
          {/* Password*/}
          {isEditModal && (
            <div className='w-full mb-4'>
              <label className='block mb-2 text-sm font-medium text-skin-black'>
                Password
                <span className='text-red-700 font-bold'> *</span>
              </label>
              <div
                className='pl-2 bg[#ECF0F3] rounded flex '
                style={{ backgroundColor: '#ECF0F3' }}
              >
                <input
                  className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
                  autoComplete='new-password'
                  id='password'
                  placeholder='Password'
                  type={passwordType}
                  {...formik.getFieldProps('password')}
                />
                <div onClick={togglePassword} className=' right-0 p-2'>
                  {passwordType === 'password' ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </div>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className='text-red-600 text-sm'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              )}
            </div>
          )}
          {/* Mobile number*/}
          <div className='w-full mb-4'>
            <label className='block mb-2 text-sm font-medium text-skin-black '>Mobile</label>
            <div className='pl-2 bg-[#ECF0F3] rounded'>
              <PhoneInput
                flags={flags}
                className='bg-transparent h-10 focus:outline-none rounded-md text-sm w-full'
                defaultCountry='SG'
                placeholder='Mobile number'
                value={formik.values.phoneNumber}
                international={false}
                onBlur={() => {
                  formik.setTouched({ phoneNumber: true })
                }}
                onChange={(phoneNum) => {
                  formik.setFieldValue('phoneNumber', phoneNum)
                }}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className='text-red-600 text-sm'>
                <span role='alert'>{formik.errors.phoneNumber}</span>
              </div>
            )}
          </div>
          {/* Location Details */}

          {isNotSuperadmin && (
            <>
              <div className='flex  '>
                <label className='block mb-2 text-sm font-medium text-skin-black '>
                  Location Details <span className='text-red-900 font-bold'>*</span>
                </label>
                <div
                  className='w-[20px] h-[20px] bg-[#DFF1EB] ml-3 rounded
                   hover:bg-green-900 hover:text-white hover:text-3xl'
                  onClick={() => handleAddClick()}
                >
                  <IoMdAdd className='text-[#50CD89]' size={20} />
                </div>
              </div>

              {/* dynamic create */}
              <div className='pb-2'>
                {locationDetail &&
                  locationDetail.map((data, i) => {
                    // console.log(`dynamic location detail => ${JSON.stringify(data)}`)
                    return (
                      <LocationDetailCustomV2
                        key={i}
                        index={i}
                        showLocationSelectAll={false}
                        locationId={data.locationId!}
                        areaId={data.areaId!}
                        departmentId={data.departmentId!}
                        handleRemoveClick={handleRemoveClick} // handleRemoveClick
                        updateLocationDetail={updateLocationDetail}
                        titleHidden={false}
                        locationName={data.locationName!}
                        areaName={data.areaName!}
                        departmentName={data.departmentName!}
                        locationEnable={true}
                      />
                    )
                  })}
                {error && (
                  <div className='text-red-600 text-sm'>
                    <span role='alert'>Location details missing</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </form>
    </ModalWrapper>
  )
}

export default memo(UserFormWrapper)
