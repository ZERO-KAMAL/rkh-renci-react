import http from 'app/helpers/http-common'

import { FeedbackTypes } from './feedbacktypes.model'

const getFeedbackTypesByFilter = (
  page: number,
  limit: number,
  sortBy: keyof Partial<FeedbackTypes>,
  sortDir: 'asc' | 'desc',
  text?: string,
  name?: string
) => {
  const data = {
    url: `feedbackTypes/${page}/${limit}/${sortBy}/${sortDir}`,
    params: {
      text,
      name,
    },
  }
  return http.GET(data)
}

const getFeedbackTypesById = (name: string) => {
  const data = {
    url: `feedbackTypes/${name}`,
  }
  return http.GET(data)
}

const createFeedbackType = (feedback: FeedbackTypes) => {
  const data = { url: `feedbackTypes`, body: { ...feedback } }
  return http.POST(data)
}

const updateFeedbackType = (feedback: FeedbackTypes) => {
  const data = { url: `feedbackTypes/`, body: { ...feedback } }
  return http.PUT(data)
}

const deleteMultiFeedbackTypes = (feedbackNames: string[]) => {
  const data = { url: `feedbackTypes/deleteMulti`, body: { name: feedbackNames } }
  return http.DELETE(data)
}

const FeedbackTypeService = {
  getFeedbackTypesByFilter,
  getFeedbackTypesById,
  createFeedbackType,
  updateFeedbackType,
  deleteMultiFeedbackTypes,
}
export default FeedbackTypeService
