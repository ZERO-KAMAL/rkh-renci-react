export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}

export interface FeedbackEmailFormSchema {
  subject: string
  content: string
  emailTo: Array<string>
  emailCc: Array<string> | []
  emailBc: Array<string> | []
  feedbackId: string | null
  parentId: string | null
  forwarderId: string | null
}

export interface params {
  isRead: boolean | undefined
  isStarred: boolean | undefined
  isArchive: boolean | undefined
  subject: string
  emailType: string
  createdAtFrom: string | undefined
  createdAtTo: string | undefined
  page: number
  labelId?: number
  feedbackId?: number
}
