export interface FeedbackReplySendForward {
  subject: string
  content: string
  emailTo: string[]
  emailCc: string[]
  emailBc: string[]
  feedbackId: null
  parentId: null
}

export interface FeedbackLabelUpdate {
  ids: string[]
  labels?: string[]
  isArchive?: boolean
  isRead?: boolean
  emailType?: 'Archive'
}
