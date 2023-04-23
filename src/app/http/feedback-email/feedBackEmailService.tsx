import http from '../../helpers/http-common'
import { SortingType } from './feedBackEmail.model'

// Query
const getFeedbackInboxFilter = (
  page: number,
  limit: number,
  order: SortingType,
  text = '',
  subject = '',
  content = '',
  emailType = '',
  isRead: boolean | undefined,
  isStarred: boolean | undefined,
  createdAtFrom = '',
  createdAtTo = '',
  labelId: number | undefined,
  isArchive: boolean | undefined,
  feedbackId: number | undefined
) => {
  const data = {
    url:
      page < 0
        ? `feedbackEmails/${null}/${null}`
        : `feedbackEmails/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
      subject: subject,
      content: content,
      emailType: emailType,
      isRead: isRead,
      isStarred: isStarred,
      createdAtFrom: createdAtFrom,
      createdAtTo: createdAtTo,
      labelId,
      isArchive,
      feedbackId
    },
  }
  return http.GET(data)
}
// Mutation
const createFeedbackEmail = (body: any) => {
  const data = { url: `feedbackEmail`, body: body }
  return http.POST(data)
}

const updateFeedbackEmail = (id: number, body: any) => {
  const data = { url: `feedbackEmail/${id}`, body: body }
  return http.PUT(data)
}
const deleteAllFeedbackEmail = (ids: Array<number | string>) => {
  const data = { url: `feedbackEmails/deleteMulti`, body: { ids: ids } }
  return http.DELETE(data)
}

const getFeedbackType = () => {
  const data = { url: `feedbackEmails/groupEmailType` }
  return http.GET(data)
}

const getFeedbackById = (feedbackId: string) => {
  const data = { url: `feedbackEmails/${feedbackId}` }
  return http.GET(data)
}

const FeedBackEmailService = {
  getFeedbackInboxFilter,
  createFeedbackEmail,
  updateFeedbackEmail,
  deleteAllFeedbackEmail,
  getFeedbackType,
  getFeedbackById,
}
export default FeedBackEmailService
