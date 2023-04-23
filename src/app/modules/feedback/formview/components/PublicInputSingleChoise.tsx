import { Radio } from '@mui/material'
import { FC, useState } from 'react'
import { isTemplateMiddle } from 'typescript'

interface Props {
  id?: number
  type?: string
  data: any
  name: string
  setField: any
  value: any
  isError: boolean
}

const PublicInputSingleChoise: FC<Props> = ({ data, name, setField, value, isError }) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}>
        {data?.options?.map((item: any, index: number) => {
          return (
            <div className='flex items-center justify-center' key={index}>
              <Radio
                checked={item.value === value}
                onChange={()=>{
                  setField(`${name}`, item.value)
                }}
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
    </div>
  )
}

export default PublicInputSingleChoise
