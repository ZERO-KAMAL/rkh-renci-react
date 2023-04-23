import { Checkbox } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const SubHeaderField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState({
    fieldName: 'Sub Header',
    text: 'Sub Header',
    required: false,
  })

  const onTextChange = (e: any) => {
    const val = { ...value, text: e.target.value === "" ? "Sub Header" : e.target.value }
    setValue(val)
    onChange(val)
  }

  useEffect(() => {
    if (prevValue) setValue(prevValue)
    else onChange(value)
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px]'>
      <textarea
        className='bg-transparent text-lg font-medium focus:outline-none rounded-md flex-1 border-none outline-none w-full'
        value={value.text === "Sub Header" ? "" : value.text}
        placeholder="Sub Header"
        onChange={onTextChange}
      ></textarea>
    </div>
  )
}

export default SubHeaderField
