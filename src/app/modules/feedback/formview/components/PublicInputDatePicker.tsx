import { Box, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import moment from 'moment'
import { FC, useState } from 'react'

interface IValue {
  fieldName: string
  date: any
  required: boolean
}
interface Props {
  id?: number
  type?: string
  data: IValue
  onChange?: any
  onBlur?: any
  name?: any
  setField?: any
  value: any
  isError: boolean
}

const PublicInputDatePicker: FC<Props> = ({ data, onChange, onBlur, name, setField, value, isError }) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <Box className='bg-[#ECF0F3] rounded' style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat='DD/MM/YYYY'
            value={(value && value !== "") ? value : ""}
            onChange={(newValue) => {
              setField(`${name}`, newValue)
            }}
            maxDate={dayjs(moment().format('YYYY-MM-DD'))}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    borderRadius: '6px',
                  },
                  '& .MuiInputBase-input': {
                    height: '5px'
                  },
                }}
                placeholder='Select Date'
                fullWidth
              />
            )}
          />
        </LocalizationProvider>
      </Box>
    </div>
  )
}

export default PublicInputDatePicker
