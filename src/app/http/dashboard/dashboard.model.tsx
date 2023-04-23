// export interface Feedback {
//   id: number
//   name: string | null
// }
// export interface DepartmentList {
//   count: number
//   rows: Department[]
// }

export interface Feedback {
  submitDateTime: string
  status: string
  count: number
}

export interface FeedbackTypeResponse {
  submitDateTime: string
  data: FeedbackType[]
}

export interface FeedbackType {
  feedbackType: string
  count: number
}

export type FeedbackResponse = {
  count: number
  status: string
  previousCount: number
  data: Feedback[]
}

export interface params {
  status: string
  submittedDateFrom: string
  submittedDateTo: string
  type: string
  locationId: string
  areaId: string
  departmentId: string
}
export interface FeedbackTypeParams {
  feedbackTypeName: string
  submittedDateFrom: string
  submittedDateTo: string
  type: string
  locationId: string
  areaId: string
  departmentId: string
}
export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}
export interface DepartmentFormSchema {
  name: string
  // areaId: number
  locationId: number
}
