import { setCompose } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { getFeedbackType, setPage } from 'app/http/feedback-email/feedBackEmailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { BiMenu, BiX } from 'react-icons/bi'
import { BsPlusLg, BsStarHalf } from 'react-icons/bs'
import { FaInbox } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { IoSendSharp } from 'react-icons/io5'
import { MdDrafts, MdLabel } from 'react-icons/md'
import { RiDeleteBin7Fill, RiInboxArchiveLine } from 'react-icons/ri'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import NAVIGATE_LINKS from '../../../constants/router-links'
import {
  setActiveLableForm,
  setEditData,
} from '../../../http/feedback-email-lable/feedBackEmailLableSlice'

const emailTypeList = [
  {
    emailType: 'Inbox',
    icon: <FaInbox size={20} />,
    path: NAVIGATE_LINKS.FEEDBACK.INBOX_EMAIL,
    count: 3,
    index: 0,
  },
  // {
  //   emailType: 'Starred',
  //   icon: <BsStarHalf size={20} />,
  //   path: NAVIGATE_LINKS.FEEDBACK.STARRED_EMAIL,
  //   count: 0,
  //   index: 1,
  // },
  // {
  //   emailType: 'Draft',
  //   icon: <MdDrafts size={20} />,
  //   path: NAVIGATE_LINKS.FEEDBACK.DRAFT,
  //   count: 3,
  //   index: 2,
  // },
  {
    emailType: 'Sent',
    icon: <IoSendSharp size={20} />,
    path: NAVIGATE_LINKS.FEEDBACK.SENT_EMAIL,
    count: 0,
    index: 1,
  },
  // {
  //   emailType: 'Junk',
  //   icon: <RiDeleteBin7Fill size={20} />,
  //   path: NAVIGATE_LINKS.FEEDBACK.JUNK,
  //   count: 0,
  //   index: 4,
  // },
  {
    emailType: 'Archive',
    icon: <RiInboxArchiveLine size={20} />,
    path: NAVIGATE_LINKS.FEEDBACK.ARCHIVE_EMAIL,
    count: 0,
    index: 2,
  },
]

const FeedbackEmailSidebar = () => {
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const { labelId } = useParams()
  const [open, setOpen] = useState(false)
  const { emailTypeCounts } = useAppSelector((state) => state.feedbackEmail)
  const { dataTable: dataTableLabel } = useAppSelector((state) => state.feedbackEmailLabel)
  const [active, setActive] = useState<number | undefined>(
    emailTypeList.find((i) => i.path === pathname)?.index
  )
  const navigate = useNavigate()
  // action
  const handleActive = (data: any) => {
    setActive(data.index)
    navigate(data.path)
    dispatch(setPage(0))
  }
  useEffect(() => {
    dispatch(getFeedbackType({}))
  }, [])
  const getEmailTypeCount = (data: any) => {
    return (
      emailTypeCounts && emailTypeCounts.find((email) => email.emailType === data.emailType)?.count
    )
  }
  const SideBarLayout = () => {
    return (
      <>
        {emailTypeList.map((data: any, index: number) => (
          <div
            className={clsx(
              'flex items-center justify-between w-full px-3 h-[50px]  mb-2 cursor-pointer',
              index === active && 'bg-[#F3F6F9]  text-[#2BA579] rounded-md'
            )}
            onClick={() => {
              handleActive(data)
            }}
            key={index}
          >
            <div className='flex text-sm' key={index}>
              <div className={clsx('text-gray-400', index === active && ' text-[#2BA579]')}>
                {data.icon}
              </div>

              <span className='ml-5  select-none font-bold'> {data.emailType}</span>
            </div>

            {getEmailTypeCount(data) ? (
              <span
                className={clsx(
                  'rounded-md h-5 w-5 text-xs flex justify-center items-center',
                  index === active ? ' bg-[#D7F9EF]' : ' bg-[#FFF4DE] text-[#FFA800]',
                  data.count === 0 && 'hidden'
                )}
              >
                {getEmailTypeCount(data)}
              </span>
            ) : null}
          </div>
        ))}

        <div
          className={clsx(
            'flex items-center justify-between w-full px-3 h-[50px]  mb-2',
            99 === active && 'bg-[#F3F6F9]  text-[#2BA579] rounded-md'
          )}
        >
          <div
            className='flex text-gray-400 cursor-pointer text-sm'
            onClick={() => {
              dispatch(setEditData(null))
              dispatch(setActiveLableForm(true))
            }}
          >
            <BsPlusLg size={20} />
            <span className='ml-5 select-none text-black font-bold '>Labels</span>
          </div>
          <div
            className='text-sm text-gray-400 cursor-pointer'
            onClick={() => {
              // redirect to label setting
              setActive(99)
              navigate(NAVIGATE_LINKS.FEEDBACK.LABEL_SETTING)
            }}
          >
            <FiSettings size={20} />
          </div>
        </div>
        {/* Dynamic Lable */}
        {dataTableLabel &&
          dataTableLabel?.map((data: any, index: number) => (
            <Link
              to={`/feedback/inbox/label/${data.id}`}
              className='flex items-center justify-between w-full px-3 h-[50px]  mb-2'
              key={index}
            >
              <div
                className={`flex ${
                  labelId == data.id ? 'text-black' : 'text-gray-400'
                } cursor-pointer text-sm`}
              >
                <MdLabel size={20} />
                <span
                  className={`ml-5 select-none ${
                    labelId == data.id ? 'text-black' : 'text-gray-400'
                  } font-bold`}
                >
                  {data.name}
                </span>
              </div>
            </Link>
          ))}
      </>
    )
  }
  return (
    <div
      className={clsx(
        ' bg-white border-r-[#EEEFF3] border-r-[1px] justify-start flex flex-col items-start px-3 rounded-l-lg h-full'
      )}
    >
      {/* New Message */}
      {/* <button
        className='bg-[#2BA579] w-full py-3 mx-2 my-5  text-white text-sm  rounded-lg opacity-0 pointer-events-none'
        onClick={() => {
          if (!showReply && !showForward) dispatch(setCompose(true))
        }}
      >
        NEW MESSAGE
      </button> */}
      <div
        className={`text-4xl pr-2 self-end cursor-pointer lg:opacity-0 lg:pointer-events-none py-3`}
        onClick={() => setOpen((open) => !open)}
      >
        {open ? <BiX /> : <BiMenu />}
      </div>
      {/* Email type List Mobile */}
      <div className='lg:hidden block items-start w-full'>{open ? <SideBarLayout /> : null}</div>
      {/* Email type List Desktop */}
      <div className='lg:block hidden w-full'>
        <SideBarLayout />
      </div>
    </div>
  )
}

export default FeedbackEmailSidebar
