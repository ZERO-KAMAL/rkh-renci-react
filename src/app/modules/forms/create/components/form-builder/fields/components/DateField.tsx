import { Box, Checkbox, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const DateField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({
    fieldName: 'Date',
    date: null,
    required: true,
  })

  useEffect(() => {
    if (prevValue) setValue(prevValue)
    else onChange(value)
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px]'>
      <input
        type='text'
        className='text-[14px] font-medium mb-3 border-none outline-none w-full'
        value={value.fieldName === "Date" ? "" : value.fieldName}
        placeholder="Date"
        onChange={(e: any) => {
          setValue({ ...value, fieldName: e.target.value === "" ? "Date" : e.target.value })
          onChange({ ...value, fieldName: e.target.value === "" ? "Date" : e.target.value })
        }}
      />
      <Box className='bg-[#ECF0F3] rounded'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            mask=''
            inputFormat='DD/MMM/YYYY'
            value={value.date}
            onChange={(newValue) => {
              setValue({ ...value, date: newValue as any })
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
      <div className='flex mt-6'>
        <Checkbox
          color='success'
          sx={{
            p: '0',
            color: '#A1A5B7',
            '&.Mui-checked': {
              color: '#2BA579',
            },
          }}
          checked={value.required}
          onChange={(e: any) => {
            setValue({ ...value, required: e.target.checked })
            onChange({ ...value, required: e.target.checked })
          }}
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default DateField
