// Original feedback from API without destructure

export interface FeedbackList {
  count: number
  rows: Feedback[]
}

export interface Feedback {
  id: number
  feedbackTypeName: string
  feedbackCode: string
  feedbackFormCode?: string
  users?: number[]
  submittedDate: string
  assignLocations: number[]
  shareLocations?: number[]
  source: string
  salutation: string
  caseType: string
  patientName: string
  feedback: string
  TAT: number
  fullName: string
  point?: number
  contactNumber: string
  email: string
  status: string
  isArchived: boolean
  closedDateTime?: string
  ackDateTime?: string
  dynamicValues?: DynamicValue[]
  configManualAlert?: boolean
  assignedByQSMId?: number
  overTAT: boolean
  subCategories?: string[]
  locationDetailId: number
  locationDetail: LocationDetail
}

export interface DynamicValue {
  key: string
  value: any
  fieldName?: string
}

export interface LocationDetail {
  id: number
  createdAt: string
  updatedAt: string
  locationId: number
  areaId?: number
  departmentId?: number
  location: Location
  area?: Area
  department?: Department
}

export interface Location {
  id: number
  name: string
  address: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Area {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: any
  locationId: any
}

export interface Department {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: any
  locationId: any
}
