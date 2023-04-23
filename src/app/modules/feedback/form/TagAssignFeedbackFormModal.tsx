import { Dialog } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import LocationDetailCustom from 'app/components/LocationDetailCustom'
import LocationDetailCustomV2 from 'app/components/LocationDetailCustomV2'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import { closestIndexTo } from 'date-fns'
import { forEach } from 'jszip'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { toast } from 'react-toastify'

import { TagAssignFeedbackFormSchema } from '../../../http/feedbacks/feedBack.model'
import {
  createAssignFeedback,
  setActiveTagAssignFeedBackForm,
} from '../../../http/feedbacks/feedBackSlice'
import { LocationDetailFormScheam } from '../../../http/location-datas/locationDetail.model'

const TagAssignFeedbackFormModal = () => {
  const dispatch = useAppDispatch()
  const { feedbackId, editDataFeedback, editDataFeedbackOrg } = useAppSelector(
    (state) => state.feedback
  )

  const [caseType, setCaseType] = React.useState(
    editDataFeedback.assignLocations.length > 1 ||
      editDataFeedback.assignLocations.some((item: any) => item.departmentId === undefined)
      ? 'Complex Case'
      : 'Simple Case'
  )

  useEffect(() => {
    const x = editDataFeedback.assignLocations.some((item: any) => {
      console.log(item)
      return item.departmentId === undefined
    })
    console.log('item: ', x)
  }, [])

  const [error, setError] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [locationDetail, setLocationDetail] = useState<Array<any>>([
    { locationId: 0, areaId: 0, departmentId: 0, address: '' },
  ])

  const assignLocationHandler = () => {
    const locations: any = []
    editDataFeedback.assignLocations.forEach((loc: any) => {
      locations.push({
        locationId: loc.locationId || null,
        areaId: loc.areaId || null,
        departmentId: loc.departmentId || null,
        locationName: loc.locationName || null,
        areaName: loc.areaName || null,
        departmentName: loc.departmentName || null,
      })
    })
    setLocationDetail(locations)
  }

  useEffect(() => {
    if (locationDetail.length > 0) locationDetailValidate()
  }, [locationDetail])

  useEffect(() => {
    if (editDataFeedback) {
      // assignLocations is more than one that is complex
      assignLocationHandler()
      /* setLocationDetail([
        {
          locationId: editDataFeedback.locationId,
          areaId: editDataFeedback.areaId,
          departmentId: editDataFeedback.departmentId,
          locationName: editDataFeedback.locationName,
          areaName: editDataFeedback.areaName,
          departmentName: editDataFeedback.departmentName,
        },
      ])*/
    }
  }, [])

  const locationDetailValidate = () => {
    const isValid: boolean =
      locationDetail.length > 0 && locationDetail.every((value) => value.locationId! > 0)
    // console.log(`isValid =>${isValid}`)
    setError(!isValid)
    return isValid
  }

  const handleAddClick = () => {
    setLocationDetail([
      ...locationDetail,
      // { locationId: 0, areaId: 0, departmentId: 0, address: '' },
      {
        locationId: locationDetail.length > 0 ? locationDetail[0].locationId : 0,
        areaId: locationDetail.length > 0 ? locationDetail[0].areaId : 0,
        departmentId: 0,
        address: '',
        locationName: locationDetail.length > 0 ? locationDetail[0].locationName : '',
        areaName: locationDetail.length > 0 ? locationDetail[0].areaName : '',
      },
    ])
    setError(true)
    // console.log(`Current List => ${JSON.stringify(locationDetail)}`)
  }
  const handleRemoveClick = (index: number) => {
    // console.log(`Remove Click => ${index}`)
    // console.log(index)
    // console.log(`Current List =>${JSON.stringify(locationDetail)}`)
    // console.log(`After Remove List =>${JSON.stringify(locationDetail)}`)
    setLocationDetail((oldLocationDetail) => {
      const newLocationDetail = [...oldLocationDetail]
      newLocationDetail.splice(index, 1)
      return newLocationDetail
    })
    setToggle((prev) => !prev)
  }
  const updateLocationDetailBackup = (data: any) => {
    // console.log(`updateLocationDetail....${JSON.stringify(data)}`)
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      locationName: data.locationName,
      areaName: data.areaName,
      departmentName: data.departmentName,
      address: '',
    }
    const list = [...locationDetail]
    if (data.index === 0 && data.locationId != locationDetail[0].locationId)
      setLocationDetail([update])
    else {
      list[data.index] = update
      setLocationDetail(list)
    }
    // list[data.index] = update
    // setLocationDetail(list)
    // console.log(`latest Location Detail =>${JSON.stringify(locationDetail)}`)
    locationDetailValidate()
  }
  const updateLocationDetail = (data: any) => {
    // console.log(`updateLocationDetail....${JSON.stringify(data)}`)
    const update = {
      locationId: data.locationId,
      areaId: data.areaId,
      departmentId: data.departmentId,
      locationName: data.locationName,
      areaName: data.areaName,
      departmentName: data.departmentName,
      address: '',
    }

    const list = [...locationDetail]

    if (data.index === 0 && data.locationId != locationDetail[0].locationId)
      setLocationDetail([update])
    else {
      list[data.index] = update
      let tempList = list

      // console.log(`current list data => ${JSON.stringify(list)}`)

      if (data.areaId > 0 && data.departmentId == 0) {
        const removeList = list.filter(
          (rec) => rec.locationId == data.locationId && rec.areaId == 0 && rec.departmentId == 0
        )
        // console.log(`remove list => ${JSON.stringify(removeList)}`)
        tempList = list.filter((val) => !removeList.includes(val))
      } else if (data.departmentId > 0) {
        const removeList = list.filter(
          (rec) =>
            rec.locationId == data.locationId && rec.areaId == data.areaId && rec.departmentId == 0
        )
        // console.log(`remove list => ${JSON.stringify(removeList)}`)
        tempList = list.filter((val) => !removeList.includes(val))
      }
      // console.log(`tempList => ${JSON.stringify(tempList)}`)
      setLocationDetail(tempList)
    }

    locationDetailValidate()
  }

  const handleSaveOnClick = () => {
    try {
      if (locationDetailValidate()) {
        const locations: any = locationDetail.map(
          ({ address, locationName, areaName, departmentName, ...keepAttrs }) => keepAttrs
        )
        // remove extra field
        locations.forEach((obj: any) => {
          if (obj.areaId == 0) delete obj['areaId']
          if (obj.departmentId == 0) delete obj['departmentId']
          // delete obj['locationName']
          // delete obj['areaName']
          // delete obj['departmentName']
        })
        const uniqueLocations = Array.from(new Set(locations.map(JSON.stringify))).map((o: any) =>
          JSON.parse(o)
        )
        // console.log(`uniqeLocations => ${JSON.stringify(uniqueLocations)}`)
        const data: TagAssignFeedbackFormSchema = {
          caseType: caseType,
          locations: [...uniqueLocations],
        }
        // console.log(`feedbackId => ${feedbackId}`)
        // console.log(`data => ${JSON.stringify(data)}`)
        dispatch(createAssignFeedback({ id: feedbackId, data: data })).then((response) => {
          if (response.meta.requestStatus == 'fulfilled') {
            setCaseType('Simple Case')
            setLocationDetail([])
            toast.success('Saving Successful', {
              position: toast.POSITION.TOP_RIGHT,
            })
            dispatch(setActiveTagAssignFeedBackForm({ active: false, feedbackId: 0 }))
          } else if (response.meta.requestStatus == 'rejected') {
            toast.error('Something was wrong', {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
        })
      }
    } catch (err) {}
  }

  const hanldeRadioOnClick = (e: any) => {
    // console.log(e.target.value)
    setCaseType(e.target.value)
    if (e.target.value === 'Simple Case' && locationDetail.length > 1) {
      setLocationDetail([locationDetail[0]])
    } else {
      assignLocationHandler()
    }
  }
  const handleOnClose = () => {
    // console.log(`handleOnClose.....`)
    dispatch(setActiveTagAssignFeedBackForm({ active: false, feedbackId: 0 }))
  }
  return (
    <Dialog onClose={handleOnClose} open={true}>
      <div className='w-[600px] mx-auto h-auto  '>
        <div className='relative bg-white rounded-lg shadow-2xl border border-lg'>
          <button
            type='button'
            className='absolute top-5 right-2.5 
                        text-gray-400 bg-transparent
                        hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                        text-sm p-1.5 ml-auto inline-flex items-center'
            onClick={() => {
              dispatch(setActiveTagAssignFeedBackForm({ active: false, feedbackId: 0 }))
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
            <span className='px-6'>Tag & Assign Feedback</span>
            <div className='border border-b-0 mt-4 '></div>

            {/* Form */}
            <form className='space-y-6 px-7 '>
              {/* Case Type */}
              <label
                className='block mb-2 text-sm 
                                font-medium text-gray-900'
              >
                Case Type
                <span className='text-red-900 font-bold'>*</span>
              </label>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={caseType}
                onChange={(e) => {
                  hanldeRadioOnClick(e)
                }}
                sx={{ fontSize: '3px' }}
              >
                <FormControlLabel
                  value='Simple Case'
                  control={<Radio />}
                  label={<span style={{ fontSize: '15px' }}> Simple Case</span>}
                  sx={{ marginRight: '100px' }}
                />
                <FormControlLabel
                  value='Complex Case'
                  control={<Radio />}
                  label={<span style={{ fontSize: '15px' }}> Complex Case</span>}
                />
              </RadioGroup>
              <div className='flex  '>
                <label
                  className='block mb-2 text-sm 
                                font-medium text-gray-900'
                >
                  Assign Feedback to more Departments
                  <span className='text-red-900 font-bold'>*</span>
                </label>
                <div
                  className={clsx(
                    'w-[20px] h-[20px] bg-[#DFF1EB] ml-2 hover:bg-green-900 hover:text-white hover:text-3xl',
                    caseType === 'Simple Case' && 'hidden'
                  )}
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
                      <LocationDetailCustomV2
                        key={i}
                        index={i}
                        showLocationSelectAll={false}
                        locationId={data.locationId!}
                        areaId={data.areaId!}
                        departmentId={data.departmentId!}
                        handleRemoveClick={handleRemoveClick} // handleRemoveClick
                        updateLocationDetail={updateLocationDetail}
                        titleHidden={false}
                        locationName={data.locationName!}
                        areaName={data.areaName!}
                        departmentName={data.departmentName!}
                        locationEnable={i === 0 ? true : false}
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
                                disabled:opacity-50 text-sm'
                onClick={handleSaveOnClick}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default TagAssignFeedbackFormModal
