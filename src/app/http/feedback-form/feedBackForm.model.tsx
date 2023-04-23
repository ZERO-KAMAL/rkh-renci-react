export interface Form {
  id: number
  location: string | null
  area: string | null
  department: string | null
  dateCreated: string | null
  feedbackFormCode: string | null
}

export interface FormList {
  count: number
  rows: Form[]
}

export interface params {
  page: number
  limit: number
  text?: string | undefined
  locationId?: string | undefined
  areaId?: string | undefined
  departmentId?: string | undefined
  order: SortingType
}
export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}

export enum formCreationStep {
  ASSIGN_LOCATION = 1,
  ASSIGN_RECIPIENT,
  FORM_FIELD,
  PREVIEW,
}

export interface CreateFeedBackFormSchema {
  feedbackId: string
  logo: string
  title: string
  subtitle: string
  mainRecipient: Array<number>
  ccRecipient: Array<number>
  locationId?: number | null
  areaId?: number | null
  userId: number | null
  kpi: boolean
  kpiDay: number
  departmentId?: number | null
  fields: Array<any>
}
