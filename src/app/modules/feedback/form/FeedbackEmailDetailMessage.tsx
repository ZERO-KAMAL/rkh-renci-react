import { Box, Menu, Stack, Tooltip } from '@mui/material'
import { MODULES } from 'app/constants/module-permission'
import {
  FeedbackLabelUpdate,
  FeedbackReplySendForward,
} from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForward.model'
import {
  createFeedbackReplySendForward,
  setCompose,
  updateMultipleFeedback,
} from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { TiArrowBack, TiArrowSortedDown } from 'react-icons/ti'

import { DeleteFeedbackEmail } from '../../../http/feedback-email/feedBackEmailSlice'
import EmailEditor from '../components/EmailEditor'

const FeedbackEmailDetailMessage = ({ data, showReply, setShowReply, setReload }: any) => {
  const dispatch = useAppDispatch()
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Feedback module permission
  const canInboxReply = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackInboxSendReplyEmailFunc.code)
  )

  const [showMenu, setShowMenu] = useState(false)

  const replyForwardEmail = useCallback(async (data: FeedbackReplySendForward) => {
    dispatch(createFeedbackReplySendForward(data)).then(() => {
      setReload((prev: any) => !prev)
      setShowReply(undefined)
    })
  }, [])

  const handleDelete = async (ids: string[]) => {
    await dispatch(DeleteFeedbackEmail(ids))
  }

  const EditDataComp = useMemo(
    () => (
      <EmailEditor
        editData={
          (showReply
            ? { ...data, content: '', parentId: data.id }
            : { ...data, emailTo: [], emailCc: [], emailBc: [] }) || {}
        }
        reply={showReply}
        forward={false}
        handleTrashClick={() => {
          setShowReply(undefined)
        }}
        onSend={(data: FeedbackReplySendForward) => {
          replyForwardEmail(data)
        }}
      />
    ),
    [showReply, data]
  )

  const handleUnRead = async () => {
    const body: FeedbackLabelUpdate = {
      isRead: false,
      ids: [data?.id],
    }
    await dispatch(updateMultipleFeedback({ body }))
  }
  const handleRead = async () => {
    const body: FeedbackLabelUpdate = {
      isRead: true,
      ids: [data?.id],
    }
    await dispatch(updateMultipleFeedback({ body }))
  }
  const handleArchive = async () => {
    const body: FeedbackLabelUpdate = {
      isArchive: true,
      ids: [data?.id],
    }
    await dispatch(updateMultipleFeedback({ body }))
  }
  return (
    <div className=''>
      <div className='mx-5 flex flex-col'>
        <span className='text-lg font-semibold mt-5'>{data?.subject}</span>
        <div className='p-6 pl-2 flex items-center justify-between flex-wrap'>
          <div>
            <div className='flex items-center'>
              <span className='font-semibold mr-2'>To:</span>
              {
                data?.emailTo?.slice(0, 4).map((item: any, index: any) => {
                  return(
                    <span className='mr-1 text-sm' key={index}>{item?.split('@')[0].substring(0, 20)}{index < 3 && ','}</span>
                  )
                })
              }
              <Tooltip title="View Details">
                <span onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}><TiArrowSortedDown size={20} className=":hover:p-[1px] ml-1 hover:bg-gray-200 rounded cursor-pointer" /></span>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={()=> setAnchorEl(null)}
              >
                <Box className='w-auto h-auto p-5'>
                  <Stack direction="row" alignItems='center'>
                    <span className='font-semibold mr-2'>From:</span>
                    <span className='text-sm'>{data?.emailFrom}</span>
                  </Stack>
                  <Stack direction="row" className='mt-3'>
                    <span className='font-semibold mr-2'>To:</span>
                    <Box className='mt-1'>
                    {
                      data?.emailTo?.map((item: any, index: any) => {
                        return(
                          <p className='text-sm' key={index}>{item}</p>
                        )
                      })
                    }
                    </Box>
                  </Stack>
                </Box>
              </Menu>
            </div>
          </div>
          <div className='text-sm text-[#B5B5C3] flex items-center gap-3'>
            <span>{moment(data?.createdAt).format('MMM DD, YYYY, h:mmA')}</span>
            {canInboxReply && (
              <TiArrowBack
                size={25}
                className='cursor-pointer'
                onClick={() =>
                  setShowReply(
                    showReply && showReply !== data?.id
                      ? data?.id
                      : !showReply
                      ? data?.id
                      : undefined
                  )
                }
              />
            )}

            {/* <TbDotsVertical
              size={20}
              className='cursor-pointer'
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu ? (
              <div
                className={clsx(
                  'w-[200px] h-[auto] bg-white border-2 text-black font-semibold absolute ml-[30px] mt-[280px] z-50 px-2 py-5 flex flex-col gap-4 justify-between'
                )}
                onMouseLeave={() => setShowMenu((prev) => !prev)}
              >
                <div className='cursor-pointer flex gap-2' onClick={()=> setShowReply(false)}>
                  <TiArrowBack size={20} />
                  <span>Reply</span>
                </div>
                <div className='cursor-pointer flex ml-5' onClick={handleUnRead}>
                  <span>Mark as unread</span>
                </div>
              </div>
            ) : null} */}
          </div>
        </div>
        <div className='flex flex-col text-[13px] '>
          <div
            className='mb-5 select-none email_details_body'
            dangerouslySetInnerHTML={{ __html: data?.content }}
          />
        </div>
      </div>
      <div className='flex justify-between items-center mt-[10px] border-b-2 border-gray-100'></div>
      {showReply === data?.id ? EditDataComp : null}
    </div>
  )
}

export default FeedbackEmailDetailMessage
