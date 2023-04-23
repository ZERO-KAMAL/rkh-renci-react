import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { GrFormDown, GrFormUp } from 'react-icons/gr'

interface Props {
  value: any
  onChange: (v: any) => void
}

const DropDownField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [dropDownOn, setDropDownOn] = useState(false)
  const [options, setOptions] = useState([
    { id: 1, value: 'Enter Option 1' },
    { id: 2, value: 'Enter Option 2' },
  ])
  const [value, setValue] = useState({
    fieldName: 'Dropdown',
    text: '',
    options: options,
    required: false,
  })

  const inputOnChange = (id: number, val: string) => {
    const newOptions = options.map((a) => (a.id === id ? { ...a, value: val === "" ? `Enter Option ${id}` : val } : a))
    setOptions(newOptions)
    setValue({ ...value, options: newOptions as any })
    onChange({ ...value, options: newOptions as any })
  }

  const addOption = () => {
    const newOptions = [
      ...options,
      { id: options.length + 1, value: `Enter Option ${options.length + 1}` },
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
        value={value.fieldName === "Dropdown" ? "" : value.fieldName}
        placeholder="Dropdown"
        onChange={(e: any) => {
          setValue({ ...value, fieldName: e.target.value === "" ? "Dropdown" : e.target.value })
          onChange({ ...value, fieldName: e.target.value === "" ? "Dropdown" : e.target.value })
        }}
      />
      <div
        className='bg-[#ECF0F3] h-[40px] w-full focus:outline-none rounded-md text-sm flex-1 px-4 cursor-pointer flex justify-between items-center'
        onClick={() => setDropDownOn(!dropDownOn)}
      >
        <input
          type='text'
          className='text-[#A1A5B7] text-base font-normal leading-10 border-none outline-none bg-transparent w-full'
          value={value.text}
          placeholder='Dropdown list text'
          onChange={(e: any) => {
            setValue({ ...value, text: e.target.value })
            onChange({ ...value, text: e.target.value })
          }}
        />
        {dropDownOn ? (
          <GrFormUp
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        ) : (
          <GrFormDown
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        )}
      </div>
      {dropDownOn && (
        <div className='w-full h-auto pt-[25px] px-[28px] z-10'>
          {options?.map((item) => {
            return (
              <input
                className='w-full border-none outline-none text-sm text-[#A1A5B7] font-medium pb-[22px]'
                key={item.id}
                value={item.value === `Enter Option ${item.id}` ? "" : item.value}
                placeholder={`Enter Option ${item.id}`}
                onChange={(e) => inputOnChange(item.id, e.target.value)}
              />
            )
          })}
          <div className='mt-1'>
            <span
              className='text-base font-medium text-[#2BA579] underline cursor-pointer'
              onClick={addOption}
            >
              Add Option
            </span>
          </div>
        </div>
      )}
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

export default DropDownField
