import { Box, Grid } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import CustomMultipleSelect2 from 'app/common/MultipleSelect2'
import CustomDatePicker2 from 'app/common/date-picker2'
import CustomSelect from 'app/common/select'
import ModuleHeader from 'app/components/ModuleHeader'
import {
  DAILY,
  MONTHLY,
  ReportTatTypes,
  ReportTypes,
  TimeFrames,
  WEEKLY,
  YEARLY,
} from 'app/constants/report'
import { fetchAreaByLocationId, fetchAreaReport } from 'app/http/areas/areaSlice'
import {
  fetchDepartmentByAreaId,
  fetchDepartmentReport,
} from 'app/http/departments/departmentSlice'
import FeedbackService from 'app/http/feedbacks/feedBackService'
import { fetchLocationReport } from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import FileSaver from 'file-saver'
import { useFormik } from 'formik'
import JSZip from 'jszip'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { initValuesTAT, reportTatValidateSchema } from './model/ReportTAT.model'
import { LoadingButton } from '@mui/lab'

const ReportTAT = () => {
  // end of day + 1 is done in handleEndDateChange
  const startOfDaily = moment(new Date()).subtract(6, 'days').startOf('day').toDate()
  const endOfDaily = moment(new Date()).toDate()
  const startOfWeekly = moment(new Date()).startOf('month').toDate()
  const endOfWeekly = moment(new Date()).endOf('month').toDate()
  const startOfMonthly = moment(new Date()).startOf('year').toDate()
  const endOfMonthly = moment(new Date()).endOf('year').toDate()
  const startOfYearly = moment(new Date()).startOf('year').subtract(2, 'years').toDate()
  const endOfYearly = moment(new Date()).endOf('year').toDate()

  const [reportType, setReportType] = useState<string>('')
  const [locations, setLocations] = useState<Array<string>>([])
  const [areas, setAreas] = useState<Array<string>>([])
  const [departments, setDepartments] = useState<Array<string>>([])
  const { dataTable: dataTableLocation } = useAppSelector((state) => state.location)
  const { dataTableArea } = useAppSelector((state) => state.area)
  const { dataTableDep } = useAppSelector((state) => state.department)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [categories, setCategories] = useState<Array<string>>([])
  const [reportFormat, setReportFormat] = useState('')
  // initial value we set daily on UI
  const [timeFrame, setTimeFrame] = useState('')
  const [startDate, setStartDate] = useState<Date | ''>('')
  const [endDate, setEndDate] = useState<Date | ''>('')

  const dispatch = useAppDispatch()

  // initial state
  useEffect(() => {
    setLocations([])
    setAreas([])
    setDepartments([])
    setCategories([])
    setReportFormat('')

    setReportType(ReportTatTypes.map((item) => item.reportType)[0])
    setTimeFrame(DAILY)

    setStartDate(startOfDaily)
    setFromDate(moment(startOfDaily).format('DD MMM YYYY'))

    setEndDate(endOfDaily)
    setToDate(` to ${moment(endOfDaily).format('DD MMM YYYY')}`)
  }, [])

  useEffect(() => {
    formik.setFieldValue('submittedDateFrom', moment(startDate).startOf('day').local().format())
  }, [startDate])

  useEffect(() => {
    formik.setFieldValue('submittedDateTo', moment(endDate).local().format())
  }, [endDate])

  useEffect(() => {
    formik.setFieldValue('type', DAILY)
  }, [timeFrame])

  useEffect(() => {
    formik.setFieldValue('feedbackTypeName', reportType)
  }, [reportType])

  useEffect(() => {
    formik.setFieldValue('categories', categories)
  }, [categories])

  useEffect(() => {
    formik.setFieldValue('type', timeFrame)
  }, [timeFrame])

  useEffect(() => {
    formik.setFieldValue('locationIds', locations)
  }, [locations])

  useEffect(() => {
    formik.setFieldValue('areaIds', areas)
  }, [areas])

  useEffect(() => {
    formik.setFieldValue('exportFormat', reportFormat)
  }, [reportFormat])

  const initLocation = useCallback(async () => {
    await dispatch(fetchLocationReport())
  }, [])

  const initArea = useCallback(async () => {
    await dispatch(fetchAreaReport())
  }, [])

  const initDep = useCallback(async () => {
    await dispatch(fetchDepartmentReport())
  }, [])

  const AreaByLocationIds = useCallback(async (ids: any) => {
    await dispatch(fetchAreaByLocationId(ids))
  }, [])

  const DepartmentByAreaIds = useCallback(async (locIds: any, areaIds: any) => {
    await dispatch(fetchDepartmentByAreaId({ locId: locIds, areaId: areaIds, text: '' }))
  }, [])

  // action
  const handleStartDateChange = (value: any) => {
    // console.log(`handleStartDateChange => ${value}`)
    if (value === null) {
      setFromDate('')
    } else {
      setFromDate(moment(value).format('DD MMM YYYY'))
    }
    setStartDate(value)
  }
  const handleEndDateChange = (value: any) => {
    // console.log(`handleEndDateChange => ${value}`)
    if (value === null) {
      setToDate('')
    } else {
      setToDate(` to ${moment(value).format('DD MMM YYYY')}`)
    }
    setEndDate(value)
  }

  useEffect(() => {
    initLocation()
    initArea()
    initDep()
  }, [])

  // action
  const handleReportTypeChange = (e: any, options: any) => {
    setReportType(e.target.value)
    setCategories([])
  }
  const handleLocationChange = (e: any, options: any) => {
    const value = e.target.value
    setAreas([])
    if (value[value.length - 1] === 'ALL') {
      setLocations(locations.length === options.length ? [] : options.map((item: any) => item.id))
      return
    }
    setLocations(typeof value === 'string' ? value.split(',') : value)
  }
  const handleAreaChange = (e: any, options: any) => {
    const value = e.target.value
    if (value[value.length - 1] === 'ALL') {
      setAreas(areas.length === options.length ? [] : options.map((item: any) => item.id))
      return
    }
    setAreas(typeof value === 'string' ? value.split(',') : value)
  }
  const handleDepChange = (e: any, options: any) => {
    const value = e.target.value
    if (value[value.length - 1] === 'ALL') {
      setDepartments(
        departments.length === options.length ? [] : options.map((item: any) => item.id)
      )
      return
    }
    setDepartments(typeof value === 'string' ? value.split(',') : value)
  }

  const handleTimeFrameChange = (e: any) => {
    // console.log('handleTimeFrameChange: ', e.target.value)
    switch (e.target.value) {
      case DAILY:
        // console.log('on Daily')
        setStartDate(startOfDaily)
        setEndDate(endOfDaily)
        setFromDate(moment(startOfDaily).format('DD MMM YYYY'))
        setToDate(` to ${moment(endOfDaily).format('DD MMM YYYY')}`)
        break
      case WEEKLY:
        // console.log('on weekly')
        setStartDate(startOfWeekly)
        setEndDate(endOfWeekly)
        setFromDate(moment(startOfWeekly).format('DD MMM YYYY'))
        setToDate(` to ${moment(endOfWeekly).format('DD MMM YYYY')}`)
        break
      case MONTHLY:
        // console.log('on monthly')
        setStartDate(startOfMonthly)
        setEndDate(endOfMonthly)
        setFromDate(moment(startOfMonthly).format('DD MMM YYYY'))
        setToDate(` to ${moment(endOfMonthly).format('DD MMM YYYY')}`)
        break
      case YEARLY:
        // console.log('on yearly')
        setStartDate(startOfYearly)
        setEndDate(endOfYearly)
        setFromDate(moment(startOfYearly).format('DD MMM YYYY'))
        setToDate(` to ${moment(endOfYearly).format('DD MMM YYYY')}`)
        break
    }
    setTimeFrame(e.target.value)
  }
  const handleCategoriesChange = (value: string) => {
    const tempCategories = categories
    // console.log('handleCategoriesChange: ')
    if (tempCategories.includes(value))
      setCategories(tempCategories.filter((c: any) => c !== value))
    else setCategories([...tempCategories, value])
  }
  const handleReportFormatChange = (e: any) => {
    setReportFormat(e.target.value)
  }

  useEffect(() => {
    // console.log('handleLocationChange: ', locations)
    if (locations.length == 0) {
      initArea()
      initDep()
    } else {
      AreaByLocationIds(locations.toString()).then(() => {
        DepartmentByAreaIds(locations.toString(), '')
      })
    }
  }, [locations])

  useEffect(() => {
    // console.log('handleAreaChange: ', areas)
    if (locations.length == 0 && areas.length == 0) initDep()
    else DepartmentByAreaIds(locations.toString(), areas.toString())
  }, [areas])

  const formik = useFormik({
    initialValues: initValuesTAT,
    enableReinitialize: true,
    validationSchema: reportTatValidateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const fetchRequests: any[] = []
      // console.log('values: ', values)
      try {
        const response = await FeedbackService.getFeedbackTATReportAxios({
          feedbackTypeName: values.feedbackTypeName,
          submittedDateFrom: values.submittedDateFrom,
          submittedDateTo: values.submittedDateTo,
          type: values.type,
          locationIds: values.locationIds.toString(),
          areaIds: values.areaIds.toString(),
          categories: values.categories,
          exportFormat: values.exportFormat,
        })
        // console.log('headers: ', response.data.headers)
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })

        const fileName =
          'TAT_' +
          values.categories?.toString() +
          ' ' +
          moment(values.submittedDateFrom).format('DD-MM-yyyy') +
          ' to ' +
          moment(values.submittedDateTo).format('DD-MM-yyyy') +
          '.xlsx'

        FileSaver.saveAs(blob, fileName)

        toast.success('Success')
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
      }
    },
  })

  return (
    <form noValidate autoComplete='off'>
      <Box className='max-w-[1120px] w-full mx-auto md:pt-10'>
        <ModuleHeader header='Reports' />
        <Box className='flex justify-center md:justify-between items-center bg-white px-6 py-8 rounded-xl flex-wrap'>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, feedbackTypeName: true })
                }}
              >
                <CustomSelect
                  label={'Report Type'}
                  none={'false'}
                  height={'h-10'}
                  options={ReportTatTypes.map((item) => item.reportType)}
                  value={reportType}
                  handleChange={handleReportTypeChange}
                />
                {formik.touched.feedbackTypeName && formik.errors.feedbackTypeName && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.feedbackTypeName}</span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, locationIds: true })
                }}
              >
                <CustomMultipleSelect2
                  value={locations}
                  placeholderText={'By Location'}
                  label='By Location'
                  handleChange={handleLocationChange}
                  enableAllSelect
                  options={dataTableLocation.map(({ id: id, name: label }) => ({
                    id,
                    label,
                  }))}
                />
                {formik.touched.locationIds && formik.errors.locationIds && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.locationIds}</span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, areaIds: true })
                }}
              >
                <CustomMultipleSelect2
                  value={areas}
                  placeholderText={'By Area'}
                  label='By Area'
                  handleChange={handleAreaChange}
                  enableAllSelect
                  options={dataTableArea.map(({ id: id, name: label }) => ({
                    id,
                    label,
                  }))}
                />
                {formik.touched.areaIds && formik.errors.areaIds && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.areaIds}</span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='hidden'>
              <CustomMultipleSelect2
                value={departments}
                placeholderText={'By Department'}
                label='By Department'
                handleChange={handleDepChange}
                enableAllSelect
                options={dataTableDep.map(({ id: id, name: label }) => ({
                  id,
                  label,
                }))}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          className='flex justify-center md:justify-between items-center
         bg-white   rounded-xl py-8 flex-wrap mt-5'
        >
          <Grid container spacing={2} className='px-6'>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div className='flex flex-col text-[#3F4254] font-bold'>
                <span>Report Period</span>
                <span>
                  {fromDate}
                  {toDate}
                </span>
              </div>
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              {/* Time Frames */}
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, type: true })
                }}
              >
                <CustomSelect
                  label={'Group By'}
                  none={'false'}
                  height={'h-10'}
                  options={TimeFrames}
                  value={timeFrame}
                  handleChange={handleTimeFrameChange}
                />
                {formik.touched.type && formik.errors.type && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.type}</span>
                  </div>
                )}
              </div>
            </Grid>
            <div className='pt-1 hidden'></div>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, submittedDateFrom: true })
                }}
              >
                <CustomDatePicker2
                  label='Start Date'
                  handleChange={handleStartDateChange}
                  labelStyles={'pt-1'}
                  date={startDate}
                />
                {formik.touched.submittedDateFrom && formik.errors.submittedDateFrom && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.submittedDateFrom}</span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, submittedDateTo: true })
                }}
              >
                <CustomDatePicker2
                  label='End Date'
                  handleChange={handleEndDateChange}
                  labelStyles={'pt-1'}
                  date={endDate}
                />
                {formik.touched.submittedDateTo && formik.errors.submittedDateTo && (
                  <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                    <span role='alert'>{formik.errors.submittedDateTo}</span>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>

          <div
            className='bg-white h-[250px] w-full mt-10 border-t-2
           border-b-2 border-gray-200  px-6 py-5 flex flex-col'
            onBlur={() => {
              formik.setTouched({ ...formik.touched, categories: true })
            }}
          >
            {ReportTatTypes?.find((item) => item.reportType === reportType)?.category.map(
              (item, ind: any) => {
                return (
                  <div className='flex items-start' key={ind}>
                    <Checkbox
                      inputProps={{ 'aria-label': 'controlled' }}
                      checked={categories.includes(item.backendCode)}
                      onChange={() => {
                        handleCategoriesChange(item.backendCode)
                      }}
                      color='success'
                    />
                    <div className='flex flex-col ml-4 mt-2 font-roboto'>
                      <span className='text-[#3F4254] font-bold'>{item.frontendLabel}</span>
                      <span className='text-[#B5B5C3] text-sm'>{item.frontendSubLabel}</span>
                    </div>
                  </div>
                )
              }
            )}

            {formik.touched.categories && formik.errors.categories && (
              <div className='text-red-600 text-sm align-text-bottom ml-2 mt-2'>
                <span className='py-6' role='alert'>
                  {formik.errors.categories}
                </span>
              </div>
            )}
          </div>
          <div
            className='bg-white h-[50px] w-full mt-7 
               px-6 flex items-center justify-end gap-3'
          >
            {/* Report Format */}
            {/* <span className='text-black font-semibold'>Download Report Format</span>
            <div
              onBlur={() => {
                formik.setTouched({ ...formik.touched, exportFormat: true })
              }}
            >
              <CustomSelect
                none={'false'}
                maxWidth={'w-[150px]'}
                options={ReportFormat}
                value={reportFormat}
                handleChange={handleReportFormatChange}
              />
              {formik.touched.exportFormat && formik.errors.exportFormat && (
                <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                  <span role='alert'>{formik.errors.exportFormat}</span>
                </div>
              )}
            </div> */}

            <LoadingButton
              variant='contained'
              className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579] h-[42px] ml-5 normal-case'
              onClick={(e) => {
                e.preventDefault()
                formik.handleSubmit()
              }}
              loading={formik.isSubmitting}
              loadingPosition='center'
              loadingIndicator={<span className="text-white">Downloading...</span>}
            >
              Download Report
            </LoadingButton>
          </div>
        </Box>
      </Box>
    </form>
  )
}

export default ReportTAT
