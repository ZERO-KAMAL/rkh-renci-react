import { Button, Dialog } from '@mui/material'
import { createFeedbackReplySendForward } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { fetchFeedbackById, sendFeedbackAlert } from 'app/http/feedbacks/feedBackSlice'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { number } from 'yup'

const ReplyModal = ({ open, handleClose, feedbackId }: any) => {
  const [text, setText] = useState('')

  const dispatch = useDispatch()

  const replyHandler = () => {
    dispatch(
      sendFeedbackAlert({
        id: feedbackId,
        subject: 'In Reply to Feedback',
        content: text,
        type: 'reply',
      }) as any
    ).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Reply Sent', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else if (response.meta.requestStatus === 'rejected') {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    })
    handleClose()
  }

  // console.log(feedbackId)

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '680px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='w-[680px] max-md:w-auto bg-white rounded box-border max-h-[calc(100vh-144px)]'>
        <div className='px-[40px] max-md:px-6 pt-[30px] pb-[15px] flex justify-between items-center border-b-2 box-border'>
          <p className='tex-md font-semibold '>Reply to Feedback</p>
          <IoClose size={'25px'} color={'rgba(0, 0, 0, 0.54)'} onClick={handleClose} />
        </div>
        <div className='px-10 py-5'>
          <textarea
            className='w-full h-[250px] outline-none bg-gray-100 rounded p-4'
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div className='flex justify-end px-10 py-5 border-t-2'>
          <Button
            variant='contained'
            className='bg-[#4AB58E] hover:bg-[#4AB58E] focus:bg-[#4AB58E] normal-case'
            onClick={replyHandler}
          >
            Send
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ReplyModal
