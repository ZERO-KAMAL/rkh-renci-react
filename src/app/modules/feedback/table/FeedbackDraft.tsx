import {
  FeedBackEmailReplySendForwardState,
  setCompose,
  setComposeData,
} from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { useAppDispatch } from 'app/redux/store'

import EmailTemplate from './EmailTemplate'

const FeedbackDraft = () => {
  const dispatch = useAppDispatch()
  const onDraftRowClick = (emailData: FeedBackEmailReplySendForwardState) => {
    dispatch(setComposeData(emailData))
    dispatch(setCompose(true))
  }
  return <EmailTemplate type='Draft' isNavigate={false} onRowClick={onDraftRowClick} />
}

export default FeedbackDraft
