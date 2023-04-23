import { Box, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
// MUI
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
// lib
import { AiOutlineCalendar } from 'react-icons/ai'

const CustomDatePicker2 = ({ label, labelStyles, maxWidth, handleChange, date }: any) => {
  const [dateValue, setDateValue] = useState(null)

  useEffect(() => {
    if (date) {
      setDateValue(date)
    }
  }, [date])

  return (
    <Box className={`${maxWidth ? maxWidth : 'w-full'}`}>
      {label && (
        <Typography
          className={`font-roboto font-medium text-base text-[#7E8299] mb-4 ${labelStyles}`}
        >
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={dateValue}
          inputFormat='DD/MM/YYYY'
          orientation='portrait'
          views={['year', 'month', 'day']}
          onChange={(newValue) => {
            setDateValue(newValue)
            handleChange(newValue)
          }}
          components={{
            // OpenPickerIcon: () => {return (<img src='/assets/svgs/calendar.svg' className='mr-2' alt=''/>)},
          }}
          renderInput={(params) => <TextField className='text-[#A1A5B7]' size='small' {...params} />}
          className='bg-[#ECF0F3] text-[#A1A5B7] rounded-md w-full'
        />
      </LocalizationProvider>
    </Box>
  )
}

export default CustomDatePicker2
