import { Radio } from '@mui/material'
import { FC, useState } from 'react'

import emoji2 from '../../../../../assets/gif/frowning_face.gif'
import emoji3 from '../../../../../assets/gif/grinning_face_with_smiling_eyes.gif'
import emoji5 from '../../../../../assets/gif/nutral_face.gif'
import emoji1 from '../../../../../assets/gif/pouting_face.gif'
import emoji4 from '../../../../../assets/gif/smiling_face_with_heart_eyes.gif'

interface IValue {
  fieldName: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  value: IValue
  emojiType?: 'fourIcons' | 'fiveIcons'
}

const SmilyFace: FC<Props> = ({ value, emojiType }) => {
  const [checked, setChecked] = useState<number | null>(null)

  const handleChange = (id: number) => {
    setChecked(id)
  }

  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div className='flex items-center justify-between p-2 max-md:p-0 border rounded'>
        <div className='flex items-center'>
          <Radio
            checked={checked === 1}
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
            checked={checked === 2}
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
              checked={checked === 5}
              onChange={() => handleChange(5)}
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
            checked={checked === 3}
            onChange={() => handleChange(3)}
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
            checked={checked === 4}
            onChange={() => handleChange(4)}
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

export default SmilyFace
