import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { BsCardImage } from 'react-icons/bs'

interface Props {
  value: any
  onChange: (v: any) => void
}

const UploadImage: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({ fieldName: 'Upload Image', value: '', required: false })

  useEffect(() => {
    if (prevValue) setValue(prevValue)
    else onChange(value)
  }, [])

  return (
    <div className='w-[250px] bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px]'>
      <input
        type='text'
        className='text-[14px] font-medium mb-3 border-none outline-none w-full'
        value={value.fieldName === "Upload Image" ? "" : value.fieldName}
        placeholder="Upload Image"
        onChange={(e: any) => {
          setValue({ ...value, fieldName: e.target.value === "" ? "Upload Image" : e.target.value })
          onChange({ ...value, fieldName: e.target.value === "" ? "Upload Image" : e.target.value })
        }}
      />
      <div className='w-[184px] h-[113px] bg-[#ECF0F3] flex flex-col justify-center items-center'>
        <BsCardImage size={'30px'} className='text-skin-primary' />
        <span className='text-base font-medium text-[#A1A5B7] mt-2'>Take Photo</span>
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

export default UploadImage
