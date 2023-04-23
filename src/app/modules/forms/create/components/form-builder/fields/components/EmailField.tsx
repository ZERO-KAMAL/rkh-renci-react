import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const EmailField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({ fieldName: 'Email', email: '', required: false })

  const onChangeEmail = (e: any) => {
    const val = { ...value, email: e.target.value }
    setValue(val)
    onChange(val)
  }

  const onCheckChange = (e: any) => {
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
      <p className='text-[14px] font-medium mb-3'>Email</p>
      <input
        className='bg-[#ECF0F3] h-[40px] text-[#A1A5B7] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        type='text'
        value={value.email}
        placeholder={'Email'}
        onChange={onChangeEmail}
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
          onChange={onCheckChange}
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default EmailField
