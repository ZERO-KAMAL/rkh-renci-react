import { FeedbackReplySendForward } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForward.model'
import {
  createFeedbackReplySendForward,
  setCompose,
} from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import { useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import {
  fetchFeedbackLable,
  setStateClear,
} from '../../http/feedback-email-lable/feedBackEmailLableSlice'
import EmailEditor from './components/EmailEditor'
import FeedbackEmailSidebar from './components/FeedbackEmailSidebar'
import FeedbackLabelFormModal from './form/FeedbackLabelFormModal'

const FeedbackInbox = () => {
  const dispatch = useAppDispatch()
  const { activeLabelForm } = useAppSelector((state) => state.feedbackEmailLabel)
  const { showCompose, subject, content, emailTo, emailCc, emailBc, feedbackId, parentId } =
    useAppSelector((state) => state.feedbackSendAndReply)
  useEffect(() => {
    dispatch(setStateClear())
    initFetch()
  }, [])
  const replyForwardEmail = useCallback(async (data: FeedbackReplySendForward) => {
    await dispatch(createFeedbackReplySendForward(data))
  }, [])
  const initFetch = useCallback(async () => {
    await dispatch(fetchFeedbackLable())
  }, [])

  return (
    <div
      className={clsx('max-w-full mx-auto lg:grid grid-cols-12 mt-10 rounded-lg bg-white h-[95%]')}
    >
      {/* Left Menu */}
      <div className='col-span-2'>
        <FeedbackEmailSidebar />
      </div>
      {/* Table Wrapper */}
      <div className={clsx('bg-white col-span-10 rounded-r-lg relative')}>
        <Outlet />
        {showCompose && (
          <EmailEditor
            handleTrashClick={() => {
              dispatch(setCompose(false))
            }}
            editData={{
              subject,
              content,
              emailTo,
              emailCc,
              emailBc,
              feedbackId,
              parentId,
            }}
            containerClass='!p-0 absolute bottom-0 m-2'
            onSend={(data: FeedbackReplySendForward) => {
              replyForwardEmail(data)
            }}
          />
        )}
      </div>
      {/* Feedback Email Label */}
      {activeLabelForm && <FeedbackLabelFormModal />}
    </div>
  )
}

export default FeedbackInbox
