import Loading from 'app/components/Loading'
import { fetchAppConstant, fetchFeedbackType } from 'app/http/feedbacks/feedBackSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { useDebounce } from 'usehooks-ts'

import {
  createFeedbackLable,
  deleteAllFeedbackLabel,
  fetchFeedbackLable,
  setActiveLableForm,
  setEditData,
  setLabelId,
  setText,
} from '../../../http/feedback-email-lable/feedBackEmailLableSlice'

const FeedbackEmailLabelSetting = () => {
  const dispatch = useAppDispatch()
  const { dataTable: dataTableLable, loading } = useAppSelector((state) => state.feedbackEmailLabel)
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const debouncedText = useDebounce(searchText, 500)

  const initFetch = useCallback(async () => {
    // console.log('Feedback Email InitFetch...')
    await dispatch(fetchFeedbackLable())
  }, [])

  useEffect(() => {
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceTest => ${debouncedText}`)
      dispatch(setText(debouncedText))
      initFetch()
    }
  }, [debouncedText])

  // Action
  const handleEdit = (data: any) => {
    // console.log(`data => ${JSON.stringify(data)}`)
    // dispatch(setLabelId(data.id))
    dispatch(setEditData(data))
    dispatch(setActiveLableForm(true))
  }
  const handleDelete = (id: number) => {
    // console.log(`id => ${id}`)
    Swal.fire({
      title: ' </br>Would you like to delete this label?',

      text: 'This action cannot be undone, so please be sure before proceeding.',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'green',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Go Back',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAllFeedbackLabel([id])).then((response) => {
          const status = response.meta.requestStatus
          if (status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.payload?.data?.message || 'Something went wrong!',
            })
          } else if (status === 'fulfilled') {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
          }
        })
      }
    })
  }

  const {
    feedbackTypeList,
    feedbackTypeLoading
  } = useAppSelector((state) => state.feedback)

  useEffect(()=> {
    dispatch(fetchFeedbackType())
  }, [])

  return (
    <div className='mx-5'>
      {/* header */}
      <div className='flex mt-5 items-center '>
        <span className='text-xl font-bold mr-10'>Manage Labels</span>
        <div className='flex items-center bg-[#ECF0F3] px-2 w-[500px] rounded-md'>
          <AiOutlineSearch size={20} />
          <input
            type='text'
            name='search'
            id='search'
            placeholder='Search lables'
            className={clsx('ml-2 h-[40px] bg-transparent focus:outline-none ')}
            onChange={(e) => {
              setSearchText(e.target.value)
            }}
            autoComplete='off'
          />
        </div>
      </div>
      {/* divider */}
      <div className='border-b-2 border-gray-100 my-6'></div>
      {/* table */}
      <div className={clsx('w-[600px]  flex justify-between font-bold  ')}>
        <span className='border-b-2 border-black'>Label Name </span>
        <span className='border-b-2 border-black'>Actions </span>
      </div>
      <div className=' w-[600px] overflow-auto '>
        {loading && <Loading />}

        {((dataTableLable && feedbackTypeList?.length !== 0) && (!loading && !feedbackTypeLoading)) &&
          dataTableLable.map((data: any, index: number) => {
            const isDefaultType = feedbackTypeList?.find((f: any)=> f.name === data.name)
            return(
              <div className='mt-10 flex justify-between' key={data.id}>
                <span>{data.name} </span>
                {
                  !isDefaultType &&
                  <div className='flex justify-between items-center '>
                    {/* edit */}
                    <div
                      className='w-4 mr-5 transform hover:text-green-900 hover:scale-110 text-green-700'
                      onClick={() => {
                        handleEdit(data)
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                    </div>

                    {/* delete */}
                    <div
                      className='w-4 mr-1 transform hover:text-green-900 hover:scale-110 text-green-700'
                      onClick={() => {
                        handleDelete(data.id)
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </div>
                  </div>
                }
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default FeedbackEmailLabelSetting
