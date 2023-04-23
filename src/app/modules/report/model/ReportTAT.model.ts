import * as Yup from 'yup'
import { ReportSummary } from './ReportSummary.model'

export interface ReportTAT extends Partial<ReportSummary>{
  feedbackTypeName: string
  locationIds: string[]
  areaIds: string[]
  categories: string[],
}

export const initValuesTAT: ReportTAT = {
  submittedDateFrom: '',
  submittedDateTo: '',
  type: '',
  locationIds: [],
  areaIds: [],
  exportFormat: 'excel',
  categories: [],
  feedbackTypeName: '',
}

export const reportTatValidateSchema = Yup.object().shape({
  submittedDateFrom: Yup.string().required('Start Date is required').nullable(true),
  submittedDateTo: Yup.string().required('End Date is required').nullable(true),
  type: Yup.string().required('Time frame is required').nullable(true),
  locationIds: Yup.array().of(Yup.number()).min(1, 'Location is required').nullable(true),
  areaIds: Yup.array().of(Yup.number()).min(1, 'Area is required').nullable(true),
  // exportFormat: Yup.string().required('Format is required').nullable(true),
  categories: Yup.array().of(Yup.string()).min(1, 'Category is required').nullable(true),
  feedbackTypeName: Yup.string().required('Report type is required').nullable(true),
})
