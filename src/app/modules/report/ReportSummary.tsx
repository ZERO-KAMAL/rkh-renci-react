import { Box, Checkbox, Grid } from '@mui/material'
import CustomMultipleSelect2 from 'app/common/MultipleSelect2'
import CustomDatePicker2 from 'app/common/date-picker2'
import CustomSelect from 'app/common/select'
import ModuleHeader from 'app/components/ModuleHeader'
import {
  DAILY,
  MONTHLY,
  ReportFormat,
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
import { ErrorMessage, useFormik } from 'formik'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// import pdfMake from 'pdfMake'
import { initValues, reportSummaryValidateSchema } from './model/ReportSummary.model'
import { LoadingButton } from '@mui/lab'
import FormsTable from '../forms/components/FormsTable'
import { defParamsForm, fetchFeedbackForm, setOrder } from 'app/http/feedback-form/feedBackFormSlice'

const ReportSummary = () => {
  const startOfDaily = moment(new Date()).subtract(6, 'days').startOf('day').toDate()
  const endOfDaily = moment(new Date()).toDate()
  const startOfWeekly = moment(new Date()).startOf('month').toDate()
  const endOfWeekly = moment(new Date()).endOf('month').toDate()
  const startOfMonthly = moment(new Date()).startOf('year').toDate()
  const endOfMonthly = moment(new Date()).endOf('year').toDate()
  const startOfYearly = moment(new Date()).startOf('year').subtract(2, 'years').toDate()
  const endOfYearly = moment(new Date()).endOf('year').toDate()

  // const [categories, setCategories] = useState<Array<string>>([])
  // const [location, setLocation] = useState<string>('')
  // const [area, setArea] = useState<string>('')
  const [locations, setLocations] = useState<Array<string>>([])
  const [areas, setAreas] = useState<Array<string>>([])
  const [departments, setDepartments] = useState<Array<string>>([])
  const { dataTable: dataTableLocation } = useAppSelector((state) => state.location)
  const { dataTableArea } = useAppSelector((state) => state.area)
  const { dataTableDep } = useAppSelector((state) => state.department)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reportFormat, setReportFormat] = useState('')

  // initial value we set daily on UI
  const [timeFrame, setTimeFrame] = useState('')
  const [startDate, setStartDate] = useState<Date | ''>('')
  const [endDate, setEndDate] = useState<Date | ''>('')

  const dispatch = useAppDispatch()

  const { order, page, limit, selected: selectedFormIds } = useAppSelector((state) => state.feedbackForm)

  useEffect(() => {
    dispatch(fetchFeedbackForm(defParamsForm))
    dispatch(
      fetchFeedbackForm({
        ...defParamsForm,
        page,
        limit,
        order
      }) as any
    )
  }, [order, page, limit])

  // initial state
  useEffect(() => {
    // setLocation(dataTableLocation.map((item) => item.name)[0] || '')
    // setArea(dataTableArea.map((item) => item.name)[0] || '')
    setLocations([])
    setAreas([])
    // setCategories([])
    setReportFormat('')

    setTimeFrame(DAILY)
    formik.setFieldValue('type', DAILY)

    setStartDate(startOfDaily)
    setFromDate(moment(startOfDaily).format('DD MMM YYYY'))

    setEndDate(endOfDaily)
    setToDate(` to ${moment(endOfDaily).format('DD MMM YYYY')}`)

    // handleCategoriesChange('Summary feedback report')
    setReportFormat(ReportFormat[0])
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

  // useEffect(() => {
  //   formik.setFieldValue('categories', categories)
  // }, [categories])

  useEffect(() => {
    formik.setFieldValue('type', timeFrame)
  }, [timeFrame])

  // useEffect(() => {
  //   const locationId = dataTableLocation.find((item) => item.name === location)?.id
  //   formik.setFieldValue('locationId', locationId)
  // }, [location])

  // useEffect(() => {
  //   const areaId = dataTableArea.find((item) => item.name === area)?.id
  //   formik.setFieldValue('areaId', areaId)
  // }, [area])

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
    // initArea()
    // initDep()
  }, [])

  // action
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

  // const handleLocationChange = (e: any) => {
  //   // console.log('handleLocationChange: ', e.target.value)
  //   setLocation(e.target.value)
  //   setArea('')
  // }

  // const handleAreaChange = (e: any) => {
  //   // console.log('handleAreaChange: ', e.target.value)
  //   setArea(e.target.value)
  // }
  
  // useEffect(() => {
  //   // console.log('handleLocationChange: ', locations)
  //   if (!location) return

  //   const locationId = dataTableLocation.find((item) => item.name === location)?.id
  //   AreaByLocationIds(locationId?.toString() || '')
  // }, [location])

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

  // useEffect(() => {
  //   if (!location && area) initDep()
  //   else DepartmentByAreaIds(location.toString(), area.toString())
  // }, [area])

  // useEffect(() => {
  //   console.log('handleDepartmentChange: ', departments)
  // }, [departments])

  useEffect(() => {
    console.log('selectedFormIds: ', selectedFormIds)
    formik.setFieldValue('formIds', selectedFormIds.map(item => item.feedbackFormCode))
  }, [selectedFormIds])

  // const handleCategoriesChange = (value: string) => {
  //   if (categories.includes(value)) {
  //     setCategories((oldCategories) => oldCategories.filter((c: any) => c !== value))
  //   } else {
  //     setCategories((oldCategories) => [...oldCategories, value])
  //   }
  // }

  const handleReportFormatChange = (e: any) => {
    setReportFormat(e.target.value)
  }

  const formik = useFormik({
    initialValues: initValues,
    enableReinitialize: true,
    validationSchema: reportSummaryValidateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('on submit: ', values)

      try {
        const response = await FeedbackService.getFeedbackSummaryReportAxios({
          submittedDateFrom: values.submittedDateFrom,
          submittedDateTo: values.submittedDateTo,
          type: values.type,
          locationIds: values?.locationIds?.toString(),
          areaIds: values?.areaIds?.toString(),
          exportFormat: values.exportFormat,
          formIds: values.formIds,
        })

        // console.log('res: ', response)
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })

        FileSaver.saveAs(
          blob,
            'Feedback Summary ' +
            moment(values.submittedDateFrom).format('DD-MM-yyyy') +
            ' to ' +
            moment(values.submittedDateTo).format('DD-MM-yyyy') +
            '.xlsx'
        )
        // toast.success('Success')
        // pdfMake.createPdf(docDefinition).open({}, win);
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })

  // useEffect(() => {
  //   console.log('dataTableArea: ', dataTableArea)
  // }, [dataTableArea])

  return (
    <form noValidate autoComplete='off'>
      <Box className='max-w-[1120px] w-full mx-auto md:pt-10'>
        <ModuleHeader header='Reports' />
        <Box className='flex justify-center md:justify-between items-center bg-white px-6 py-8 rounded-xl flex-wrap'>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, locationIds: true })
                }}
              >
                {/* <CustomSelect
                  label={'By Location'}
                  none={'false'}
                  height={'h-10'}
                  value={location}
                  options={dataTableLocation.map((item) => item.name)}
                  handleChange={handleLocationChange}
                /> */}
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
                {/* <CustomSelect
                  label={'By Area'}
                  none={'false'}
                  height={'h-10'}
                  value={area}
                  options={dataTableArea.map((item) => item.name)}
                  handleChange={handleAreaChange}
                /> */}
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
          </Grid>
        </Box>
        <Box
          className='flex justify-center md:justify-between items-center
         bg-white   rounded-xl py-8 flex-wrap mt-5'
        >
          {/* header section */}
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
              <div
                onBlur={() => {
                  formik.setTouched({ ...formik.touched, type: true })
                }}
              >
                <CustomSelect
                  label={'Group By'}
                  none={'false'}
                  height={'h-10'}
                  value={timeFrame}
                  options={TimeFrames}
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

          {/* table section */}
          <div
            className='bg-white w-full mt-10 border-t-2
           border-b-2 border-gray-200 flex flex-col'
            onBlur={() => {
              formik.setTouched({ ...formik.touched, formIds: true })
            }}
          >
            <div className='flex items-start'>
              <FormsTable
                readOnly={true}
                sortDir={order.sortDir}
                setSortOrder={(val) => dispatch(setOrder(val))}
                sortBy={order.sortBy}
              />
              {/* <Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                checked={categories.includes('Summary feedback report')}
                onChange={() => {
                  handleCategoriesChange('Summary feedback report')
                }}
                color='success'
              /> */}
              {/* <div className='flex flex-col ml-4 mt-2 font-roboto'>
                <span className='text-[#3F4254] font-bold'>Summary feedback report</span>
              </div> */}
            </div>
            {formik.touched.formIds && formik.errors.formIds && (
              <div className='text-red-600 text-sm align-text-bottom ml-2'>
                <span role='alert'>{formik.errors.formIds}</span>
              </div>
            )}
          </div>

          {/* footer section */}
          <div
            className='bg-white h-full w-full mt-5 
               px-6 flex items-center justify-start md:justify-end gap-3 flex-wrap'
          >
            <span className='text-black font-semibold'>
              Download Report Format
              <span className='text-red-700 font-bold'> *</span>
            </span>

            {/* Report Format */}
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
            </div>
            <LoadingButton
              variant='contained'
              className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579] h-[42px] ml-2 normal-case'
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

export default ReportSummary
