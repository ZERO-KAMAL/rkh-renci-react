import { Radio } from '@mui/material'
import { setFields } from 'app/http/feedback-form/feedBackFormCreationSlice'
import { FC, useState } from 'react'

import emoji2 from '../../../../assets/gif/frowning_face.gif'
import emoji3 from '../../../../assets/gif/grinning_face_with_smiling_eyes.gif'
import emoji5 from '../../../../assets/gif/nutral_face.gif'
import emoji1 from '../../../../assets/gif/pouting_face.gif'
import emoji4 from '../../../../assets/gif/smiling_face_with_heart_eyes.gif'

interface IValue {
  fieldName: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  data: IValue
  name: string
  setField: any
  value: any
  emojiType?: 'fourIcons' | 'fiveIcons'
  isError: boolean
}

const PublicSmilyFace: FC<Props> = ({ data, name, setField, value, emojiType, isError }) => {

  const handleChange = (id: number) => {
    setField(`${name}`, id)
  }

  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div className='flex items-center justify-between p-2 max-md:p-0 border rounded' style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}>
        <div className='flex items-center'>
          <Radio
            checked={value === 1}
            onChange={() => handleChange(1)}
            sx={{
              color: '#A1A5B7',
              p: 0,
              '&.Mui-checked': {
                color: '#2BA579',
              },
            }}
          />
          <img className='w-[40px] max-md:w-[30px]' src={emoji1} alt='loading...' />
        </div>
        <div className='flex items-center'>
          <Radio
            checked={value === 2}
            onChange={() => handleChange(2)}
            sx={{
              color: '#A1A5B7',
              p: 0,
              '&.Mui-checked': {
                color: '#2BA579',
              },
            }}
          />
          <img className='w-[40px] max-md:w-[30px]' src={emoji2} alt='loading...' />
        </div>
        {
          emojiType === 'fiveIcons' &&
          <div className='flex items-center'>
            <Radio
              checked={value === 3}
              onChange={() => handleChange(3)}
              sx={{
                color: '#A1A5B7',
                p: 0,
                '&.Mui-checked': {
                  color: '#2BA579',
                },
              }}
            />
            <img className='w-[40px] max-md:w-[30px]' src={emoji5} alt='loading...' />
          </div>
        }
        <div className='flex items-center'>
          <Radio
            checked={value === (emojiType === 'fiveIcons' ? 4 : 3)}
            onChange={() => handleChange(emojiType === 'fiveIcons' ? 4 : 3)}
            sx={{
              color: '#A1A5B7',
              p: 0,
              '&.Mui-checked': {
                color: '#2BA579',
              },
            }}
          />
          <img className='w-[40px] max-md:w-[30px]' src={emoji3} alt='loading...' />
        </div>
        <div className='flex items-center'>
          <Radio
            checked={value === (emojiType === 'fiveIcons' ? 5 : 4)}
            onChange={() => handleChange(emojiType === 'fiveIcons' ? 5 :4)}
            sx={{
              color: '#A1A5B7',
              p: 0,
              '&.Mui-checked': {
                color: '#2BA579',
              },
            }}
          />
          <img className='w-[40px] max-md:w-[30px]' src={emoji4} alt='loading...' />
        </div>
      </div>
    </div>
  )
}

export default PublicSmilyFace
