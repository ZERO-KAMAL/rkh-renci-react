import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const FullName: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({ fieldName: 'Full Name', name: '', required: false })

  const nameOnChange = (e: any) => {
    const val = { ...value, name: e.target.value }
    setValue(val)
    onChange(val)
  }
  const checkNameOnChange = (e: any) => {
    const val = { ...value, required: e.target.checked }
    setValue(val)
    onChange(val)
  }

  useEffect(() => {
    if (prevValue) setValue(prevValue)
    else onChange(value)
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px]'>
      <p className='text-[14px] font-medium mb-3'>Full Name</p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 text-[#A1A5B7] w-full'
        type='text'
        value={value.name}
        placeholder={'Full Name'}
        onChange={nameOnChange}
      />
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
          onChange={checkNameOnChange}
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default FullName
