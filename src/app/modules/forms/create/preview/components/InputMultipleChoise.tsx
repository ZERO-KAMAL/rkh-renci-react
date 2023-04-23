import { Checkbox, Radio } from '@mui/material'
import { FC, useState } from 'react'

interface Props {
  id?: number
  type?: string
  value: any
}

const InputMultipleChoise: FC<Props> = ({ value }) => {
  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      {value?.options?.map((item: any, index: number) => {
        return (
          <div className='flex items-center justify-center' key={index}>
            <Checkbox
              onChange={() => null}
              sx={{
                color: '#A1A5B7',
                '&.Mui-checked': {
                  color: '#2BA579',
                },
              }}
            />
            <p className='w-full text-sm text-[#A1A5B7] font-medium]'>{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}

export default InputMultipleChoise
