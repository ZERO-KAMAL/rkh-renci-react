export interface FeedbackTypesList {
  count: number
  rows: FeedbackTypes[]
}

export interface FeedbackTypes {
  name: string
  TAT: number
  isActive: boolean
  subCategories?: string[]
}

export interface EditFeedbackTypes extends FeedbackTypes {
  editSubCategory: string
}

export interface Params {
  page: number
  limit: number
  sortDir: 'asc' | 'desc'
  sortBy: keyof Partial<FeedbackTypes>
  text?: string
  name?: string
  setLoading?: boolean
}
