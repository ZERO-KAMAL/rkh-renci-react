import { Dialog } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { useEffect } from 'react'

import {
  fetchFeedbackActivity,
  setActiveFeedBackActivity,
  setFeedbackId,
} from '../../../http/feedbacks/feedBackSlice'

const RecentActivityFormModal = () => {
  const dispatch = useAppDispatch()
  const { feedbackId, dataTableActivity } = useAppSelector((state) => state.feedback)

  const initialFetch = async () => {
    await dispatch(fetchFeedbackActivity(feedbackId))
  }

  useEffect(() => {
    initialFetch()
  }, [])

  const handleOnClose = () => {
    console.log(`handleOnClose.....`)
    dispatch(setActiveFeedBackActivity({ active: false, feedbackId: feedbackId }))
  }

  return (
    <Dialog onClose={handleOnClose} open={true} fullWidth maxWidth='lg'>
      <div>
        <div
          className='
           bg-white overflow-x-hidden
            rounded-lg shadow-2xl border border-lg'
        >
          <button
            type='button'
            className='absolute top-5 right-2.5 
                      text-gray-400 bg-transparent
                      hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                      text-sm p-1.5 ml-auto inline-flex items-center'
            data-modal-toggle='location-modal'
            onClick={() => {
              dispatch(setActiveFeedBackActivity({ active: false, feedbackId: feedbackId }))
            }}
          >
            <svg
              aria-hidden='true'
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span className='sr-only'>Close modal</span>
          </button>
          <div className='py-6'>
            <div className='px-6 text-lg font-bold mb-5'>Recent Activity</div>
            <div className='border-t pt-8 max-h-[60vh] overflow-y-auto'>
              {dataTableActivity &&
                dataTableActivity.map((row: any, index: number) => {
                  return (
                    // <tr className='' key={row.id}>
                    //   <td className='py-3 px-6 text-left flex  justify-start items-center'>
                    <div className='flex mb-1 mx-10 ' key={row.id}>
                      <span className='font-medium mr-20'>{row.dateTime}</span>
                      <div className='flex items-center '>
                        <div className='flex flex-col'>
                          <div className='flex items-start '>
                            <div className='w-[15px] h-[15px] rounded-full  border-green-900 border-4 '></div>
                            <span className='font-medium ml-5 '> {row.comment}</span>
                          </div>
                          <div
                            className={clsx(
                              'h-[50px] w-[1px] bg-gray-400 my-1 ml-2',
                              dataTableActivity.length - 1 === index && 'hidden'
                            )}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
            
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default RecentActivityFormModal
