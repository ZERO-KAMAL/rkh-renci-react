import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const LongTextField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({ fieldName: 'Long Text', text: '', required: false })

  const onFieldChange = (e: any) => {
    const val = { ...value, fieldName: e.target.value === "" ? "Long Text" : e.target.value }
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
        value={value.fieldName === 'Long Text' ? "" : value.fieldName}
        placeholder="Long Text"
        onChange={onFieldChange}
      />
      <textarea
        className='bg-[#ECF0F3] text-[#A1A5B7] focus:outline-none rounded-md text-sm flex-1 p-4 w-full'
        value={value.text}
        placeholder='Long Text'
        onChange={onTextChange}
      ></textarea>
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

export default LongTextField
