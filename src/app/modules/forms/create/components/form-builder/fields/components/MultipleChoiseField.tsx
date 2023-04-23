import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const MultipleChoiseField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [options, setOptions] = useState([
    { id: 1, checked: false, value: 'Enter Option 1' },
    { id: 2, checked: false, value: 'Enter Option 2' },
  ])
  const [value, setValue] = useState({
    fieldName: 'Multiple Choice',
    options: options,
    required: false,
  })

  const handleChange = (id: number, value: string) => {
    const newOptions = options.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    setOptions(newOptions)
  }

  const textOnChange = (id: number, val: string) => {
    const newOptions = options.map((a) => (a.id === id ? { ...a, value: val === "" ? `Enter Option ${id}` : val } : a))
    setOptions(newOptions)
    setValue({ ...value, options: newOptions })
    onChange({ ...value, options: newOptions })
  }

  const addOption = () => {
    const newOptions = [
      ...options,
      { id: options.length + 1, checked: false, value: `Enter Option ${options.length + 1}` },
    ]
    setOptions(newOptions)
    setValue({ ...value, options: newOptions as any })
    onChange({ ...value, options: newOptions as any })
  }

  useEffect(() => {
    if (prevValue) {
      setValue(prevValue)
      setOptions(prevValue.options)
    }
    else onChange(value)
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px]'>
      <input
        type='text'
        className='text-[14px] font-medium mb-3 border-none outline-none w-full'
        value={value.fieldName === "Multiple Choice" ? "" : value.fieldName}
        placeholder="Multiple Choice"
        onChange={(e: any) => {
          setValue({ ...value, fieldName: e.target.value === "" ? "Multiple Choice" : e.target.value })
          onChange({ ...value, fieldName: e.target.value === "" ? "Multiple Choice" : e.target.value })
        }}
      />
      {options.map((item, index) => {
        return (
          <div className='flex items-center justify-center' key={index}>
            <Checkbox
              checked={item.checked}
              onChange={(e) => handleChange(item.id, e.target.value)}
              sx={{
                color: '#A1A5B7',
                '&.Mui-checked': {
                  color: '#2BA579',
                },
              }}
            />
            <input
              className='w-full border-none outline-none text-sm text-[#A1A5B7] font-medium]'
              value={item.value === `Enter Option ${item.id}` ? "" : item.value}
              placeholder={`Enter Option ${item.id}`}
              onChange={(e) => textOnChange(item.id, e.target.value)}
            />
          </div>
        )
      })}
      <div className='mt-5'>
        <span
          className='text-base font-medium text-[#2BA579] underline cursor-pointer'
          onClick={addOption}
        >
          Add Option
        </span>
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
export default MultipleChoiseField
