import { SelectChangeEvent, Tooltip } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Loading from 'app/components/Loading'
import { FeedbackLabelUpdate } from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForward.model'
import {
  clearComposeData,
  updateMultipleFeedback,
} from 'app/http/feedback-email-reply-send-forward/FeedbackEmailReplySendForwardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

import NAVIGATE_LINKS from '../../../constants/router-links'
import {
  DeleteFeedbackEmail,
  defParamsFeedback,
  fetchFeedbackEmail,
  setEmailId,
  setPage,
  getFeedbackType,
} from '../../../http/feedback-email/feedBackEmailSlice'
import FeedbackInboxHeader from '../components/FeedbackInboxHeader'

const EmailTemplate = ({ type, initialIsStarred, isNavigate = true, onRowClick, labelId, isArchive }: any) => {
  const [value, setValue] = useState(initialIsStarred ? 'Starred' : 'All')
  const [checkedItems, setCheckedItems]: [string[], any] = useState([])
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [emailSearch, setEmailSearch] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { dataTable, page, loading } = useAppSelector((state) => state.feedbackEmail)
  const { dataTable: dataTableLabel } = useAppSelector((state) => state.feedbackEmailLabel)
  const feedBackParams = {
    ...defParamsFeedback,
    emailType: type,
    subject: emailSearch,
    createdAtFrom: startDate ? moment.parseZone(startDate).local(true).format() : undefined,
    createdAtTo: endDate ? moment.parseZone(endDate).local(true).add(1, 'd').format() : undefined,
    page: page + 1,
    isRead: value === 'All' ? undefined : value === 'Read',
    isStarred: value === 'All' ? undefined : initialIsStarred ? true : value === 'Starred',
    isArchive: isArchive || false,
    labelId,
  }

  const initialFetch = useCallback(async () => {
    await dispatch(
      fetchFeedbackEmail({
        ...feedBackParams,
        page: 1,
        emailType: type,
        isStarred: value === 'All' ? undefined : initialIsStarred ? true : value === 'Starred',
        isArchive: isArchive || false,
      })
    )
  }, [labelId])

  useEffect(() => {
    initialFetch()
  }, [labelId, type])

  const onSearchChange = async (e: any) => {
    setEmailSearch(e.target.value)
    await dispatch(
      fetchFeedbackEmail({
        ...feedBackParams,
        subject: e.target.value,
      })
    )
  }
  const onDataRangeChange = async (update: any) => {
    setDateRange(update)
    const [startDate, endDate] = update
    await dispatch(
      fetchFeedbackEmail({
        ...feedBackParams,
        createdAtFrom: startDate ? moment.parseZone(startDate).local(true).format() : undefined,
        createdAtTo: endDate ?  moment.parseZone(endDate).local(true).add(1, 'd').format() : undefined,
      })
    )
  }

  const handleChangeCheckBox = (checked: any, data: any) => {
    setCheckedItems((prev: string[]) =>
      checked.target.checked ? [...prev, data.id] : prev.filter((obj) => obj !== data.id)
    )
  }
  const handleFilterChange = async (e: SelectChangeEvent) => {
    const value = e.target.value
    setValue(value)
    await dispatch(
      fetchFeedbackEmail({
        ...feedBackParams,
        isRead: value === 'All' ? undefined : value === 'Read',
        isStarred: value === 'All' ? undefined : initialIsStarred ? true : value === 'Starred',
      })
    )
  }

  const handleChangePage = async (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setPage(+newPage))
    await dispatch(
      fetchFeedbackEmail({
        ...feedBackParams,
        page: newPage + 1,
      })
    )
  }

  const refetch = async () => {
    await dispatch(fetchFeedbackEmail(feedBackParams))
    await dispatch(getFeedbackType({}))
  }

  const handleDelete = async () => {
    await dispatch(DeleteFeedbackEmail(checkedItems))
    setCheckedItems([])
    refetch()
  }

  const handleMultipleUnRead = async () => {
    const data: FeedbackLabelUpdate = {
      isRead: false,
      ids: checkedItems,
    }
    await dispatch(updateMultipleFeedback({ data }))
    setCheckedItems([])
    refetch()
  }

  const handleMultipleRead = async () => {
    const data: FeedbackLabelUpdate = {
      isRead: true,
      ids: checkedItems,
    }
    await dispatch(updateMultipleFeedback({ data }))
    setCheckedItems([])
    refetch()
  }

  const handleMultipleArchive = async () => {
    const data: FeedbackLabelUpdate = {
      isArchive: isArchive ? false : true,
      ids: checkedItems,
    }
    await dispatch(updateMultipleFeedback({ data }))
    setCheckedItems([])
    refetch()
  }

  return (
    <div>
      {/* header */}
      <FeedbackInboxHeader
        onSearchChange={onSearchChange}
        onDataRangeChange={onDataRangeChange}
        value={value}
        isSelect={initialIsStarred}
        setValue={setValue}
        checked={dataTable?.every((item: any) => checkedItems.some((i: any) => i === item.id))}
        setChecked={(e: any) => {
          setCheckedItems(() => (!e ? [] : dataTable?.map((i: any) => i.id)))
        }}
        setCheckedMails={setCheckedItems}
        dateRange={dateRange}
        showFilters={checkedItems.length}
        checkedMails={checkedItems}
        showItems={dataTable?.length}
        handleFilterChange={handleFilterChange}
        handleChangePage={handleChangePage}
        handleDelete={handleDelete}
        refetch={refetch}
        handleMultipleUnRead={handleMultipleUnRead}
        handleMultipleArchive={handleMultipleArchive}
        handleMultipleRead={handleMultipleRead}
        refetchEmails={refetch}
        isArchive={isArchive}
      />
      {/* table */}
      <div className='w-full h-auto'>
        <table className='w-full table-auto'>
          <tbody className='text-gray-400 text-sm max-sm:block '>
            {dataTable &&
              dataTable.map((data: any) => (
                <tr
                  className={clsx(
                    'hover:bg-[#E8FFF3] cursor-pointer border-b max-sm:flex max-sm:flex-col max-sm:gap-1 max-sm:p-1',
                    !data.isRead && ' bg-[#f0f1f5b3]'
                  )}
                  key={data.id}
                  onClick={async () => {
                    if (!data.isRead) {
                      const readEnable: FeedbackLabelUpdate = {
                        isRead: true,
                        ids: [data.id],
                      }
                      await dispatch(
                        updateMultipleFeedback({ data: readEnable, successShow: false })
                      )
                    }
                    dispatch(setEmailId(data.id))
                    dispatch(clearComposeData())

                    if (isNavigate) navigate(`/feedback/inbox/emaildetail/${data.id}/${data.feedbackId}`)
                    if (onRowClick) onRowClick(data)
                  }}
                >
                  <td className='pl-2 '>
                    <div className='flex items-center'>
                      <Checkbox
                        sx={{
                          p: '0',
                          color: '#A1A5B7',
                          '&.Mui-checked': {
                            color: '#2BA579',
                          },
                        }}
                        checked={!!checkedItems.find((i) => i == data.id)}
                        onChange={(e) => handleChangeCheckBox(e, data)}
                        onClick={(e) => e.stopPropagation()}
                        color='success'
                      />
                      <div className='px-3'>
                      <Tooltip title={data?.emailFrom}>
                        <span className='text-[#464E5F] font-semibold text-lg'>{data?.emailFrom?.split('@')[0].substring(0, 20)}</span>
                      </Tooltip>
                    </div>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center justify-between ml-2 max-sm:flex-col max-sm:items-start max-sm:gap-1'>
                      <div>
                        <span className='text-[#464E5F] font-semibold text-lg'>{data.subject}</span>
                        {/* <span>-</span> */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              data.content?.length < 80
                                ? data.content
                                : `${data.content?.substring(0, 80)}...`,
                          }}
                        />
                        {!!data?.labels &&
                          <div className="flex flex-wrap gap-2 py-2">
                            {
                              data?.labels?.map((labelId: any)=> {
                                const label = dataTableLabel?.find((f: any)=> f.id === labelId)?.name
                                if(label) {
                                  return(
                                    <div className='px-3 py-1 rounded-full bg-[#FFA621] text-white' key={labelId}>
                                      {label?.length > 20 ? label?.substring(0, 18) + '..' : label}
                                    </div>
                                  )
                                }
                                else
                                  return null
                              })
                            }
                          </div>
                        }
                        
                      </div>
                      <span className='text-[#464E5F] font-semibold text-lg mr-4'>
                        {moment(data.createdAt).format('MMM DD')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? <Loading /> : null}
      </div>
    </div>
  )
}

export default EmailTemplate
