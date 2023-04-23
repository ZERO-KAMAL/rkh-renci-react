import { LoadingButton } from "@mui/lab"
import { Box, Checkbox, Grid } from "@mui/material"
import CustomDatePicker2 from "app/common/date-picker2"
import CustomSelect from "app/common/select"
import { ReportFormat } from "app/constants/report"
import FeedbackService from "app/http/feedbacks/feedBackService"
import FileSaver from "file-saver"
import { useFormik } from "formik"
import moment from "moment"
import { useState } from "react"
import { toast } from "react-toastify"
import {reportLogsValidateSchema } from "./model/ReportLogs.model"


const startOfMonth = moment().startOf('month').local().format()
const toDay = moment().local().format()

export const initValues = {
  submittedDateFrom: startOfMonth,
  submittedDateTo: toDay
}


const ReportLogs = () => {

  const formik = useFormik({
    initialValues: initValues,
    enableReinitialize: true,
    validationSchema: reportLogsValidateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // console.log('on submit: ', values)

      try {
        const response = await FeedbackService.getFeedbackLogsReportAxios({
          submittedDateFrom: moment(values.submittedDateFrom).startOf('day').local().format(),
          submittedDateTo: moment(values.submittedDateTo).endOf('day').local().format()
        })

        console.log('res: ', response)
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })

        FileSaver.saveAs(
          blob,
          moment(values.submittedDateFrom).format('DD-MM-yyyy') +
          ' to ' + 
          moment(values.submittedDateTo).format('DD-MM-yyyy') +
          '.xlsx'
        )
        toast.success('Success')
        // pdfMake.createPdf(docDefinition).open({}, win);
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })

  const handleStartDateChange = (value: any) => {
    formik.setFieldValue('submittedDateFrom', value)
  }
  const handleEndDateChange = (value: any) => {
    formik.setFieldValue('submittedDateTo', value)
  }

  return (
    <Box
      className='flex justify-center md:justify-between items-center
      bg-white rounded-xl py-8 flex-wrap mt-5 max-w-[1120px] w-full mx-auto'
    >
      {/* header section */}
      <Grid container spacing={2} className='px-6'>
        <Grid item sm={12} md={6} lg={4} className='w-full'>
          <div className='flex flex-col text-[#3F4254] font-bold'>
            <span>Report Period</span>
            <span>
              {moment(formik.values['submittedDateFrom']).format('DD MMM YYYY')}
              {" to "}
              {moment(formik.values['submittedDateTo']).format('DD MMM YYYY')}
            </span>
          </div>
        </Grid>
        <Grid item sm={12} md={6} lg={4} className='w-full'>
          <div
          >
            <CustomDatePicker2
              label='Start Date'
              handleChange={handleStartDateChange}
              labelStyles={'pt-1'}
              date={formik.values['submittedDateFrom']}
            />
            {(formik.errors['submittedDateFrom'] && formik.touched['submittedDateFrom']) && (
              <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                <span role='alert'>{formik.errors['submittedDateFrom'] as string}</span>
              </div>
            )}
          </div>
        </Grid>
        <Grid item sm={12} md={6} lg={4} className='w-full'>
          <div
              onBlur={() => {
                formik.setTouched({ ...formik.touched, submittedDateTo: true })
              }}
            >
              <CustomDatePicker2
                label='End Date'
                handleChange={handleEndDateChange}
                labelStyles={'pt-1'}
                date={formik.values['submittedDateTo']}
              />
              {(formik.errors['submittedDateTo'] && formik.touched['submittedDateTo']) && (
                <div className='text-red-600 text-sm align-text-bottom absolute ml-2'>
                  <span role='alert'>{formik.errors['submittedDateTo'] as string}</span>
                </div>
              )}
            </div>
        </Grid>
      </Grid>

      {/* table section */}
      <div
        className='bg-white h-[200px] md:h-[250px] w-full mt-10 border-t-2
        border-b-2 border-gray-200  px-6 py-5 flex flex-col'
      >
        <div className='flex items-start'>
          <Checkbox
            inputProps={{ 'aria-label': 'controlled' }}
            checked={true}
            color='success'
          />
          <div className='flex flex-col ml-4 mt-2 font-roboto'>
            <span className='text-[#3F4254] font-bold'>Feedback logs report</span>
          </div>
        </div>
      </div>

      <div
        className='bg-white h-full w-full mt-5 
            px-6 flex items-center justify-start md:justify-end gap-3 flex-wrap'
      >
        <span className='text-black font-semibold'>
          Download Report Format
        </span>

        <div>
          <CustomSelect
            none={'false'}
            maxWidth={'w-[150px]'}
            options={ReportFormat}
            value={ReportFormat[0]}
            handleChange={() => null}
          />
        </div>

        <LoadingButton
          variant='contained'
          className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579]normal-case h-[42px] ml-2 normal-case'
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
  )
}

export default ReportLogs