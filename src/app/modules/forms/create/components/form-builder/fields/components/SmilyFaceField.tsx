import { Checkbox, Radio } from '@mui/material'
import { FC, useEffect, useState } from 'react'

import emoji2 from '../../../../../../../assets/gif/frowning_face.gif'
import emoji3 from '../../../../../../../assets/gif/grinning_face_with_smiling_eyes.gif'
import emoji5 from '../../../../../../../assets/gif/nutral_face.gif'
import emoji1 from '../../../../../../../assets/gif/pouting_face.gif'
import emoji4 from '../../../../../../../assets/gif/smiling_face_with_heart_eyes.gif'
interface Props {
  value: any
  onChange: (v: any) => void
  type: 'fourIcons' | 'fiveIcons'
}

const SmilyFaceField: FC<Props> = ({ value: prevValue, onChange, type }) => {
  const [value, setValue] = useState({ fieldName: 'Smiley Face', required: false })
  const [checked, setChecked] = useState<number | null>(null)

  const onFieldChange = (e: any) => {
    const val = { ...value, fieldName: e.target.value === "" ? 'Smiley Face' : e.target.value }
    setValue(val)
    onChange(val)
  }

  const onCheckChange = (e: any) => {
    const val = { ...value, required: e.target.checked }
    setValue(val)
    onChange(val)
  }

  const handleChange = (id: number) => {
    setChecked(id)
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
        value={value.fieldName === 'Smiley Face' ? '' : value.fieldName}
        placeholder='Smiley Face'
        onChange={onFieldChange}
      />
      <div className='flex items-center justify-between p-2 border rounded'>
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
          type === 'fiveIcons' &&
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

export default SmilyFaceField
