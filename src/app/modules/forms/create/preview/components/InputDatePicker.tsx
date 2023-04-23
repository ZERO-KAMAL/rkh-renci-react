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
  value: IValue
}

const InputDatePicker: FC<Props> = ({ value }) => {
  const [date, setDate] = useState<any>()
  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <Box className='bg-[#ECF0F3] rounded'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat='DD/MMM/YYYY'
            value={date}
            onChange={(newValue) => {
              setDate(newValue)
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
                    height: '5px',
                    color: '#A1A5B7',
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

export default InputDatePicker
