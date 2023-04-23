import { Box, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
// MUI
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Moment } from 'moment'
import React, { useState } from 'react'
// lib
import { AiOutlineCalendar } from 'react-icons/ai'

interface Props {
  label?: any
  labelStyles?: any
  maxWidth?: any

  onDateChange: (date: Moment) => void
}

const CustomDatePicker = ({ label, labelStyles, maxWidth, onDateChange }: Props) => {
  const [dateValue, setDateValue] = useState<Moment>()

  return (
    <Box className={`${maxWidth ? maxWidth : 'max-w-[323px]'} w-full`}>
      {label && (
        <Typography
          className={`font-roboto font-medium text-base text-[#7E8299] mb-4 pt-1 ${labelStyles}`}
        >
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={dateValue}
          inputFormat='DD/MM/YYYY'
          orientation='portrait'
          onChange={(newValue: Moment | null) => {
            if (newValue) {
              setDateValue(newValue)
              onDateChange(newValue)
            }
          }}
          components={{
            OpenPickerIcon: () => (
              <img src='/assets/svgs/calendar.svg' alt='calendar.svg' className='mr-2' />
            ),
          }}
          renderInput={(params) => <TextField className='text-[#A1A5B7]' {...params} />}
          className='bg-[#ECF0F3] text-[#A1A5B7] rounded-md w-full'
        />
      </LocalizationProvider>
    </Box>
  )
}

export default CustomDatePicker
