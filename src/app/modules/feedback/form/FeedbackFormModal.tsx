import { Box, Dialog } from '@mui/material'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import CustomMultipleSelect3, { DropdownOptions } from 'app/common/MultipleSelect3'
import LocationDetailCustomV2 from 'app/components/LocationDetailCustomV2'
import { FEEDBACK_MAX_CHAR } from 'app/constants'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { Params } from 'app/http/feedback-types/feedbacktypes.model'
import { defParamsFb, fetchFeedbackTypes } from 'app/http/feedback-types/feedbacktypesSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import clsx from 'clsx'
import dayjs, { Dayjs } from 'dayjs'
import { useFormik } from 'formik'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
// import {FeedbackType, Source, Salutation} from '../../../../app/data/datas'
import { IoMdAdd } from 'react-icons/io'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { FeedbackFormSchema } from '../../../http/feedbacks/feedBack.model'
import { createFeedback, setActiveFeedBackForm } from '../../../http/feedbacks/feedBackSlice'
import CustomDropdown from '../components/CustomDropdown'

const FeedbackFormModal = () => {
  const dispatch = useAppDispatch()
  const { feedbackTypeList, sourceList, salutationList, editDataFeedback, editDataFeedbackOrg } =
    useAppSelector((state) => state.feedback)
  const { dataTable: feedbackTypeTbl, loading: loadingFeedbackType } = useAppSelector(
    (state) => state.feedbackTypes
  )

  const [dateSubmitted, setDateSubmitted] = useState<Dayjs | null>(
    editDataFeedback ? editDataFeedback.feedbackReceivedPicker : new Date()
  )
  const [feedbackType, setFeedbackType] = useState('')
  const [feedbackTypeSubOpt, setFeedbackTypeSubOpt] = useState<DropdownOptions[]>([])
  const [feedbackTypeSubCategory, setFeedbackTypeSubCategory] = useState<string[]>([])
  const [hasSubcategories, setHasSubcategories] = useState(false)

  const [source, setSource] = useState(editDataFeedback ? editDataFeedback.source : '')
  const [salutation, setSalutation] = useState(editDataFeedback ? editDataFeedback.salutation : '')
  const [locationDetail, setLocationDetail] = useState<Array<any>>([])
  const [error, setError] = useState(false)
  const [toggle, setToggle] = useState(false)

  // useEffect(() => {
  //   console.log('editDataFeedback: ', editDataFeedback)
  //   console.log('editDataFeedbackOrg: ', editDataFeedbackOrg)
  // }, [])

  // useEffect(() => {
  //   console.log('sourceList: ', sourceList)
  // }, [sourceList])

  const [feedBackInitialState] = useState<FeedbackFormSchema>({
    feedbackTypeName: editDataFeedback ? editDataFeedback.feedbackType : '',
    subCategories: editDataFeedback ? editDataFeedback.subCategories : [],
    source: editDataFeedback ? editDataFeedback.source : '',
    salutation: editDataFeedback ? editDataFeedback.salutation : '',
    submittedDate: editDataFeedback ? editDataFeedback.feedbackReceived : '',
    // firstName: editDataFeedback ? editDataFeedback.firstName : '',
    // lastName: editDataFeedback ? editDataFeedback.lastName : '',
    fullName: editDataFeedback ? editDataFeedback.fullName : '',
    contactNumber: editDataFeedback ? editDataFeedback.contactNumber : '',
    email: editDataFeedback ? editDataFeedback.email : '',
    locations: editDataFeedback ? editDataFeedback.assignLocations : [],
    patientName: editDataFeedback ? editDataFeedback.patientName : '',
    feedback: editDataFeedback ? editDataFeedback.feedback : '',
  })
  
  // useEffect(() => {
  //   console.log('feedBackInitialState: ', feedBackInitialState)
  // }, [feedBackInitialState])

  const FeedBackValidateSchema = Yup.object().shape({
    feedbackTypeName: Yup.string().required('FeedBack Type is required'),
    source: Yup.string().required('Source  is required'),
    salutation: Yup.string().required('Salutation  is required'),
    submittedDate: Yup.string().required('Date Submitted  is required'),
    fullName: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Full Name is required'),
    contactNumber: Yup.string()
      .min(8, 'Minimum 8 symbols')
      .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/, 'Wrong phone number format'),
    // .required('Contact number is required'),
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols'),
    // .required('Email is required'),
    feedback: Yup.string()
      .max(FEEDBACK_MAX_CHAR, `Maximum ${FEEDBACK_MAX_CHAR} symbols`)
      .required('Feedback is required'),
  })

  const extraValidationSchema = Yup.object().shape({
    subCategories: Yup.array().of(Yup.string()).min(1, 'Root causes/ aspects is required').nullable(true),
  })

  // feedback type logic
  useEffect(() => {
    dispatch(fetchFeedbackTypes(defParamsFb))
  }, [])

  useEffect(() => {
    const categories =
      feedbackTypeTbl.rows
        .find((item) => item.name === feedbackType)
        ?.subCategories?.map((subCategoryName) => {
          return {
            id: subCategoryName,
            label: subCategoryName,
          }
        }) || []
    setFeedbackTypeSubOpt(categories)
    setFeedbackTypeSubCategory([])
    formik.setFieldValue('subCategories', [])
    categories.length ? setHasSubcategories(true) : setHasSubcategories(false)
    formik.setTouched({ ...formik.touched, subCategories: false })
    // formik.setFieldValue('subCategories', [])
  }, [feedbackType])

  const handleSubCategoryChange = (ids: any[]) => {
    // console.log('handleSubCategoryChange: ', ids)
    setFeedbackTypeSubCategory(ids)
    formik.setFieldValue('subCategories', ids)
  }

  const resetAction = () => {
    formik.resetForm()

    setFeedbackType('')
    setSource('')
    setSalutation('')
    setLocationDetail([])
    setDateSubmitted(null)
  }

  useEffect(() => {
    // const date = moment(dateSubmitted?.toString()).format('DD/MM/YYYY')
    const date = moment(dateSubmitted?.toString()).format()
    // console.log('handle date change: ', date)
    formik.setFieldValue('submittedDate', date)
  }, [dateSubmitted])

  const formik = useFormik({
    initialValues: feedBackInitialState,
    enableReinitialize: true,
    validationSchema: hasSubcategories
      ? FeedBackValidateSchema.concat(extraValidationSchema)
      : FeedBackValidateSchema,
    // validateOnBlur : false,
    // validateOnChange : false,
    onSubmit: async (values, { setSubmitting }) => {
      // console.log('submit on click: ', values)
      try {
        if (locationDetailValidate()) {
          // post data proces
          const locDetails: any = locationDetail.map(
            ({ address, locationName, areaName, departmentName, ...keepAttrs }) => keepAttrs
          )
          locDetails.forEach((obj: any) => {
            if (obj.areaId == 0) delete obj['areaId']
            if (obj.departmentId == 0) delete obj['departmentId']
            // delete obj['locationName']
            // delete obj['areaName']
            // delete obj['departmentName']
          })
          // remove duplicated data
          const locations = Array.from(new Set(locDetails.map(JSON.stringify))).map((o: any) =>
            JSON.parse(o)
          )
          values = { ...values, locations }
          // console.log(`values => ${JSON.stringify(values)}`)
          console.log('submitting: ', values)
          // create process

          dispatch(createFeedback(values)).then((response: any) => {
            if (response.meta.requestStatus == 'fulfilled') {
              setSubmitting(true)
              // resetAction()
              toast.success(editDataFeedback ? 'Update Successful' : 'Save Successful', {
                position: toast.POSITION.TOP_RIGHT,
              })
              // dispatch(setActiveFeedBackDetail(false))
              // useHistory.replace(NAVIGATE_LINKS.FEEDBACK.OVERVIEW)
              dispatch(setActiveFeedBackForm(false))
            } else if (response.meta.requestStatus == 'rejected') {
              // console.log(`Error => ${JSON.stringify(response.payload.data.message)}`)
              setSubmitting(false)
              toast.error(response.payload.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              })
            }
          })
        }
      } catch (err) {
        const { data }: any = err
        const message = data.message ? data.message : 'Something was wrong'
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })
  // Components

  const FeedBackComp = useMemo(
    () => (
      <CustomDropdown
        title='FeedbackType'
        value={feedbackType}
        setValue={setFeedbackType}
        datas={feedbackTypeTbl.rows}
        setFieldName={'feedbackTypeName'}
        formik={formik}
        touch={formik.touched.feedbackTypeName}
        error={formik.errors.feedbackTypeName}
      />
    ),
    [feedbackType, feedbackTypeTbl, formik.errors.feedbackTypeName]
  )

  const SourceComp = useMemo(
    () => (
      <CustomDropdown
        title='Source'
        value={source}
        setValue={setSource}
        datas={sourceList}
        setFieldName={'source'}
        formik={formik}
        touch={formik.touched.source}
        error={formik.errors.source}
      />
    ),
    [source, formik.errors.source]
  )
  const SalutatoinComp = useMemo(
    () => (
      <CustomDropdown
        title='Salutation'
        value={salutation}
        setValue={setSalutation}
        datas={salutationList}
        setFieldName={'salutation'}
        formik={formik}
        touch={formik.touched.salutation}
        error={formik.errors.salutation}
      />
    ),
    [salutation, formik.errors.salutation]
  )
  const assignLocationHandler = () => {
    const locations: any = []
    editDataFeedback.assignLocations.forEach((loc: any) => {
      locations.push({
        locationId: loc.locationId || null,
        areaId: loc.areaId || null,
        departmentId: loc.departmentId || null,
        locationName: loc.locationName || null,
        areaName: loc.areaName || null,
        departmentName: loc.departmentName || null,
      })
    })
    setLocationDetail(locations)
  }

  useEffect(() => {
    if (editDataFeedback) {
      assignLocationHandler()
      /*  setLocationDetail([
        {
          locationId: editDataFeedback.locationId,
          areaId: editDataFeedback.areaId,
          departmentId: editDataFeedback.departmentId,
          locationName: editDataFeedback.locationName,
          areaName: editDataFeedback.areaName,
          departmentName: editDataFeedback.departmentName,
        },
      ])*/
      setToggle((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    // console.log(`locationDetail Render => ${JSON.stringify(locationDetail)}`)
    // console.log(`formik values => ${JSON.stringify(formik.values)}`)
    // validate feature
    if (locationDetail.length > 0) locationDetailValidate()
  }, [toggle, locationDetail])

  // Action

  const locationDetailValidate = () => {
    const isValid: boolean =
      locationDetail.length > 0 && locationDetail.every((value) => value.locationId! > 0)
    // console.log(`isValid =>${isValid}`)
    setError(!isValid)
    return isValid
  }

  const handleAddClick = () => {
    // console.log(`handleAddClick => ${JSON.stringify(locationDetail)}`)
    // if there is no any selected for location cannot click able
    if (locationDetail.length > 0 && locationDetail[0].locationId === 0) return

    setLocationDetail([
      ...locationDetail,
      {
        locationId: locationDetail.length > 0 ? locationDetail[0].locationId : 0,
        areaId: locationDetail.length > 0 ? locationDetail[0].areaId : 0,
        departmentId: 0,
        address: '',
        locationName: locationDetail.length > 0 ? locationDetail[0].locationName : '',
        areaName: locationDetail.length > 0 ? locationDetail[0].areaName : '',
      },
    ])
    setError(true)
    // console.log(`Current List => ${JSON.stringify(locationDetail)}`)
  }
  const handleRemoveClick = (index: number) => {
    // console.log(`Remove Click => ${index}`)
    // console.log(index)
    // console.log(`Current List =>${JSON.stringify(locationDetail)}`)
    // console.log(`After Remove List =>${JSON.stringify(locationDetail)}`)
    setLocationDetail((locationDetail) => locationDetail.splice(index, 1))
    setToggle((prev) => !prev)
  }
  const updateLocationDetailBackup = (data: any) => {
    // console.log(`updateLocationDetail....${JSON.stringify(data)}`)
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      locationName: data.locationName,
      areaName: data.areaName,
      departmentName: data.departmentName,
      address: '',
    }

    const list = [...locationDetail]

    if (data.index === 0 && data.locationId != locationDetail[0].locationId)
      setLocationDetail([update])
    else {
      list[data.index] = update
      setLocationDetail(list)
    }

    // console.log(`latest Location Detail =>${JSON.stringify(locationDetail)}`)
    // samuel mention that allow to map with all locaiton and allow locationId :0 , departmentId :0
    // locationDetailValidate()
  }
  const updateLocationDetail = (data: any) => {
    // console.log(`updateLocationDetail....${JSON.stringify(data)}`)
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      locationName: data.locationName,
      areaName: data.areaName,
      departmentName: data.departmentName,
      address: '',
    }

    const list = [...locationDetail]

    if (data.index === 0 && data.locationId != locationDetail[0].locationId)
      setLocationDetail([update])
    else {
      list[data.index] = update
      let tempList = list

      // console.log(`current list data => ${JSON.stringify(list)}`)
      if (data.areaId > 0 && data.departmentId == 0) {
        const removeList = list.filter(
          (rec) => rec.locationId == data.locationId && rec.areaId == 0 && rec.departmentId == 0
        )
        // console.log(`remove list => ${JSON.stringify(removeList)}`)
        tempList = list.filter((val) => !removeList.includes(val))
      } else if (data.departmentId > 0) {
        const removeList = list.filter(
          (rec) =>
            rec.locationId == data.locationId && rec.areaId == data.areaId && rec.departmentId == 0
        )
        // console.log(`remove list => ${JSON.stringify(removeList)}`)
        tempList = list.filter((val) => !removeList.includes(val))
      }
      // console.log(`tempList => ${JSON.stringify(tempList)}`)
      setLocationDetail(tempList)
    }

    locationDetailValidate()
  }
  const saveOnClick = () => {
    // console.log('Save On Click ....')
    const isData =
      locationDetail.length > 0 && locationDetail.every((value) => value.departmentId! > 0)
    // console.log(`isData =>${isData}`)
    // console.log(`feedBackType => ${feedbackType}`)
  }
  const handleOnClose = () => {
    // console.log(`handleOnClose.....`)
    dispatch(setActiveFeedBackForm(false))
  }

  // useEffect(() => {
  //   console.log('formik.errors: ', formik.errors)
  // }, [formik.errors])

  return (
    <Dialog onClose={handleOnClose} open={true}>
      <div
        // className="flex w-[600px] mx-auto justify-center  "
        // className='overflow-x-hidden'
      >
        <div className='w-full md:w-[600px] mx-auto h-auto '>
          {/* Modal content */}
          {/* Header */}
          <div className='relative bg-white rounded-lg shadow'>
            <button
              type='button'
              className='absolute top-5 right-5 
               text-gray-400 bg-transparent
               hover:bg-gray-200 hover:text-gray-900 rounded-lg 
               text-sm p-1.5 ml-auto inline-flex items-center
                dark:hover:bg-gray-800 dark:hover:text-white'
              data-modal-toggle='location-modal'
              onClick={() => {
                dispatch(setActiveFeedBackForm(false))
              }}
            >
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
            <div className='py-6 mr-4 px-6 lg:px-8'>
              <span className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
                {editDataFeedback ? 'Update Feedback' : 'Add Feedback'}
              </span>
              {/* Form */}
              <form
                className='space-y-6'
                onSubmit={(e) => {
                  e.preventDefault()
                  formik.handleSubmit()
                  locationDetailValidate()
                }}
              >
                {/* feedback Type */}
                <div className='mt-4'>
                  <label
                    className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900 '
                  >
                    Feedback Type <span className='text-red-700 font-bold'>*</span>
                  </label>
                  {FeedBackComp}
                  {formik.touched.feedbackTypeName && formik.errors.feedbackTypeName && (
                    <div className='text-red-600 text-sm absolute'>
                      <span role='alert'>{formik.errors.feedbackTypeName}</span>
                    </div>
                  )}
                </div>

                {hasSubcategories && (
                  <div
                    className='mt-4'
                    onBlur={() => {
                      formik.setTouched({ ...formik.touched, subCategories: true })
                    }}
                  >
                    <label
                      className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900 '
                    >
                      Root causes/ Aspects <span className='text-red-700 font-bold'>*</span>
                    </label>
                    <CustomMultipleSelect3
                      handleChange={handleSubCategoryChange}
                      placeholderText={'Select Category'}
                      enableAllSelect
                      multiple={true}
                      options={feedbackTypeSubOpt}
                    />
                    {formik.touched.subCategories && formik.errors.subCategories && (
                      <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                        <span role='alert'>{formik.errors.subCategories}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Source */}
                <div>
                  <label
                    className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900 '
                  >
                    Source <span className='text-red-700 font-bold'>*</span>
                  </label>
                  {SourceComp}
                  {formik.touched.source && formik.errors.source && (
                    <div className='text-red-600 text-sm absolute'>
                      <span role='alert'>{formik.errors.source}</span>
                    </div>
                  )}
                </div>

                {/* Date Submitted */}
                <div>
                  <label
                    className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900'
                  >
                    Date Submitted <span className='text-red-700 font-bold'>*</span>
                  </label>
                  <Box className='bg-[#ECF0F3] rounded-lg'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        mask=''
                        inputFormat='DD/MM/YYYY'
                        value={dateSubmitted}
                        onChange={(newValue) => {
                          // console.log(`Submitted Date => ${newValue}`)
                          setDateSubmitted(newValue)
                        }}
                        maxDate={dayjs(moment().format())}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{
                              '& .MuiInputBase-input': {
                                height: '5px',
                              },
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  {formik.touched.submittedDate && formik.errors.submittedDate && (
                    <div className='text-red-600 text-sm'>
                      <span role='alert'>{formik.errors.submittedDate}</span>
                    </div>
                  )}
                </div>

                {/* Salutation */}
                <div>
                  <label
                    className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900 '
                  >
                    Salutation <span className='text-red-700 font-bold'>*</span>
                  </label>
                  {SalutatoinComp}
                  {/* <CustomDropdown
                    key={3}
                    title='Salutation'
                    value={salutation}
                    setValue={setSalutation}
                    datas={Salutation}
                    setFieldName={'salutation'}
                    formik={formik}
                    touch={formik.touched.salutation}
                    error={formik.errors.salutation}
                  /> */}
                  {formik.touched.salutation && formik.errors.salutation && (
                    <div className='text-red-600 text-sm absolute'>
                      <span role='alert'>{formik.errors.salutation}</span>
                    </div>
                  )}
                </div>

                <label
                  className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-900 '
                >
                  Please provide us with details to aid us in looking into your feedback. These
                  details will be used solely for this purpose.
                </label>
                {/* fullName */}
                <div className=' '>
                  <label
                    className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-900 '
                  >
                    Your Name <span className='text-red-700 font-bold'>*</span>
                  </label>
                  <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                    <input
                      type='text'
                      {...formik.getFieldProps('fullName')}
                      id='fullName'
                      placeholder='Please provide your full name'
                      autoComplete='off'
                      className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                    />
                  </div>
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className='text-red-600 text-sm absolute'>
                      <span role='alert'>{formik.errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Contact Number Email */}

                <div className='flex justify-between items-center relative flex-wrap md:flex-nowrap'>
                  {/* Contact Number */}
                  <div className='w-full pb-3 md:pb-0 md:mr-3'>
                    <label
                      className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-900 '
                    >
                      Contact Number
                    </label>
                    <div className='pl-2 bg-[#ECF0F3] rounded'>
                      <input
                        type='text'
                        {...formik.getFieldProps('contactNumber')}
                        id='contactNumber'
                        placeholder='Please provide your number'
                        autoComplete='off'
                        className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm w-[95%]'
                      />
                    </div>
                    {formik.touched.contactNumber && formik.errors.contactNumber && (
                      <div className='text-red-600 text-sm absolute'>
                        <span role='alert'>{formik.errors.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className='w-full'>
                    <label
                      className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-900 '
                    >
                      Email
                    </label>
                    <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                      <input
                        type='email'
                        {...formik.getFieldProps('email')}
                        id='email'
                        placeholder='Please provide your email'
                        autoComplete='off'
                        className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm w-[95%]'
                      />
                      {/* <input
                        type='email'
                        {...formik.getFieldProps('email')}
                        // id='email'
                        placeholder='email'
                        autoComplete='off'
                        className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                      /> */}
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <div className='text-red-600 text-sm absolute'>
                        <span role='alert'>{formik.errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <br />
                {/* Location Details */}
                <div className='flex  '>
                  <label
                    className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-900 '
                  >
                    Location Details <span className='text-red-900 font-bold'>*</span>
                  </label>
                  <div
                    className={clsx(
                      'w-[20px] h-[20px] bg-[#DFF1EB] ml-2',
                      'hover:bg-green-900 hover:text-white hover:text-3xl'
                      // editDataFeedback && 'hidden'
                    )}
                    onClick={() => handleAddClick()}
                  >
                    <IoMdAdd size={20} />
                  </div>
                </div>

                {/* dynamic create */}
                <div>
                  {locationDetail &&
                    locationDetail.map((data, i) => {
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
                          locationEnable={i === 0 ? true : false}
                        />
                        /* <LocationDetailCustom
                          index={i}
                          locationId={data.locationId!}
                          areaId={data.areaId!}
                          departmentId={data.departmentId!}
                          handleRemoveClick={handleRemoveClick} //handleRemoveClick
                          updateLocationDetail={updateLocationDetail}
                          titleHidden={false}
                        />*/
                      )
                    })}
                  {error && (
                    <div className='text-red-600 text-sm'>
                      <span role='alert'>Location details is required</span>
                    </div>
                  )}
                </div>

                {/* Client Patient Recident Name */}
                <div className=' '>
                  <label
                    className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-900 '
                  >
                    Name of Patient/ Resident/Client (and last 4 characters of NRIC)
                    {/* Client's/Patient's/Resident's Name (where applicable) */}
                  </label>
                  <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                    <input
                      type='text'
                      {...formik.getFieldProps('patientName')}
                      id='patientName'
                      placeholder={`Please provide name of patient`}
                      autoComplete='off'
                      className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                    />
                  </div>
                </div>

                {/* FeedBack */}
                <div className=' '>
                  <label
                    className='block mb-2 text-sm 
                                  font-medium text-gray-900 
                                  dark:text-gray-900 '
                  >
                    Feedback
                  </label>
                  <div className='p-3 w-full h-auto bg-[#ECF0F3] rounded-lg'>
                    <textarea
                      // maxLength={FEEDBACK_MAX_CHAR}
                      {...formik.getFieldProps('feedback')}
                      className='w-full h-[200px] bg-transparent
                              focus:outline-none rounded-md text-sm '
                    />
                  </div>
                  {formik.touched.feedback && formik.errors.feedback && (
                    <div className='text-red-600 text-sm absolute mb-2'>
                      <span role='alert'>{formik.errors.feedback}</span>
                    </div>
                  )}
                </div>

                <div className='mt-8'>
                  <p className='text-[10px] text-gray-400'>
                    By clicking Save Changes, you agree to our collection, use and/or disclosure of
                    your personal data to the extent necessary to process your feedback in
                    accordance with the Personal Data Protection Act (PDPA).
                  </p>
                </div>

                {/* Action Button */}
                <br />
                <br />
                <div className='flex justify-end items-center '>
                  <button
                    type='button'
                    className='text-gray-900 hover:text-gray-600 hover:font-bold '
                    onClick={() => {
                      dispatch(setActiveFeedBackForm(false))
                    }}
                  >
                    Discard
                  </button>
                  <button
                    // disabled={
                    //   form?.address && form.locationId && form.areaId && form.departmentId
                    //     ? false
                    //     : true
                    // }
                    type='submit'
                    className='bg-[#2BA579] p-1 text-white rounded-md ml-3 
                     disabled:opacity-50'
                    //  onClick={saveOnClick}
                  >
                    {editDataFeedback ? 'Update Changes' : 'Save Changes'}
                  </button>
                </div>
              </form>
              {/* Action Button */}
              {/* <div className='flex justify-end items-center mt-10'>
                  <button
                    type='button'
                    className='text-gray-900 hover:text-gray-600 hover:font-bold '
                    onClick={() => {
                      dispatch(setActiveFeedBackForm(false))
                    }}
                  >
                    Discard
                  </button>
                  <button
                    // disabled={
                    //   form?.address && form.locationId && form.areaId && form.departmentId
                    //     ? false
                    //     : true
                    // }
                    type='submit'
                    className='bg-[#2BA579] p-1 text-white rounded-md ml-3 
                     disabled:opacity-50'
                     onClick={saveOnClick}
                  >
                    Save Changes
                  </button>
                 </div> */}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default FeedbackFormModal
