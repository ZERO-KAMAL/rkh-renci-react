import * as Yup from 'yup'

export const reportLogsValidateSchema = Yup.object().shape({
  submittedDateFrom: Yup.string().required('Start Date is required').nullable(true),
  submittedDateTo: Yup.string().required('End Date is required').nullable(true)
})