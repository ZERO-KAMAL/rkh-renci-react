import * as Yup from 'yup'

export interface ReportSummary {
  submittedDateFrom: string
  submittedDateTo: string
  type: string
  // locationIds: [number | undefined]
  // areaIds: number | undefined
  locationIds: string[]
  areaIds: string[]
  exportFormat: string
  formIds: string[]
}

export const initValues: ReportSummary = {
  submittedDateFrom: '',
  submittedDateTo: '',
  type: '',
  locationIds: [],
  areaIds: [],
  exportFormat: '',
  formIds: [],
}

export const reportSummaryValidateSchema = Yup.object().shape({
  submittedDateFrom: Yup.string().required('Start Date is required').nullable(true),
  submittedDateTo: Yup.string().required('End Date is required').nullable(true),
  type: Yup.string().required('Time frame is required').nullable(true),
  // locationIds: Yup.number().required('Location is required').nullable(true),
  // areaIds: Yup.number().required('Area is required').nullable(true),
  locationIds: Yup.array().of(Yup.number()).min(1, 'Location is required').nullable(true),
  areaIds: Yup.array().of(Yup.number()).min(1, 'Area is required').nullable(true),
  exportFormat: Yup.string().required('Format is required').nullable(true),
  formIds: Yup.array().of(Yup.string()).min(1, 'Form is required').nullable(true),
})
