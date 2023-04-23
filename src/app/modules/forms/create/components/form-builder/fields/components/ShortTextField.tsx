import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const ShortTextField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({ fieldName: 'Short Text', text: '', required: false })

  const onFieldChange = (e: any) => {
    const val = { ...value, fieldName: e.target.value === "" ? "Short Text" : e.target.value }
    setValue(val)
    onChange(val)
  }
  const onTextChange = (e: any) => {
    const val = { ...value, text: e.target.value }
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
      <input
        type='text'
        className='text-[14px] font-medium mb-3 border-none outline-none w-full'
        value={value.fieldName === 'Short Text' ? "" : value.fieldName}
        placeholder="Short Text"
        onChange={onFieldChange}
      />
      <input
        className='bg-[#ECF0F3] text-[#A1A5B7] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        type='text'
        value={value.text}
        placeholder='Short Text'
        onChange={onTextChange}
      />
      <div className='flex mt-6'>
        <Checkbox
          color='success'
          sx={{
            color: '#A1A5B7',
            p: '0',
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

export default ShortTextField
