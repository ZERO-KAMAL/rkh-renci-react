import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { Dayjs } from 'dayjs'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgDetailsMore } from 'react-icons/cg'
import { useDebounce } from 'usehooks-ts'

import {
  defParams,
  fetchArchiveFeedback,
  fetchFeedback,
  fetchFeedbackType,
  setActiveFilterForm,
  setFeedbackType,
  setFromToDate,
  setSearch,
  setStatus,
} from '../../../http/feedbacks/feedBackSlice'
import MultiSelectDropdown from '../components/MulitSelectDropdown'

const SearchBar = (parms: any) => {
  // console.log(`Search Bar rendering....`)
  const [fbValues, setFbValues] = useState<Array<string>>([])
  const [statusValues, setStatusValues] = useState<Array<string>>([])
  const [searchText, setSearchTest] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [clickedOutside, setClickedOutside] = useState(false)
  const myRef = useRef(null)
  const dispatch = useAppDispatch()
  const {
    dataTableFeedback,
    page,
    limit,
    text,
    feedbackType,
    source,
    salutation,
    status,
    order,
    feedbackTypeList,
    statusList,
  } = useAppSelector((state) => state.feedback)

  const initFetch = useCallback(async () => {
    if (parms.title !== 'Archive') {
      await dispatch(fetchFeedback())
    } else {
      await dispatch(fetchArchiveFeedback())
    }
  }, [])
  // console.log(feedbackTypeList)
  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      dispatch(
        setFromToDate({
          from: moment(startDate).startOf('day').local().format(),
          to: moment(endDate).endOf('day').local().format(),
        })
      )

      initFetch()
    } else if (startDate == null && endDate == null) {
      dispatch(
        setFromToDate({
          from: '',
          to: '',
        })
      )
      initFetch()
    }
  }, [startDate, endDate])
  // useEffect(() => {

  // }, [debouncedText,fbValues,statusValues])

  useEffect(() => {
    // console.log('changes.....')
    // console.log(`feedback values => ${JSON.stringify(fbValues)}`)
    // console.log(`status values => ${JSON.stringify(statusValues)}`)
    if (!fbValues || !statusValues) return

    dispatch(setFeedbackType(fbValues.join()))
    dispatch(setStatus(statusValues.join()))
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceTest => ${debouncedText}`)
      dispatch(setSearch(debouncedText))
    }
    initFetch()
  }, [fbValues, statusValues, debouncedText, page, limit, order])

  const handleClickOutside = (e: any) => {}

  // const FeedBackComp = useMemo(()=>
  //     <MultiSelectDropdown
  //     title='FeedbackType'
  //     datas={FeedbackType}
  //     values={fbValues}
  //     setValues={setFbValues}
  //   />,[fbValues])

  // const StatusComp = useMemo(()=>
  //     <MultiSelectDropdown
  //     title='Status'
  //     datas={Status}
  //     values={statusValues}
  //     setValues={setStatusValues}
  //   />,[statusValues])

  return (
    <div
      className='bg-white mt-4 rounded-lg py-[20px]
                  flex md:flex-nowrap flex-wrap justify-between items-center px-4 mb-8'
    >
      {/* Feedback Type */}
      <div className='flex w-full md:mb-0 mb-3'>
        <div className='flex flex-col md:w-[90%] w-[100%]'>
          <MultiSelectDropdown
            title='Feedback Type'
            datas={feedbackTypeList}
            values={fbValues}
            setValues={setFbValues}
          />
        </div>
      </div>

      {/* Status */}
      <div className='flex w-full md:mb-0 mb-3'>
        <div className='flex flex-col md:w-[90%] w-[100%]'>
          <MultiSelectDropdown
            title='Status'
            datas={statusList}
            values={statusValues}
            setValues={setStatusValues}
          />
        </div>
      </div>

      {/* Search */}
      <div className='flex items-start flex-col w-full my-3'>
        <span className='mb-3 text-gray-400 text-sm'> Search </span>
        <div
          className='w-full md:w-[90%] md:mr-2
              h-[35px] flex items-center bg-[#ECF0F3] rounded-lg pl-2 '
        >
          <AiOutlineSearch size={20} />
          <input
            type='text'
            name='search'
            id='search'
            placeholder='Search ...'
            className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-md text-sm'
            onChange={(e) => {
              setSearchTest(e.target.value)
            }}
            autoComplete='off'
            required
          />
        </div>
      </div>

      {/* Date */}
      <div className='flex w-full md:mb-0 mb-3'>
        <div className='flex items-start flex-col w-full'>
          <span className='mb-3  text-gray-400 text-sm '> Date </span>
          <div className='pl-3 bg-[#ECF0F3] rounded-lg w-full'>
            <DatePicker
              selectsRange={true}
              placeholderText='Select date range'
              startDate={startDate}
              endDate={endDate}
              onChange={(update: any) => {
                setDateRange(update)
              }}
              dateFormat='dd/MM/yyyy'
              className='h-[35px] min-w-full bg-transparent rounded-sm ml-2 focus:outline-none text-sm'
              isClearable={true}
            />
          </div>
        </div>
      </div>

      {/* More */}
      <div className='flex items-start flex-col md:ml-3'>
        <span className='mb-4 text-gray-400 text-sm'> More </span>
        <CgDetailsMore
          size={30}
          onClick={() => {
            dispatch(setActiveFilterForm(true))
          }}
        />
      </div>
    </div>
  )
}

export default SearchBar
