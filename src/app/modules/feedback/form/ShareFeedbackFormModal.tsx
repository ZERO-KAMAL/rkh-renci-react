import { Dialog } from '@mui/material'
import LocationDetailCustom from 'app/components/LocationDetailCustom'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { toast } from 'react-toastify'

import {
  createShareFeedback,
  setActiveShareFeedBackForm,
} from '../../../http/feedbacks/feedBackSlice'
import { LocationDetailFormScheam } from '../../../http/location-datas/locationDetail.model'

const ShareFeedbackFormModal = () => {
  const { feedbackId } = useAppSelector((state) => state.feedback)
  const [locationDetail, setLocationDetail] = useState<Array<LocationDetailFormScheam>>([
    { locationId: 0, areaId: 0, departmentId: 0, address: '' },
  ])
  const [toggle, setToggle] = useState(false)
  const [error, setError] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (locationDetail.length > 0) locationDetailValidate()
  }, [locationDetail])

  const locationDetailValidate = () => {
    const isValid: boolean =
      locationDetail.length > 0 && locationDetail.every((value) => value.locationId! > 0)
    // console.log(`isValid =>${isValid}`)
    setError(!isValid)
    return isValid
  }
  const handleRemoveClick = (index: number) => {
    // console.log(`Remove Click => ${index}`)
    // console.log(index)
    // console.log(`Current List =>${JSON.stringify(locationDetail)}`)
    // console.log(`After Remove List =>${JSON.stringify(locationDetail)}`)
    setLocationDetail(locationDetail => locationDetail.splice(index, 1))
    setToggle((prev) => !prev)
  }
  const updateLocationDetail = (data: any) => {
    // console.log(`updateLocationDetail....${JSON.stringify(data)}`)
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      address: '',
    }
    const list = [...locationDetail]
    list[data.index] = update
    setLocationDetail(list)
    // console.log(`latest Location Detail =>${JSON.stringify(locationDetail)}`)
    locationDetailValidate()
  }
  const handleAddClick = () => {
    setLocationDetail([
      ...locationDetail,
      { locationId: 0, areaId: 0, departmentId: 0, address: '' },
    ])
    setError(true)
    // console.log(`Current List => ${JSON.stringify(locationDetail)}`)
  }
  const handleSaveOnClick = () => {
    try {
      if (locationDetailValidate()) {
        const locations: any = locationDetail.map(({ address, ...keepAttrs }) => keepAttrs)
        const data: any = {
          locations: locations,
        }
        // console.log(`feedbackId => ${feedbackId}`)
        // console.log(`data => ${JSON.stringify(data)}`)
        dispatch(createShareFeedback({ id: feedbackId, data: data })).then((response) => {
          if (response.meta.requestStatus == 'fulfilled') {
            setLocationDetail([])
            toast.success('Saving Successful', {
              position: toast.POSITION.TOP_RIGHT,
            })
            handleOnClose()
          } else if (response.meta.requestStatus == 'rejected') {
            toast.error('Something was wrong', {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
        })
      }
    } catch (err) {}
  }

  const handleOnClose = () => {
    // console.log(`handleOnClose.....`)
    dispatch(setActiveShareFeedBackForm({ active: false, feedbackId: 0 }))
  }

  return (
    <Dialog onClose={handleOnClose} open={true}>
      <div className='w-[600px] mx-auto h-auto '>
        <div className='relative bg-white rounded-lg shadow-2xl border border-lg'>
          <button
            type='button'
            className='absolute top-5 right-2.5 
                        text-gray-400 bg-transparent
                        hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                        text-sm p-1.5 ml-auto inline-flex items-center'
            onClick={() => {
              dispatch(setActiveShareFeedBackForm({ active: false, feedbackId: 0 }))
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
          <div className='py-6 '>
            <span className='px-6'>Share Feedback</span>
            <div className='border border-b-0 mt-4 '></div>
          </div>
          <form className='space-y-6 px-7 '>
            <div className='flex  '>
              <label
                className='block mb-2 text-sm 
                                font-medium text-gray-900'
              >
                Assign Feedback to more Departments
                <span className='text-red-900 font-bold'>*</span>
              </label>
              <div
                className='w-[20px] h-[20px] bg-[#DFF1EB] ml-2
                      hover:bg-green-900 hover:text-white hover:text-3xl'
                onClick={() => handleAddClick()}
              >
                <IoMdAdd size={20} />
              </div>
            </div>
            {/* dynamic create */}
            <div>
              {locationDetail &&
                locationDetail.map((data, i) => {
                  return (
                    <LocationDetailCustom
                      index={i}
                      locationId={data.locationId!}
                      areaId={data.areaId!}
                      departmentId={data.departmentId!}
                      handleRemoveClick={handleRemoveClick} // handleRemoveClick
                      updateLocationDetail={updateLocationDetail}
                      titleHidden={false}
                    />
                  )
                })}
              {error && (
                <div className='text-red-600 text-sm'>
                  <span role='alert'>Locaiton Details invalid.Please check again</span>
                </div>
              )}
            </div>
          </form>
          <div className='border border-b-0 mt-8 '></div>
          <div className='flex justify-end mt-5 mx-5'>
            <button
              // type='submit'
              className='bg-[#2BA579] p-3 px-7 text-white rounded-md ml-3 
                                disabled:opacity-50 text-sm mb-3'
              onClick={handleSaveOnClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareFeedbackFormModal
