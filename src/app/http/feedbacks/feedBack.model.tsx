export interface CustomObj {
  id: number
  name: string | null
}
export interface FeedbackFormSchema {
  feedbackTypeName: string
  source: string
  salutation: string
  submittedDate: string
  subCategories: Array<string>
  // firstName: string
  // lastName: string
  fullName: string
  contactNumber: string
  email: string
  locations: Array<FeedbackLocation>
  patientName: string
  feedback: string
}
export interface TagAssignFeedbackFormSchema {
  caseType: string
  locations: Array<FeedbackLocation>
}
export interface FeedbackLocation {
  locationId: number
  areaId: number
  departmentId: number
}

export interface params {
  page: number
  limit: number
  areaId: number | ''
  text: string | ''
  order: SortingType
}
export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}

export interface FeedbackMailBody {
  id: number
  subject: string
  content: any
  type: 'reply' | 'remind'
}
