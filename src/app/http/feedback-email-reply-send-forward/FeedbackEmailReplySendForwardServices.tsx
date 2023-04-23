import http from '../../helpers/http-common'
import {
  FeedbackLabelUpdate,
  FeedbackReplySendForward,
} from './FeedbackEmailReplySendForward.model'

// Mutation
const createFeedbackReplySendForward = (body: FeedbackReplySendForward) => {
  const data = { url: `feedbackEmails/send`, body: body }
  return http.POST(data)
}

const createFeedbackDraft = (body: FeedbackReplySendForward) => {
  const data = { url: `feedbackEmails`, body: body }
  return http.POST(data)
}

const updateFeedbackLabel = (body: FeedbackLabelUpdate) => {
  const data = { url: `feedbackEmails/setLabels`, body: body }
  return http.POST(data)
}

const updateMultipleFeedback = (body: FeedbackLabelUpdate) => {
  const data = { url: `feedbackEmails/updateMulti`, body: body }
  return http.POST(data)
}

const FeedBackEmailReplySendForwardService = {
  createFeedbackReplySendForward,
  updateFeedbackLabel,
  updateMultipleFeedback,
  createFeedbackDraft,
}

export default FeedBackEmailReplySendForwardService
