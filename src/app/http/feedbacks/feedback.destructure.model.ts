export interface FeedbackStructList {
  count: number
  rows: FeedbackStruct[]
}

export interface FeedbackStruct {
  // Fields from backend
  id: number
  feedbackTypeName: string
  feedbackCode: string
  feedbackFormCode?: string
  users?: number[]
  submittedDate: string
  shareLocations?: ShareLocation[]
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
  feedbackLocationDetailStatuses: FeedbackLocationDetailStatuse[]
  summary: string
  rootCauses: string
  outCome: string
  processImprovement: string
  delayDueTo: string
  remarks: string
  mpLetter: string
  // assignLocations: AssignLocation[]  // fields removed from backend

  // Extra fields added
  feedbackReceived: string
  feedbackReceivedPicker: string
  tat: string
  tatCount: number
  // Extra fields added
  locationId: number
  locationName: string
  areaId: number
  areaName: string
  departmentId: number
  departmentName: string
  // Extra fields added
  locations: Loc[]
  // Extra fields added
  feedbackType: string
  // Extra fields added
  assignLocations: AssignLocationCus[]
}

export interface AssignLocationCus {
  locationId: number
  locationName: string
  areaId: number
  areaName: string
  departmentId: number
  departmentName: string
}

export interface Loc {
  locationId: any
  areaId: any
  departmentId: any
}

export interface AssignLocation {
  id: number
  location: Location
  area?: Area
  department?: Department
}

export interface Location {
  id: number
  name: string
}

export interface Area {
  id: number
  name: string
}

export interface Department {
  id: number
  name: string
}

export interface ShareLocation {
  id: number
  location: Location2
  area: Area2
  department: Department2
}

export interface Location2 {
  id: number
  name: string
}

export interface Area2 {
  id: number
  name: string
}

export interface Department2 {
  id: number
  name: string
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
  location: Location3
  area?: Area3
  department?: Department3
}

export interface Location3 {
  id: number
  name: string
  address: string
}

export interface Area3 {
  id: number
  name: string
}

export interface Department3 {
  id: number
  name: string
}

export interface FeedbackLocationDetailStatuse {
  status: string
  createdAt: string
  locationDetailId: number
}
