import { Checkbox, Radio } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  id?: number
  type?: string
  data: any
  name: string
  setField: any
  value: any
  isError: boolean
}

const PublicInputMultipleChoise: FC<Props> = ({ data, name, setField, value, isError }) => {
  const [selected, setSelected] = useState<any>([]);

  const changeHandler = (value: any) => {
    const newArr = [...selected];
    const index = newArr.indexOf(value);
    if (index === -1) {
      newArr.push(value);
    } else {
      newArr.splice(index, 1);
    }
    setSelected(newArr);
    setField(`${name}`, newArr.length > 0 ? newArr : "")
  }

  useEffect(()=> {
    if(!value) {
      setSelected([])
    }
  }, [value])

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
              <Checkbox
                onChange={()=>changeHandler(item.value)}
                sx={{
                  color: '#A1A5B7',
                  '&.Mui-checked': {
                    color: '#2BA579',
                  },
                }}
                checked={selected.includes(item.value)}
              />
              <p className='w-full text-sm text-[#A1A5B7] font-medium]'>{item.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PublicInputMultipleChoise
