import { Dialog } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { toast } from 'react-toastify'

import {
  createFeedbackLable,
  setActiveLableForm,
  setEditData,
} from '../../../http/feedback-email-lable/feedBackEmailLableSlice'

const FeedbackLabelFormModal = () => {
  const dispatch = useAppDispatch()
  const { editData } = useAppSelector((state) => state.feedbackEmailLabel)
  const initLabel = editData === null ? '' : editData.name
  const [label, setLabel] = useState<string>(initLabel)
  const [message, setMessage] = useState<string>('')
  const { activeLabelForm } = useAppSelector((state) => state.feedbackEmailLabel)

  useEffect(() => {
    if (message) {
      if (message === 'save') {
        toast.success('Saving Successful', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else if (message === 'update') {
        toast.success('Updating Successful', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        toast.error('Something was wrong.', {
          position: toast.POSITION.TOP_RIGHT,
        })
        setMessage('')
      }
    }
  }, [message])

  // Action
  const handleCreateLabel = (e: any) => {
    try {
      e.preventDefault()
      dispatch(createFeedbackLable({ data: { name: label } })).then((data) => {
        if (data.meta.requestStatus === 'fulfilled') {
          setLabel('')
          setMessage(editData === null ? 'save' : 'update')
        } else {
          setMessage('error')
        }
      })
    } catch (err) {
      setMessage('error')
    }
  }

  return (
    <Dialog
      open={activeLabelForm}
      onClose={() => {
        dispatch(setActiveLableForm(false))
      }}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '680px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='w-[650px] mx-auto h-auto '>
        <div className='relative bg-white rounded-lg shadow-2xl border border-lg'>
          <div className='flex justify-between items-center border-b-2 border-gray-100 px-9 pt-6 pb-4'>
            <span className='text-lg font-bold'>
              {editData === null ? 'New Label' : 'Update Label'}
            </span>
            <IoClose
              size={'25px'}
              color={'rgba(0, 0, 0, 0.54)'}
              onClick={() => {
                dispatch(setActiveLableForm(false))
              }}
            />
          </div>
          <div className='py-14 px-6 text-lg font-bold flex flex-col'>
            <span>Please enter a new label name :</span>
            <div className='w-full bg-[#ECF0F3] p-2 mt-5 rounded-md font-normal '>
              <input
                type='text'
                value={label}
                placeholder='Add new label'
                className='bg-transparent w-full focus:outline-none'
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
          <div className='border-b-2 border-gray-100'></div>
          {/* buttons */}
          <div className='flex justify-end items-center  px-6 py-10'>
            <button
              type='button'
              className='text-gray-300 hover:text-gray-600 hover:font-bold '
              onClick={() => {
                dispatch(setActiveLableForm(false))
              }}
            >
              Discard
            </button>
            <button
              disabled={label ? false : true}
              type='submit'
              className={clsx('bg-[#2BA579]  text-white rounded-md ml-3 p-4  disabled:opacity-50 ')}
              onClick={handleCreateLabel}
            >
              Create Label
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default FeedbackLabelFormModal
