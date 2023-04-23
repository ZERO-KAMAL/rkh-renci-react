import Loading from 'app/components/Loading'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useParams } from 'react-router-dom'
import {
  defParamsFeedback,
  fetchFeedbackEmailGroup,
} from '../../../http/feedback-email/feedBackEmailSlice'
import FeedbackEmailDetailMessage from './FeedbackEmailDetailMessage'

const FeedbackEmailDetail = () => {
  const params = useParams()
  const { emailId, feedbackId }: any = params
  const dispatch = useAppDispatch()
  const { groupData, loadingGroupData } = useAppSelector(
    (state) => state.feedbackEmail
  )
  const [showReply, setShowReply] = useState(undefined);

  const [reload, setReload] = useState(false)
  const scrollRef: any = useRef(null)

  useEffect(() => {
    if(emailId && feedbackId) {
      dispatch(fetchFeedbackEmailGroup({...defParamsFeedback, feedbackId}))
    }
  }, [emailId, feedbackId, reload])

  useEffect(()=> {
    if(scrollRef.current && groupData) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight
      });
    }
  }, [groupData])

  return (
    <div className=''>
      {/* header */}
      <div className='flex justify-between items-center h-[70px] border-b-2 border-gray-100'>
        {/* icons */}
        <div className='flex gap-4 items-center ml-5  text-gray-500'>
          <IoIosArrowRoundBack
            size={40}
            className='hover:text-[#2BA579] cursor-pointer'
            onClick={() => {
              useHistory.back()
            }}
          />
          {/* <div className='flex gap-3 items-center mx-3  text-gray-400'>
            <ActionItem onClick={handleUnRead} tooltip='Unread'>
              <img src='/assets/svgs/unread.svg' alt='unread' className=' cursor-pointer w-4' />
            </ActionItem>
            <ActionItem tooltip='Read' onClick={handleRead}>
              <RiMailLine className='cursor-pointer w-4 h-4' />
            </ActionItem>
            <ActionItem onClick={handleArchive} tooltip='Archive'>
              <RiInboxArchiveLine size={20} className='cursor-pointer w-4' />
            </ActionItem>
          </div> */}
        </div>
      </div>
      {
        loadingGroupData && <Loading />
      }
      {
        !loadingGroupData && groupData &&
        <div className='max-h-[75vh] overflow-y-auto' ref={scrollRef}>
          {
            groupData?.map((data: any, index: number)=> {
              return(
                <FeedbackEmailDetailMessage data={data} key={index} showReply={showReply} setShowReply={setShowReply} setReload={setReload} />
              )
            })
          }
        </div>
      }
    </div>
  )
}

export default FeedbackEmailDetail
