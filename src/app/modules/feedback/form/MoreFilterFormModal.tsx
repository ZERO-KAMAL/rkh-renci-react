import { Dialog } from '@mui/material'
import LocationDetailCustom from 'app/components/LocationDetailCustom'
import MulitSelectDropdown from 'app/components/MulitSelectDropdown'
import {
  fetchArchiveFeedback,
  fetchFeedback,
  setActiveFilterForm,
  setFromToDate,
  setMoreFilter,
  setReset,
} from 'app/http/feedbacks/feedBackSlice'
import { LocationDetailFormScheam } from 'app/http/location-datas/locationDetail.model'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TbChevronsUpLeft } from 'react-icons/tb'

const MoreFilterFormModal = (parms: any) => {
  const dispatch = useAppDispatch()
  const {
    feedbackTypeList,
    sourceList,
    salutationList,
    tatList,
    page,
    limit,
    text,
    feedbackType,
    source: sourceData,
    salutation,
    status,
    order,
  } = useAppSelector((state) => state.feedback)

  const [sources, setSources] = useState<Array<string>>([])
  const [tat, setTat] = useState<Array<string>>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [location, setLocation] = useState<LocationDetailFormScheam>({
    locationId: 0,
    areaId: 0,
    departmentId: 0,
    address: '',
  })



  const getFromToDate = (tat: any) => {
    let start = 0
    let end = 0
    if (tat.length > 0) {
      tat.forEach((data: any) => {
        const tempStart = isNaN(Number(data.replace(' Days', '').split('-')[0]))
          ? Number(data.replace(' and more', '-').split('-')[0])
          : Number(data.replace(' Days', '').split('-')[0])

        const tempEnd = isNaN(Number(data.replace(' Days', '').split('-')[1]))
          ? Number(data.replace(' and more', '-').split('-')[0])
          : Number(data.replace(' Days', '').split('-')[1])

        // console.log(`tempStart => ${tempStart}`)
        // console.log(`tempEnd => ${tempEnd}`)
        if (start == 0) start = tempStart
        else {
          start = start > tempStart ? tempStart : start
        }
        if (end == 0) end = tempEnd
        else {
          end = end < tempEnd ? tempEnd : end
        }
      })
      // console.log(`start - ${start} - end - ${end}`)
      setFrom(moment(moment().add(1, 'days').add(-end, 'days')).format('YYYY-MM-DD'))
      setTo(moment(moment().add(1, 'days').add(-start, 'days')).format('YYYY-MM-DD'))
    } else {
      setFrom('')
      setTo('')
    }
  }

  const SourceComp = useMemo(
    () => (
      <MulitSelectDropdown
        title='Source'
        datas={sourceList}
        values={sources}
        setValues={setSources}
        isObject={false}
      />
    ),
    [sources]
  )
  const TATComp = useMemo(
    () => (
      <MulitSelectDropdown
        title='TAT'
        datas={tatList}
        values={tat}
        setValues={setTat}
        isObject={true}
      />
    ),
    [tat]
  )

  // const updateLocationDetail = (data : any) =>{
  //   console.log(`updateLocationDetail...${JSON.stringify(data)}`)
  //   setLocation(data)
  // }
  const updateLocationDetail = useCallback((data: any) => {
    // console.log(`updateLocationDetail...${JSON.stringify(data)}`)
    setLocation(data)
  }, [])
  const loationDetail = useMemo(
    () => (
      <LocationDetailCustom
        index={0}
        locationId={0}
        areaId={0}
        departmentId={0}
        handleRemoveClick={() => {}} // handleRemoveClick
        updateLocationDetail={updateLocationDetail}
        titleHidden={true}
      />
    ),
    [location]
  )
  useEffect(() => {
    // console.log(`location change....`)
  }, [location])
  
  useEffect(() => {
    // console.log(`tat => ${tat.toString()}`)
    getFromToDate(tat)
  }, [tat])
  // Action
  // const updateLocationDetail = useCallback(
  //   (data: any) => {
  //     console.log(`updateLocationDetail...${JSON.stringify(data)}`)
  //     setLocation(data)
  //   },
  //   [location]
  // )
  const initialSetup = () => {
    setSources([])
    setTat([])
    setFrom('')
    setTo('')

    setLocation({
      locationId: 0,
      areaId: 0,
      departmentId: 0,
      address: '',
    })
  }
  const handleMoreFilter = () => {
    try {
      const { locationId, areaId, departmentId } = location
      // setting
      const source = sources.toString()
      if (from === to) dispatch(setFromToDate({ from: '', to: to }))
      else dispatch(setFromToDate({ from: from, to: to }))
      dispatch(setMoreFilter({ source, locationId, areaId, departmentId }))
      // call api
      if (parms.title === 'Archive') {
        dispatch(fetchArchiveFeedback())
      } else {
        dispatch(fetchFeedback())
      }
    } catch (err) {}
  }
  const handleOnClose = () => {
    // console.log(`handleOnClose.....`)
    dispatch(setActiveFilterForm(false))
  }
  const handleReset = () => {
    try {
      // console.log(`handleReset.....`)
      initialSetup()

      dispatch(setReset())
      if (parms.title === 'Archive') {
        dispatch(fetchArchiveFeedback())
      } else {
        dispatch(fetchFeedback())
      }
    } catch (err) {}
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
            data-modal-toggle='location-modal'
            onClick={() => {
              dispatch(setActiveFilterForm(false))
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
            <span className='px-6 font-bold'>More Filters</span>
            <div className='border border-b-0 mt-4 '></div>

            {/* Form */}
            <form className='space-y-6 px-7'>
              <div className='mt-4'>{SourceComp}</div>
              <div>
                <LocationDetailCustom
                  index={0}
                  locationId={location.locationId!}
                  areaId={0}
                  departmentId={0}
                  handleRemoveClick={() => {}} // handleRemoveClick
                  updateLocationDetail={updateLocationDetail}
                  titleHidden={true}
                />
              </div>
              <div className='mt-4'>{TATComp}</div>
            </form>
            <div className='border border-b-0 mt-8 '></div>
            <div className='flex justify-end mt-5 mx-5'>
              <button
                className='bg-red-600 p-3 text-white rounded-md mr-3 
                 disabled:opacity50 text-sm'
                onClick={() => {
                  handleReset()
                }}
              >
                Reset
              </button>
              <button
                // type='submit'
                className='bg-[#2BA579] p-3 text-white rounded-md ml-3 
                            disabled:opacity-50 text-sm'
                onClick={() => {
                  handleMoreFilter()
                }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default MoreFilterFormModal
