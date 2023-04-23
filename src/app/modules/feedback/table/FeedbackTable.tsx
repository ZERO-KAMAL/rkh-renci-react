import { TableSortLabel, Tooltip } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Loading from 'app/components/Loading'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  fetchFeedback,
  reopenFeedback,
  setFeedbackTypeLoading,
  setLoadingFeedback,
  setOrder,
  setSelectById,
  setSelectedAll,
} from '../../../http/feedbacks/feedBackSlice'
import FeedbackSelectBox from '../components/FeedbackSelectBox'

const FeedbackTable = (parms: any) => {
  const [reOpenCase, setReopenCase] = useState(0)
  const statusCase = {
    NewCase: 'New Case',
    AckCase: 'Case Acknowledged',
    Overdue: 'Response Overdue',
    Pending: 'Pending Response',
    CaseActive: 'Case Active',
    CaseClosed: 'Case Closed',
  }
  const tableHeaderList = [
    {
      id: 'id',
      lable: 'ID',
      sorting: true,
    },
    {
      id: 'locationName',
      lable: 'Location',
      sorting: true,
    },
    {
      id: 'feedbackTypeName',
      lable: 'Feedback Type',
      sorting: true,
    },
    {
      id: 'submittedDate',
      lable: 'Feedback Received',
      sorting: true,
    },
    {
      id: 'TAT',
      lable: 'TAT',
      sorting: true,
    },
    {
      id: 'status',
      lable: 'Status',
      sorting: true,
    },
  ]

  const dispatch = useAppDispatch()
  const {
    dataTableFeedback,
    loadingFeedback,
    feedbackTypeLoading,
    selected,
    selectedAll,
    order,
    limit,
    type,
  } = useAppSelector((state) => state.feedback)
  const sliceLength = 5
  const dataFeedback = dataTableFeedback && dataTableFeedback.slice(0, sliceLength)
  const [loading, setLoading] = useState(true)

  // Action
  const handleSelectAll = () => {
    dispatch(setSelectedAll(!selectedAll))
  }
  const handleCheckBoxById = (id: number) => {
    // console.log('handle checkbox => ', id)
    dispatch(setSelectById(id))
  }
  const handleReopenCase = async (id: number) => {
    try {
      dispatch(reopenFeedback({ feedbackId: id, title: parms.title })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          setReopenCase(0)
          toast.success('Reopen Case Successful', {
            position: toast.POSITION.TOP_RIGHT,
          })
        } else {
          toast.error('Something was wrong', {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      })
    } catch (err) {
      toast.error('Something was wrong', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  // useEffect(() => {
  //   console.log(`dataTableFeedback ${type}:`, dataTableFeedback)
  // }, [dataTableFeedback, type])

  // const location = useLocation()

  // useEffect(() => {
  //   setLoadingFeedback(true)
  //   setFeedbackTypeLoading(true)
  // }, [])

  // useEffect(() => {
  //   // console.log('DEBUG: loadingFeedback: ', loadingFeedback)
  //   // console.log('DEBUG: feedbackTypeLoading: ', feedbackTypeLoading)
  //   // console.log('DEBUG: SHOW UI: ', !loadingFeedback && !feedbackTypeLoading, location.pathname)
  // }, [loadingFeedback, feedbackTypeLoading])

  return (
    <div className=' bg-white  p-1 rounded-t-lg max-md:overflow-auto'>
      {!loadingFeedback && !feedbackTypeLoading && (
        <table className='w-full table-auto bg-transparent rounded-t-lg'>
          {/* Table Header */}
          <thead className='bg-[#F5F8FA] '>
            <tr className=' text-gray-600 text-sm leading-normal '>
              {/* toggle */}
              {!parms.hideCheckbox ? (
                <th className='py-3 px-3 text-left'>
                  {/* <input type={'checkbox'} className='w-4 h-4 mt-1 ml-4' /> */}
                  <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={selectedAll}
                    onChange={handleSelectAll}
                    color='success'
                  />
                </th>
              ) : (
                <th className='py-3 px-3 text-left'></th>
              )}
              {tableHeaderList.map((data: any, index: number) => {
                if (data.sorting && !parms.hideSorting) {
                  return (
                    <th className='py-3 px-3 text-left ' key={index}>
                      <TableSortLabel
                        active={order.sortBy === data.id}
                        direction={order.sortDir}
                        onClick={() => {
                          dispatch(
                            setOrder({
                              sortDir: order.sortDir == 'asc' ? 'desc' : 'asc',
                              sortBy: data.id,
                            })
                          )
                        }}
                      >
                        {data.lable}
                      </TableSortLabel>
                    </th>
                  )
                } else
                  return (
                    <th className='py-3 px-0 text-left ' key={index}>
                      {' '}
                      {data.lable}{' '}
                    </th>
                  )
              })}
              <th className='py-3 px-0 text-left'></th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className='text-gray-600 text-sm font-light'>
            {dataTableFeedback &&
              (parms.forDashboard ? dataFeedback : dataTableFeedback).map((data: any) => {
                return (
                  <tr className='' key={data.id}>
                    {!parms.hideCheckbox ? (
                      <td className='pl-3'>
                        {/* <input type={'checkbox'} className='w-4 h-4 ml-4' /> */}
                        <Checkbox
                          inputProps={{ 'aria-label': 'controlled' }}
                          checked={selected.includes(data.id)}
                          onChange={() => {
                            handleCheckBoxById(data.id)
                          }}
                          color='success'
                        />
                      </td>
                    ) : (
                      <td className='pl-3'></td>
                    )}

                    <td className=' whitespace-nowrap py-3 px-3'>
                      <div className='flex flex-col'>
                        <span className='text-[#7E8299] text-sm font-bold'>{data.id}</span>
                      </div>
                    </td>

                    {/* loation */}
                    <td className=' whitespace-nowrap py-3 px-3'>
                      {data.assignLocations?.length > 1 ? (
                        <Tooltip
                          title={
                            <>
                              {data.assignLocations &&
                                data.assignLocations.map((loc: any, idx: any) => (
                                  <div className='flex flex-col' key={idx}>
                                    <span className='text-[#B5B5C3] text-sm font-bold'>
                                      {loc.locationName}
                                    </span>
                                    <span className='text-[#B5B5C3] text-sm'>
                                      {loc.areaName}
                                    </span>
                                    <span className='text-[#B5B5C3] text-sm'>
                                      {loc.departmentName}
                                    </span>
                                  </div>
                                ))}
                            </>
                          }
                        >
                          <div className='flex items-center gap-6'>
                            <div className='flex flex-col'>
                              <span className='text-[#7E8299] text-sm font-bold'>
                                {data.locationName}
                              </span>
                              <span className='text-[#B5B5C3] text-sm'>
                                {data.areaName}
                              </span>
                              <span className='text-[#B5B5C3] text-sm'>
                                {data?.departmentName}
                              </span>
                            </div>
                            <div
                              className='bg-[#E8FFF3] text-[#2BA579] 
                             w-[30px] h-[30px] rounded-md flex  font-bold items-center'
                            >
                              <span className='p-1'>
                                {'+'}
                                {data.assignLocations.length - 1}
                              </span>
                            </div>
                          </div>
                        </Tooltip>
                      ) : (
                        <div className='flex flex-col'>
                          <span className='text-[#7E8299] text-sm font-bold'>
                            {data.locationName}
                          </span>
                          <span className='text-[#B5B5C3] text-sm'>
                            {data.areaName}
                          </span>
                          <span className='text-[#B5B5C3] text-sm'>
                            {data?.departmentName}
                          </span>
                        </div>
                      )}
                    </td>
                    {/* Feedback Type */}
                    <td className='text-left py-3 px-3'>
                      <span className='bg-[#F1F1F1] text-[#3F4254] text-[10px] md:text-sm font-bold rounded-2xl p-2 whitespace-nowrap'>
                        {data.feedbackType}
                      </span>
                    </td>
                    {/* Feedback Received */}
                    <td className='py-3 px-3 text-left'>
                      <span className='text-[#7E8299] text-sm text-center '>
                        {data.feedbackReceived}
                      </span>
                    </td>
                    {/* TAT */}
                    <td className='text-left py-3 px-3 '>
                      {data.TAT >= 28 ? (
                        <span
                          className={`bg-purple-200 text-purple-600 py-1 px-3 rounded-full font-semibold whitespace-nowrap
                        ${data.tatCount >= 21 ? 'bg-amber-200 !text-amber-600 font-bold' : ''} ${
                            data.tatCount > 28 ? 'bg-red-200 !text-red-600 font-bold' : ''
                          }`}
                        >
                          {data.tat}
                        </span>
                      ) : (
                        <span
                          className={`bg-blue-200 text-blue-600 py-1 px-3 rounded-full font-semibold flex-wrap 
                        ${data.tatCount >= 4 ? 'bg-amber-200 !text-amber-600 font-bold' : ''} ${
                            data.tatCount > 7 ? 'bg-red-200 !text-red-600 font-bold' : ''
                          }`}
                        >
                          {data.tat}
                        </span>
                      )}
                    </td>
                    {/* Status */}
                    <td
                      className='text-left py-3 px-3'
                      onClick={() => {
                        if (data.id == reOpenCase) setReopenCase(0)
                        else setReopenCase(data.id)
                      }}
                    >
                      <span
                        className={clsx(
                          'md:text-sm text-[12px] overflow-hidden whitespace-nowrap text-ellipsis break-words font-bold rounded-lg p-2 select-none',
                          data.status === statusCase.NewCase && 'text-[#0095E8] bg-[#ECF8FF]',
                          data.status === statusCase.AckCase && 'text-[#8950FC] bg-[#EEE5FF]',
                          data.status === statusCase.CaseActive && 'text-#50CD89] bg-[#E8FFF3]',
                          data.status === statusCase.Overdue && 'text-[#F1416C] bg-[#FFF5F8]',
                          data.status === statusCase.CaseClosed && 'text-[#5E6278] bg-[#E4E6EF]',
                          data.status === statusCase.Pending && 'text-[#FFA621] bg-[#FFF5E7]'
                        )}
                      >
                        {data.status}
                      </span>
                    </td>
                    {/* button */}
                    {!parms.hideActionBtn && (
                      <td className='text-left py-3 pr-3 '>
                        <FeedbackSelectBox
                          id={data.id}
                          status={data.status}
                          title={parms.title}
                          manualAlert={data.configManualAlert}
                        />
                      </td>
                    )}
                    {!parms.hideActionBtn && data.status === statusCase.CaseClosed ? (
                      <td
                        className={clsx(
                          'absolute bg-[#DFF1EB]  px-5 py-3 mt-[60px]  ml-[-330px] z-50  rounded-lg',
                          reOpenCase !== data.id && 'hidden'
                        )}
                        onClick={() => {
                          // console.log(`Re-open Case => ${data.id}`)
                          handleReopenCase(data.id)
                        }}
                      >
                        <span className='font-bold '>Re-open Case</span>
                      </td>
                    ) : null}
                  </tr>
                )
              })}
          </tbody>
        </table>
      )}
      {loadingFeedback && feedbackTypeLoading && <Loading />}
    </div>
  )
}

export default FeedbackTable
