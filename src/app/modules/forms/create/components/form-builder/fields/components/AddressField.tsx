import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const AddressField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({
    fieldName: 'Address',
    street: '',
    unitNumber: '',
    postalCode: '',
    required: false,
  })

  const streetOnChange = (e: any) => {
    const val = { ...value, street: e.target.value }
    setValue(val)
    onChange(val)
  }
  const unitOnChange = (e: any) => {
    const val = { ...value, unitNumber: e.target.value }
    setValue(val)
    onChange(val)
  }
  const postalOnChange = (e: any) => {
    const val = { ...value, postalCode: e.target.value }
    setValue(val)
    onChange(val)
  }
  const checkOnChange = (e: any) => {
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
      <p className='text-[14px] font-medium mb-3'>Address</p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm px-4 w-full mb-5 text-[#A1A5B7]'
        type='text'
        value={value.street}
        placeholder='Street Address'
        onChange={streetOnChange}
      />
      <div className='flex gap-4 max-md:flex-col '>
        <input
          className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4 text-[#A1A5B7]'
          type='text'
          value={value.unitNumber}
          placeholder='Unit/Apt Number'
          onChange={unitOnChange}
        />
        <input
          className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4 text-[#A1A5B7]'
          type='text'
          value={value.postalCode}
          placeholder='Postal code'
          onChange={postalOnChange}
        />
      </div>
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
          onChange={checkOnChange}
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default AddressField
