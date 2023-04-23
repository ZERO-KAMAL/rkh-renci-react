import http from '../../helpers/http-common'
import { SortingType } from './feedBackEmailLabel.model'

// Query
const getFeedbackLabelFilter = (page: number, limit: number, text: string, order: SortingType) => {
  const data = {
    url:
      page < 0
        ? `feedbackEmailLabels/${null}/${null}`
        : `feedbackEmailLabels/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
    },
  }
  return http.GET(data)
}

// Mutation
const createFeedbackLable = (body: any) => {
  const data = { url: `feedbackEmailLabels`, body: body }
  return http.POST(data)
}

const updateFeedbackLabel = (id: number, body: any) => {
  const data = { url: `feedbackEmailLabels/${id}`, body: body }
  return http.PUT(data)
}
const deleteAllFeedbackLable = (ids: Array<number>) => {
  const data = { url: `feedbackEmailLabels/deleteMulti`, body: { ids: ids } }
  return http.DELETE(data)
}

const FeedBackEmailLabelService = {
  getFeedbackLabelFilter,
  createFeedbackLable,
  updateFeedbackLabel,
  deleteAllFeedbackLable,
}

export default FeedBackEmailLabelService
